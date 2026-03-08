"use client"

import { useEffect, useState } from "react"
import { useOrderStatus } from "@/hooks/useOrderStatus"
import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"

const steps = [
    { key: "new", label: "Order Received" },
    { key: "preparing", label: "Preparing" },
    { key: "done", label: "Ready!" },
]

type OrderStatusTrackerProps = {
    orderId: string
}

function formatTime(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function SingleOrderTracker({ orderId }: OrderStatusTrackerProps) {
    const order = useOrderStatus(orderId)
    const { removeOrderId } = useCart()
    const [showInfo, setShowInfo] = useState(false)

    // Auto-remove after order is done
    useEffect(() => {
        if (order?.status === "done") {
            const timeout = setTimeout(() => {
                removeOrderId(orderId)
            }, 30000)
            return () => clearTimeout(timeout)
        }
    }, [order?.status, orderId, removeOrderId])

    if (!order) return null

    const currentIndex = steps.findIndex((s) => s.key === order.status)

    return (
        <div className="max-w-md border rounded-lg bg-card p-4 mx-4 mb-4 shadow-sm relative">
            {/* Header: Title + Timestamp + Info */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                        Order Status
                    </h3>
                    <span className="text-xs text-muted-foreground">
                        {formatTime(order.created_at)}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setShowInfo(!showInfo)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                            clipRule="evenodd"
                        />
                    </svg>
                </Button>
            </div>

            {/* Info Popup */}
            {showInfo && (
                <div className="mb-3 p-3 rounded-md bg-muted/50 border text-sm">
                    <h4 className="font-semibold mb-2">Order Details</h4>
                    <div className="flex flex-col gap-1">
                        {order.order_items.map((item) => (
                            <div key={item.id} className="flex justify-between">
                                <span>
                                    {item.drinks?.name ?? "Unknown"} x {item.quantity}
                                </span>
                                <span className="text-muted-foreground">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between border-t mt-2 pt-2 font-semibold">
                        <span>Total</span>
                        <span>₹{Number(order.total_price).toFixed(2)}</span>
                    </div>
                </div>
            )}

            {/* Steps */}
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = index <= currentIndex
                    const isActive = index === currentIndex

                    return (
                        <div key={step.key} className="flex flex-col items-center flex-1">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${isCompleted
                                    ? isActive
                                        ? "bg-primary text-primary-foreground animate-pulse"
                                        : "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                {isCompleted && index < currentIndex ? "✓" : index + 1}
                            </div>

                            <span
                                className={`text-xs mt-1 text-center ${isActive ? "font-semibold" : "text-muted-foreground"
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* Progress bar */}
            <div className="flex items-center mt-3 mx-4">
                <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-3">
                {order.status === "new" && "Your order has been received!"}
                {order.status === "preparing" && "The bar is preparing your drinks..."}
                {order.status === "done" && "Your drinks are ready!"}
            </p>
        </div>
    )
}

export default function OrderStatusTracker() {
    const { activeOrderIds } = useCart()

    if (activeOrderIds.length === 0) return null

    return (
        <div className="flex flex-col gap-2 mt-4">
            {activeOrderIds.map((id) => (
                <SingleOrderTracker key={id} orderId={id} />
            ))}
        </div>
    )
}
