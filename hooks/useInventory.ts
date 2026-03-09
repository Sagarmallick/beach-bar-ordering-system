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

export function useInventory() {
    const [drinks, setDrinks] = useState<Drink[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchDrinks = useCallback(async () => {
        const { data, error } = await supabase
            .from("drinks")
            .select("*")
            .order("category")
            .order("name")

        if (error) {
            setError(error.message)
        } else {
            setDrinks(data ?? [])
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchDrinks()
    }, [fetchDrinks])

    const addDrink = async (drink: { name: string; price: number; category: string; image_url?: string }) => {
        const { error } = await supabase
            .from("drinks")
            .insert({ ...drink, available: true })

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
