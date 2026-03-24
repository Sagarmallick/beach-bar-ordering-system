"use client"

import { use, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import CartButton from "@/components/customer/CartButton"
import DrinkList from "@/components/customer/DrinkList"
import OrderStatusTracker from "@/components/customer/OrderStatusTracker"
import { useDrinks } from "@/hooks/useDrinks"
import { CartProvider } from "@/context/CartContext"
import { verifySignature } from "@/lib/signatures"
import { useVendor } from "@/hooks/useVendor"

function OrderContent({ chair, vendorSlug }: { chair: string; vendorSlug: string }) {
    const { vendor, loading: vendorLoading, error: vendorError } = useVendor(vendorSlug)
    const { drinks, loading: drinksLoading, error: drinksError } = useDrinks(vendor?.id)
    const searchParams = useSearchParams()

    const chairNumber = parseInt(chair)
    const sig = searchParams.get("s")

    // Verify using vendor's specific secret
    const isValidSignature = sig && vendor ? verifySignature(chair, sig, vendor.qr_secret) : false
    const isValidChair = !isNaN(chairNumber) && chairNumber > 0 && isValidSignature

    if (vendorLoading || (!vendor && !vendorError)) {
        return (
            <div className="flex items-center justify-center p-16">
                <p className="text-muted-foreground italic">Connecting to {vendorSlug}...</p>
            </div>
        )
    }

    if (vendorError || !vendor) {
        return (
            <div className="flex flex-col items-center justify-center p-16 text-center">
                <h2 className="text-2xl font-bold text-red-500 mb-2">Bar Not Found</h2>
                <p className="text-muted-foreground">{vendorError || "This bar is not registered on our platform."}</p>
            </div>
        )
    }

    if (!isValidChair) {
        return (
            <div className="flex flex-col items-center justify-center p-16 text-center">
                <h2 className="text-2xl font-bold text-red-500 mb-2">Invalid Access</h2>
                <p className="text-muted-foreground text-sm max-w-xs">
                    This QR code is invalid for <strong>{vendor.name}</strong>.
                    Please scan the physical QR code on your chair again.
                </p>
            </div>
        )
    }

    if (drinksLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-muted-foreground">Loading menu...</p>
            </div>
        )
    }

    return (
        <div>
            <OrderStatusTracker />
            <DrinkList drinks={drinks} />
            <CartButton chairNumber={chairNumber} vendorId={vendor.id} />
        </div>
    )
}

export default function Page({ params }: { params: Promise<{ chair: string; vendorSlug: string }> }) {
    const { chair, vendorSlug } = use(params)

    return (
        <CartProvider>
            <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Initializing...</div>}>
                <OrderContent chair={chair} vendorSlug={vendorSlug} />
            </Suspense>
        </CartProvider>
    )
}