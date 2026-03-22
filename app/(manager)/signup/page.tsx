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
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // 1. Create the user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
                redirectTo: `${window.location.origin}/`,
            }
        })

        if (authError) {
            setError(authError.message)
            setLoading(false)
            return
        }

        if (authData.user) {
            // 2. Create/update the profile in our public profiles table
            // Using upsert in case a database trigger already created the row
            const { error: profileError } = await supabase
                .from("profiles")
                .upsert({
                    id: authData.user.id,
                    full_name: fullName,
                    role: "vendor-admin",
                })

            if (profileError) {
                console.error("Profile creation error:", profileError)
                // We don't necessarily stop here if auth succeeded, 
                // but we should inform the user.
                setError("Account created, but profile setup failed. Please contact support.")
            } else {
                setSuccess(true)
                // If email confirmation is disabled, we can redirect to login
                // if it's enabled, they need to check their email.
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
                    <CardTitle className="text-2xl font-black italic text-orange-500 tracking-tighter">JOIN BEACH BAR</CardTitle>
                    <CardDescription className="text-zinc-500 uppercase text-[10px] font-mono tracking-widest mt-1">Create your management account</CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="space-y-4 py-8 text-center">
                            <div className="text-orange-500 text-4xl mb-4">✓</div>
                            <h3 className="text-xl font-bold text-white uppercase italic">Account Created!</h3>
                            <p className="text-zinc-400 text-sm">
                                Please check your email for a confirmation link (if enabled) or <Link href="/login" className="text-orange-500 underline">click here to login</Link>.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSignup} className="space-y-4">
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
                                {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
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
