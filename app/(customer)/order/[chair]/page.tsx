"use client"

import { use } from "react"
import CartButton from "@/components/customer/CartButton"
import DrinkList from "@/components/customer/DrinkList"
import OrderStatusTracker from "@/components/customer/OrderStatusTracker"
import { useDrinks } from "@/hooks/useDrinks"
import { CartProvider } from "@/context/CartContext"

function OrderContent({ chair }: { chair: string }) {
    const { drinks, loading, error } = useDrinks()

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-muted-foreground">Loading drinks...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-red-500">Failed to load drinks: {error}</p>
            </div>
        )
    }

    return (
        <div>
            <OrderStatusTracker />
            <DrinkList drinks={drinks} />
            <CartButton chairNumber={parseInt(chair)} />
        </div>
    )
}

export default function Page({ params }: { params: Promise<{ chair: string }> }) {
    const { chair } = use(params)

    return (
        <CartProvider>
            <OrderContent chair={chair} />
        </CartProvider>
    )
}