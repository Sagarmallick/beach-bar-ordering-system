"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { User } from "@supabase/supabase-js"

export type Profile = {
    id: string
    role: "super-admin" | "vendor-admin"
    vendor_id: string | null
    full_name: string | null
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) fetchProfile(session.user.id)
            else setLoading(false)
        })

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) fetchProfile(session.user.id)
            else {
                setProfile(null)
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    async function fetchProfile(uid: string) {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", uid)
            .single()

        if (!error && data) {
            setProfile(data as Profile)
        }
        setLoading(false)
    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    return { user, profile, loading, signOut }
}
