"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"

type Drink = {
    id: string
    name: string
    price: number
    image_url?: string
    available: boolean
}

type QuantityProps = {
    drink: Drink
}

export default function Quantity({ drink }: QuantityProps) {
    const { increase, decrease, getQuantity } = useCart()
    const quantity = getQuantity(drink.id)

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={() => decrease(drink.id)}
                disabled={quantity === 0}
            >
                -
            </Button>

            <span className="w-6 text-center">{quantity}</span>

            <Button
                variant="outline"
                size="icon"
                onClick={() => increase(drink)}
            >
                +
            </Button>
        </div>
    )
}