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

export type Order = {
    id: string
    chair_number: number
    status: string
    total_price: number
    created_at: string
    order_items: OrderItem[]
}

export function useOrders(vendorId?: string) {
    const [orders, setOrders] = useState<Order[]>([])
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
                    status,
                    total_price,
                    created_at,
                    order_items (
                        id,
                        quantity,
                        price,
                        drinks ( name )
                    )
                `)

            if (vendorId) query = query.eq("vendor_id", vendorId)

            const { data, error } = await query
                .order("created_at", { ascending: false })

            if (error) {
                setError(error.message)
            } else {
                setOrders((data as unknown as Order[]) ?? [])
            }
            setLoading(false)
        }

        fetchOrders()
    }, [vendorId])

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        const { error } = await supabase
            .from("orders")
            .update({ status: newStatus })
            .eq("id", orderId)

        if (error) {
            throw new Error(error.message)
        }

        // Optimistically update local state
        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        )
    }

    return { orders, loading, error, updateOrderStatus }
}
