"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type AdminStats = {
    totalOrdersToday: number
    totalRevenue: number
    activeOrders: number
}

export function useAdminStats() {
    const [stats, setStats] = useState<AdminStats>({
        totalOrdersToday: 0,
        totalRevenue: 0,
        activeOrders: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            const todayStart = new Date()
            todayStart.setHours(0, 0, 0, 0)

            // Total orders today
            const { count: todayCount } = await supabase
                .from("orders")
                .select("*", { count: "exact", head: true })
                .gte("created_at", todayStart.toISOString())

            // Total revenue (all time)
            const { data: revenueData } = await supabase
                .from("orders")
                .select("total_price")
                .eq("status", "done")

            const totalRevenue = revenueData?.reduce(
                (sum, order) => sum + Number(order.total_price),
                0
            ) ?? 0

            // Active orders (new + preparing)
            const { count: activeCount } = await supabase
                .from("orders")
                .select("*", { count: "exact", head: true })
                .in("status", ["new", "preparing"])

            setStats({
                totalOrdersToday: todayCount ?? 0,
                totalRevenue,
                activeOrders: activeCount ?? 0,
            })
            setLoading(false)
        }

        fetchStats()
    }, [])

    return { stats, loading }
}
