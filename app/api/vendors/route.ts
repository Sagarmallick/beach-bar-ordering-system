import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// This uses the SERVICE ROLE key — it bypasses ALL RLS policies.
// This is safe because it only runs on the server, never in the browser.
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
    try {
        const { name, slug, qr_secret } = await req.json()

        if (!name || !slug || !qr_secret) {
            return NextResponse.json({ error: "Missing required fields: name, slug, qr_secret" }, { status: 400 })
        }

        // Verify the caller is actually a super-admin using their auth token
        const authHeader = req.headers.get("Authorization")
        if (!authHeader) {
            return NextResponse.json({ error: "Unauthorized - no auth token" }, { status: 401 })
        }

        const token = authHeader.replace("Bearer ", "")

        // Get the user from the token (using regular client to verify)
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized - invalid token" }, { status: 401 })
        }

        // Check their profile role
        const { data: profile, error: profileError } = await supabaseAdmin
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()

        if (profileError || !profile) {
            return NextResponse.json({ error: "Could not fetch user profile" }, { status: 403 })
        }

        if (profile.role !== "super-admin") {
            return NextResponse.json({ error: "Forbidden - Super Admin access required" }, { status: 403 })
        }

        // All checks passed — insert the vendor using admin (bypasses RLS)
        const { data, error } = await supabaseAdmin
            .from("vendors")
            .insert({ name, slug: slug.toLowerCase().replace(/ /g, "-"), qr_secret })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ vendor: data }, { status: 201 })
    } catch (err) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
