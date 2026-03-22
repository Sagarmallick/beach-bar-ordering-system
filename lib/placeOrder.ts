"use client"

import { supabase } from "@/lib/supabaseClient"

type CartItem = {
    drink: {
        id: string
        name: string
        price: number
    }
    quantity: number
}

export async function placeOrder(
    vendorId: string,
    chairNumber: number,
    cartItems: CartItem[],
    totalPrice: number
) {
    // 1. Insert the order
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            vendor_id: vendorId,
            chair_number: chairNumber,
            total_price: totalPrice,
            status: "new",
        })
        .select("id")
        .single()

    if (orderError || !order) {
        throw new Error(orderError?.message || "Failed to create order")
    }

    // 2. Insert order items
    const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        drink_id: item.drink.id,
        quantity: item.quantity,
        price: item.drink.price,
    }))

    const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems)

    if (itemsError) {
        throw new Error(itemsError.message)
    }

    return order.id
}
