"use client"

import CartButton from "@/components/customer/CartButton"
import DrinkList from "@/components/customer/DrinkList"
import { useDrinks } from "@/hooks/useDrinks"
import { CartProvider } from "@/context/CartContext"

export default function Page({ params }: { params: { chair: string } }) {

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
        <CartProvider>
            <div>
                <DrinkList drinks={drinks} />
                <CartButton />
            </div>
        </CartProvider>
    )
}