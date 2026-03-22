"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type AdminStats = {
    totalOrdersToday: number
    totalRevenue: number
    activeOrders: number
}

export function useAdminStats(vendorId?: string) {
    const [stats, setStats] = useState<AdminStats>({
        totalOrdersToday: 0,
        totalRevenue: 0,
        activeOrders: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!vendorId) return

        async function fetchStats() {
            const todayStart = new Date()
            todayStart.setHours(0, 0, 0, 0)

            // Total orders today
            let todayQuery = supabase
                .from("orders")
                .select("*", { count: "exact", head: true })
                .gte("created_at", todayStart.toISOString())

            if (vendorId) todayQuery = todayQuery.eq("vendor_id", vendorId)
            const { count: todayCount } = await todayQuery

            // Total revenue (all time)
            let revenueQuery = supabase
                .from("orders")
                .select("total_price")
                .eq("status", "done")

            if (vendorId) revenueQuery = revenueQuery.eq("vendor_id", vendorId)
            const { data: revenueData } = await revenueQuery

            const totalRevenue = revenueData?.reduce(
                (sum, order) => sum + Number(order.total_price),
                0
            ) ?? 0

            // Active orders (new + preparing)
            let activeQuery = supabase
                .from("orders")
                .select("*", { count: "exact", head: true })
                .in("status", ["new", "preparing"])

            if (vendorId) activeQuery = activeQuery.eq("vendor_id", vendorId)
            const { count: activeCount } = await activeQuery

            setStats({
                totalOrdersToday: todayCount ?? 0,
                totalRevenue,
                activeOrders: activeCount ?? 0,
            })
            setLoading(false)
        }

        fetchStats()
    }, [vendorId])

    return { stats, loading }
}
