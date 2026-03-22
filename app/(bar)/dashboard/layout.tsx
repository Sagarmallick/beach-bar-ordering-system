"use client"

import BarNavbar from "@/components/bar/BarNavbar"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function BarLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-950">
                <p className="text-zinc-500 font-mono italic animate-pulse">AUTHENTICATING...</p>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <BarNavbar />
            <main className="p-4 md:p-8">
                {children}
            </main>
        </div>
    )
}
