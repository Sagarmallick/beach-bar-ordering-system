"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type OrderItem = {
    id: string
    quantity: number
    price: number
    drinks: {
        name: string
    }
}

export type CompletedOrder = {
    id: string
    chair_number: number
    total_price: number
    created_at: string
    order_items: OrderItem[]
}

export function useCompletedOrders(vendorId?: string) {
    const [orders, setOrders] = useState<CompletedOrder[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!vendorId) return

        async function fetchOrders() {
            let query = supabase
                .from("orders")
                .select(`
                    id,
                    chair_number,
                    total_price,
                    created_at,
                    order_items (
                        id,
                        quantity,
                        price,
                        drinks ( name )
                    )
                `)
                .eq("status", "done")

            if (vendorId) query = query.eq("vendor_id", vendorId)

            const { data, error } = await query
                .order("created_at", { ascending: false })

            if (error) {
                setError(error.message)
            } else {
                setOrders((data as unknown as CompletedOrder[]) ?? [])
            }
            setLoading(false)
        }

        fetchOrders()
    }, [vendorId])

    return { orders, loading, error }
}
