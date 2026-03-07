"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useCart } from "@/context/CartContext"

export default function CartButton() {
    const { items, totalItems, totalPrice, increase, decrease, clearCart } = useCart()
    const [open, setOpen] = useState(false)

    const cartItems = Object.values(items)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <div className="fixed  bottom-4 right-4 z-50">
                <SheetTrigger
                    render={
                        <Button
                            size="lg"
                            className=" px-8 shadow-lg"
                            disabled={totalItems === 0}
                        />
                    }
                >
                    View Cart {totalItems > 0 && `(${totalItems})`}
                </SheetTrigger>
            </div>

            <SheetContent side="right" className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>Your Cart</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-4">
                    {cartItems.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            Your cart is empty
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {cartItems.map(({ drink, quantity }) => (
                                <div
                                    key={drink.id}
                                    className="flex items-center justify-between border-b pb-4"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium">{drink.name}</span>
                                        <span className="text-sm text-muted-foreground">
                                            €{drink.price} × {quantity} = €{(drink.price * quantity).toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => decrease(drink.id)}
                                        >
                                            -
                                        </Button>
                                        <span className="w-6 text-center">{quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => increase(drink)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <SheetFooter className="flex flex-col gap-3 border-t pt-4">
                        <div className="flex items-center justify-between w-full text-lg font-semibold">
                            <span>Total</span>
                            <span>€{totalPrice.toFixed(2)}</span>
                        </div>
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={() => {
                                // TODO: implement order placement
                                alert("Order placed!")
                                clearCart()
                                setOpen(false)
                            }}
                        >
                            Place Order
                        </Button>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    )
}