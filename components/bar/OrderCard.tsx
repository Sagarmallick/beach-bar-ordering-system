"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Order } from "@/hooks/useOrders"

const statusStyles: Record<string, string> = {
    new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    preparing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
}

function formatTime(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

type OrderCardProps = {
    order: Order
    onUpdateStatus: (orderId: string, newStatus: string) => Promise<void>
}

export default function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
    const [updating, setUpdating] = useState(false)

    const handleStatusUpdate = async (newStatus: string) => {
        setUpdating(true)
        try {
            await onUpdateStatus(order.id, newStatus)
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to update status")
        } finally {
            setUpdating(false)
        }
    }

    return (
        <Card className="w-full">
            <CardContent className="p-5 flex flex-col gap-4">

                {/* Header: Chair + Status */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                        Chair {order.chair_number}
                    </h3>
                    <Badge
                        className={statusStyles[order.status] || ""}
                        variant="secondary"
                    >
                        {order.status}
                    </Badge>
                </div>

                {/* Drink items */}
                <div className="flex flex-col gap-1">
                    {order.order_items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between text-sm"
                        >
                            <span>
                                {item.drinks?.name ?? "Unknown"} × {item.quantity}
                            </span>
                            <span className="text-muted-foreground">
                                ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Footer: Total + Time */}
                <div className="flex items-center justify-between border-t pt-3">
                    <span className="font-semibold">
                        ₹{Number(order.total_price).toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {formatTime(order.created_at)}
                    </span>
                </div>

                {/* Action Buttons */}
                {order.status === "new" && (
                    <Button
                        className="w-full"
                        variant="default"
                        disabled={updating}
                        onClick={() => handleStatusUpdate("preparing")}
                    >
                        {updating ? "Updating..." : "🔥 Start Preparing"}
                    </Button>
                )}

                {order.status === "preparing" && (
                    <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={updating}
                        onClick={() => handleStatusUpdate("done")}
                    >
                        {updating ? "Updating..." : " Mark as Done"}
                    </Button>
                )}

            </CardContent>
        </Card>
    )
}
