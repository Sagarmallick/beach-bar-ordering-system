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
          // Logged in but not assigned to a vendor yet
          // We'll stay here and show a waiting message
        }
      } else {
        // Not logged in, go to login
        router.replace("/login")
      }
    }
  }, [profile, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-orange-500 font-black italic uppercase tracking-widest">
        <div className="animate-pulse">Loading Session...</div>
      </div>
    )
  }

  if (profile && !profile.vendor_id && profile.role !== "super-admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-4">
        <div className="max-w-md w-full border border-zinc-800 bg-zinc-950 p-8 text-center space-y-6">
          <div className="text-orange-500 text-5xl mb-4 italic font-black animate-bounce font-mono">!</div>
          <h1 className="text-2xl font-black italic text-white uppercase leading-tight">
            ACCOUNT ACTIVE
          </h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
            Your account is verified, but you haven&apos;t been assigned to a bar yet.
          </p>
          <div className="bg-orange-500/10 border border-orange-500/30 p-4 text-orange-400 text-[10px] font-mono leading-relaxed text-left uppercase">
            NEXT STEPS:<br />
            1. Contact your Super Admin<br />
            2. Tell them your email<br />
            3. They will activate your dashboard
          </div>
          <button
            onClick={() => window.location.href = '/login'}
            className="text-zinc-600 hover:text-white text-[10px] uppercase font-mono tracking-tighter"
          >
            &larr; BACK TO LOGIN
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-orange-500 font-black italic uppercase tracking-widest">
      <div className="animate-pulse">Redirecting...</div>
    </div>
  )
}
