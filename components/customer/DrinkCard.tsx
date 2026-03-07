"use client"

import { Card, CardContent } from "@/components/ui/card"
import Quantity from "@/components/customer/Quantity"

type Drink = {
    id: string
    name: string
    price: number
}

type DrinkCardProps = {
    drink: Drink
}

export default function DrinkCard({ drink }: DrinkCardProps) {
    return (
        <Card className="w-full">
            <CardContent className="flex items-center justify-between p-4">

                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold">{drink.name}</h3>
                    <span className="text-sm text-muted-foreground">
                        €{drink.price}
                    </span>
                </div>

                <Quantity drink={drink} />

            </CardContent>
        </Card>
    )
}