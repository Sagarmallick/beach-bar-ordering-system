"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function Home() {
  const { profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (profile) {
        // Redirect based on role
        if (profile.role === "super-admin") {
          router.replace("/super-admin")
        } else if (profile.vendor_id) {
          router.replace("/admin")
        } else {
          // Edge case: logged in but no vendor — send to signup
          router.replace("/signup")
        }
      } else {
        // Not logged in, go to login
        router.replace("/login")
      }
    }
  }, [profile, loading, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-orange-500 font-black italic uppercase tracking-widest">
      <div className="animate-pulse">Loading Session...</div>
    </div>
  )
}
