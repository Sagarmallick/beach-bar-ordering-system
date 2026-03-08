import OrderCard from "@/components/bar/OrderCard"
import type { Order } from "@/hooks/useOrders"

type OrderGridProps = {
    orders: Order[]
    onUpdateStatus: (orderId: string, newStatus: string) => Promise<void>
}

export default function OrderGrid({ orders, onUpdateStatus }: OrderGridProps) {
    if (orders.length === 0) {
        return (
            <div className="flex items-center justify-center py-16">
                <p className="text-muted-foreground text-lg">
                    No orders yet — waiting for customers
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {orders.map((order) => (
                <OrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={onUpdateStatus}
                />
            ))}
        </div>
    )
}
