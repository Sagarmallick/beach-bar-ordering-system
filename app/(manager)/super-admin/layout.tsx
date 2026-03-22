"use client"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SuperAdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const { user, profile, loading, signOut } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login")
            } else if (profile && profile.role !== "super-admin") {
                router.push("/admin")
            }
        }
    }, [user, profile, loading, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-950">
                <p className="text-orange-500 font-mono italic animate-pulse">VERIFYING SUPER-ADMIN ACCESS...</p>
            </div>
        )
    }

    if (!user || profile?.role !== "super-admin") return null

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <header className="border-b border-zinc-800 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="text-zinc-500 hover:text-white transition-colors">
                        ← Back to Admin
                    </Link>
                    <h1 className="text-xl font-black italic tracking-tighter">PLATFORM MASTER</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-zinc-500">{user.email}</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={signOut}
                        className="rounded-none border-zinc-800 text-xs font-bold uppercase italic hover:bg-red-500 hover:text-white"
                    >
                        Sign Out
                    </Button>
                </div>
            </header>
            <main>
                {children}
            </main>
        </div>
    )
}
