"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type Drink = {
    id: string
    name: string
    price: number
    image_url?: string
    available: boolean
}

export function useDrinks(vendorId?: string) {
    const [drinks, setDrinks] = useState<Drink[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!vendorId) return

        async function fetchDrinks() {
            let query = supabase
                .from("drinks")
                .select("id, name, price, image_url, available")

            if (vendorId) {
                query = query.eq("vendor_id", vendorId)
            }

            const { data, error } = await query.order("name")

            if (error) {
                setError(error.message)
            } else {
                setDrinks(data ?? [])
            }

            setLoading(false)
        }

        fetchDrinks()
    }, [vendorId])

    return { drinks, loading, error }
}