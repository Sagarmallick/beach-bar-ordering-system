import { supabase } from "./supabaseClient"

export type Vendor = {
    id: string
    name: string
    slug: string
    qr_secret: string
}

export async function getVendorBySlug(slug: string): Promise<Vendor | null> {
    const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("slug", slug)
        .single()

    if (error || !data) return null
    return data
}
