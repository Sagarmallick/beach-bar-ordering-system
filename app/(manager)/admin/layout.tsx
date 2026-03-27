"use client"

import AdminSidebar from "@/components/admin/AdminSidebar"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const { user, profile, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login")
            } else if (profile?.role === "super-admin") {
                router.push("/super-admin")
            }
        }
    }, [user, profile, loading, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-950">
                <p className="text-zinc-500 font-mono italic animate-pulse">AUTHENTICATING SESSION...</p>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-100">
                {children}
            </main>
        </div>
    )
}
