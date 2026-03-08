"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type Drink = {
    id: string
    name: string
    price: number
}

type CartItem = {
    drink: Drink
    quantity: number
}

type CartContextType = {
    items: Record<string, CartItem>
    increase: (drink: Drink) => void
    decrease: (drinkId: string) => void
    getQuantity: (drinkId: string) => number
    totalItems: number
    totalPrice: number
    clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<Record<string, CartItem>>({})

    const increase = (drink: Drink) => {
        setItems((prev) => ({
            ...prev,
            [drink.id]: {
                drink,
                quantity: (prev[drink.id]?.quantity || 0) + 1,
            },
        }))
    }

    const decrease = (drinkId: string) => {
        setItems((prev) => {
            const current = prev[drinkId]
            if (!current) return prev

            const newQuantity = current.quantity - 1
            if (newQuantity <= 0) {
                const { [drinkId]: _, ...rest } = prev
                return rest
            }

            return {
                ...prev,
                [drinkId]: { ...current, quantity: newQuantity },
            }
        })
    }

    const getQuantity = (drinkId: string) => items[drinkId]?.quantity || 0

    const totalItems = Object.values(items).reduce(
        (sum, item) => sum + item.quantity,
        0
    )

    const totalPrice = Object.values(items).reduce(
        (sum, item) => sum + item.drink.price * item.quantity,
        0
    )

    const clearCart = () => setItems({})

    return (
        <CartContext.Provider
            value={{ items, increase, decrease, getQuantity, totalItems, totalPrice, clearCart }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
