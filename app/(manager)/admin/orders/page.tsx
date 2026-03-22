"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useCompletedOrders } from "@/hooks/useCompletedOrders"
import { useAuth } from "@/hooks/useAuth"

function formatDateTime(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export default function OrdersPage() {
    const { profile } = useAuth()
    const { orders, loading, error } = useCompletedOrders(profile?.vendor_id || undefined)

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
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Completed Orders</h1>

            {orders.length === 0 ? (
                <p className="text-muted-foreground">No completed orders yet.</p>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="text-left px-4 py-3 font-medium">Order ID</th>
                                        <th className="text-left px-4 py-3 font-medium">Chair</th>
                                        <th className="text-left px-4 py-3 font-medium">Items</th>
                                        <th className="text-left px-4 py-3 font-medium">Total</th>
                                        <th className="text-left px-4 py-3 font-medium">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id} className="border-b last:border-0">
                                            <td className="px-4 py-3 font-mono text-xs">
                                                {order.id.slice(0, 8)}...
                                            </td>
                                            <td className="px-4 py-3">
                                                Chair {order.chair_number}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-0.5">
                                                    {order.order_items.map((item) => (
                                                        <span key={item.id} className="text-muted-foreground">
                                                            {item.drinks?.name ?? "Unknown"} x{item.quantity}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                ₹{Number(order.total_price).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {formatDateTime(order.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
