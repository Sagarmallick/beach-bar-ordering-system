"use client"

import { useEffect, useState } from "react"
import { getVendorBySlug, Vendor } from "@/lib/vendors"
import { supabase } from "@/lib/supabaseClient"

export function useVendor(slug?: string, id?: string) {
    const [vendor, setVendor] = useState<Vendor | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!slug && !id) {
            setLoading(false)
            return
        }

        async function fetchVendor() {
            try {
                let data: Vendor | null = null

                if (id) {
                    const { data: v, error: err } = await supabase
                        .from("vendors")
                        .select("*")
                        .eq("id", id)
                        .single()
                    if (!err) data = v
                } else if (slug) {
                    data = await getVendorBySlug(slug)
                }

                if (!data) {
                    setError("Vendor not found")
                } else {
                    setVendor(data)
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load vendor")
            } finally {
                setLoading(false)
            }
        }

        fetchVendor()
    }, [slug, id])

    return { vendor, loading, error }
}
