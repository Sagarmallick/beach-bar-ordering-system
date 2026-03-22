"use client"

import OrderGrid from "@/components/bar/OrderGrid"
import { useOrders } from "@/hooks/useOrders"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardPage() {
    const { profile } = useAuth()
    const { orders, loading, error, updateOrderStatus } = useOrders(profile?.vendor_id || undefined)

    if (loading) {
        return (
            <div className="flex items-center justify-center p-16">
                <p className="text-muted-foreground">Loading orders...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-16">
                <p className="text-red-500">Failed to load orders: {error}</p>
            </div>
        )
    }

    return (
        <main className="mx-auto max-w-7xl">
            <OrderGrid orders={orders} onUpdateStatus={updateOrderStatus} />
        </main>
    )
}