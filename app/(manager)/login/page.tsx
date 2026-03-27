"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else if (data.user) {
            // Fetch profile to determine role-based redirect
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", data.user.id)
                .single()

            if (profile?.role === "super-admin") {
                router.push("/super-admin")
            } else {
                router.push("/admin")
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
            <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-black italic text-orange-500 tracking-tighter">BEACH BAR ADMIN</CardTitle>
                    <CardDescription className="text-zinc-500 uppercase text-[10px] font-mono tracking-widest mt-1">Management Portal Login</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
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
                            {loading ? "AUTHENTICATING..." : "SIGN IN"}
                        </Button>

                        <p className="text-center text-xs text-zinc-500 mt-4">
                            Don&apos;t have an account? <Link href="/signup" className="text-orange-500 hover:underline">SIGN UP</Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
