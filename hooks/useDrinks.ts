"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type Drink = {
    id: string
    name: string
    price: number
}

export function useDrinks() {
    const [drinks, setDrinks] = useState<Drink[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchDrinks() {
            const { data, error } = await supabase
                .from("drinks")
                .select("id, name, price")
                .order("name")

            if (error) {
                setError(error.message)
            } else {
                setDrinks(data ?? [])
            }

            setLoading(false)
        }

        fetchDrinks()
    }, [])

    return { drinks, loading, error }
}