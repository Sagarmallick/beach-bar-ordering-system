"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabaseClient"

export type Drink = {
    id: string
    name: string
    price: number
    category: string
    available: boolean
    image_url?: string
}

export function useInventory(vendorId?: string) {
    const [drinks, setDrinks] = useState<Drink[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchDrinks = useCallback(async () => {
        let query = supabase
            .from("drinks")
            .select("*")

        if (vendorId) query = query.eq("vendor_id", vendorId)

        const { data, error } = await query
            .order("category")
            .order("name")

        if (error) {
            setError(error.message)
        } else {
            setDrinks(data ?? [])
        }
        setLoading(false)
    }, [vendorId])

    useEffect(() => {
        if (!vendorId) return
        fetchDrinks()
    }, [fetchDrinks, vendorId])

    const addDrink = async (drink: { name: string; price: number; category: string; image_url?: string }) => {
        if (!vendorId) throw new Error("No vendor ID provided")

        const { error } = await supabase
            .from("drinks")
            .insert({ ...drink, vendor_id: vendorId, available: true })

        if (error) throw new Error(error.message)
        await fetchDrinks()
    }

    const toggleAvailability = async (id: string, currentAvailable: boolean) => {
        const { error } = await supabase
            .from("drinks")
            .update({ available: !currentAvailable })
            .eq("id", id)

        if (error) throw new Error(error.message)

        setDrinks((prev) =>
            prev.map((d) => (d.id === id ? { ...d, available: !currentAvailable } : d))
        )
    }

    const deleteDrink = async (id: string) => {
        const { error } = await supabase
            .from("drinks")
            .delete()
            .eq("id", id)

        if (error) throw new Error(error.message)
        setDrinks((prev) => prev.filter((d) => d.id !== id))
    }

    return { drinks, loading, error, addDrink, toggleAvailability, deleteDrink }
}
