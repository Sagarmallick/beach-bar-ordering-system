"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type OrderItemDetail = {
    id: string
    quantity: number
    price: number
    drinks: {
        name: string
    }
}

export type OrderDetail = {
    status: string
    created_at: string
    total_price: number
    order_items: OrderItemDetail[]
}

export function useOrderStatus(orderId: string | null) {
    const [order, setOrder] = useState<OrderDetail | null>(null)

    useEffect(() => {
        if (!orderId) return

        async function fetchOrder() {
            const { data } = await supabase
                .from("orders")
                .select(`
                    status,
                    created_at,
                    total_price,
                    order_items (
                        id,
                        quantity,
                        price,
                        drinks ( name )
                    )
                `)
                .eq("id", orderId)
                .single()

            if (data) setOrder(data as unknown as OrderDetail)
        }

        fetchOrder()

        const interval = setInterval(fetchOrder, 5000)
        return () => clearInterval(interval)
    }, [orderId])

    return order
}
