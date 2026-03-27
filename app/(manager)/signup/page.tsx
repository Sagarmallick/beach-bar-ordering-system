"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

export default function SignupPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [vendorName, setVendorName] = useState("")
    const [slug, setSlug] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const finalSlug = slug.trim().toLowerCase().replace(/ /g, "-")

        if (!vendorName.trim() || !finalSlug) {
            setError("Please provide a valid bar/vendor name.")
            setLoading(false)
            return
        }

        // 1. Check if slug is already taken
        const { data: existingVendor } = await supabase
            .from("vendors")
            .select("id")
            .eq("slug", finalSlug)
            .single()

        if (existingVendor) {
            setError(`The slug "${finalSlug}" is already taken. Please choose a different name.`)
            setLoading(false)
            return
        }

        // 2. Create the user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
                emailRedirectTo: `${window.location.origin}/`,
            }
        })

        if (authError) {
            setError(authError.message)
            setLoading(false)
            return
        }

        if (authData.user) {
            // 3. Create the vendor record
            const qrSecret = Math.random().toString(36).substring(2, 15)
            const { data: vendorData, error: vendorError } = await supabase
                .from("vendors")
                .insert({
                    name: vendorName.trim(),
                    slug: finalSlug,
                    qr_secret: qrSecret,
                    is_subscribed: true, // Static true — payment integration later
                })
                .select()
                .single()

            if (vendorError) {
                console.error("Vendor creation error:", vendorError)
                setError("Account created, but bar setup failed: " + vendorError.message)
                setLoading(false)
                return
            }

            // 4. Create/update the profile and link to the new vendor
            const { error: profileError } = await supabase
                .from("profiles")
                .upsert({
                    id: authData.user.id,
                    full_name: fullName,
                    role: "vendor-admin",
                    vendor_id: vendorData.id,
                })

            if (profileError) {
                console.error("Profile creation error:", profileError)
                setError("Account created, but profile setup failed. Please contact support.")
            } else {
                setSuccess(true)
                setTimeout(() => {
                    router.push("/login")
                }, 3000)
            }
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
            <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-black italic text-orange-500 tracking-tighter">REGISTER YOUR BAR</CardTitle>
                    <CardDescription className="text-zinc-500 uppercase text-[10px] font-mono tracking-widest mt-1">Create your account & set up your bar</CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="space-y-4 py-8 text-center">
                            <div className="text-orange-500 text-4xl mb-4">✓</div>
                            <h3 className="text-xl font-bold text-white uppercase italic">Bar Registered!</h3>
                            <p className="text-zinc-400 text-sm">
                                Your bar <strong className="text-orange-500">{vendorName}</strong> is ready. Please check your email for a confirmation link (if enabled) or <Link href="/login" className="text-orange-500 underline">click here to login</Link>.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSignup} className="space-y-4">
                            {/* Bar Details Section */}
                            <div className="border border-zinc-800 p-3 space-y-3">
                                <p className="text-[10px] font-mono text-orange-500 uppercase tracking-widest">Bar Details</p>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-400 uppercase font-mono">Bar / Vendor Name</label>
                                    <Input
                                        type="text"
                                        value={vendorName}
                                        onChange={(e) => {
                                            setVendorName(e.target.value)
                                            setSlug(e.target.value.toLowerCase().replace(/ /g, "-"))
                                        }}
                                        placeholder="Blue Lagoon Bar"
                                        className="bg-zinc-950 border-zinc-800 rounded-none focus-visible:ring-orange-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-400 uppercase font-mono">Slug (URL Part)</label>
                                    <Input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="blue-lagoon"
                                        className="bg-zinc-950 border-zinc-800 rounded-none focus-visible:ring-orange-500 font-mono"
                                        required
                                    />
                                    <p className="text-[10px] text-zinc-600 font-mono">yoursite.com/<span className="text-zinc-400">{slug || "your-bar"}</span>/menu</p>
                                </div>
                            </div>

                            {/* Account Details Section */}
                            <div className="border border-zinc-800 p-3 space-y-3">
                                <p className="text-[10px] font-mono text-orange-500 uppercase tracking-widest">Account Details</p>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-400 uppercase font-mono">Full Name</label>
                                    <Input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="John Doe"
                                        className="bg-zinc-950 border-zinc-800 rounded-none focus-visible:ring-orange-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-400 uppercase font-mono">Email Address</label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@bar.com"
                                        className="bg-zinc-950 border-zinc-800 rounded-none focus-visible:ring-orange-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-400 uppercase font-mono">Password</label>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="bg-zinc-950 border-zinc-800 rounded-none focus-visible:ring-orange-500"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 p-3 text-red-500 text-xs font-bold uppercase italic">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black italic uppercase rounded-none h-12"
                            >
                                {loading ? "SETTING UP YOUR BAR..." : "REGISTER & GET STARTED"}
                            </Button>

                            <p className="text-center text-xs text-zinc-500 mt-4">
                                Already have an account? <Link href="/login" className="text-orange-500 hover:underline">SIGN IN</Link>
                            </p>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
