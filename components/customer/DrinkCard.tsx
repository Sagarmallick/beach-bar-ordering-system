"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Quantity from "@/components/customer/Quantity"

type Drink = {
    id: string
    name: string
    price: number
    image_url?: string
    available: boolean
}

type DrinkCardProps = {
    drink: Drink
}

export default function DrinkCard({ drink }: DrinkCardProps) {
    return (
        <Card className={`w-full ${!drink.available ? "opacity-50" : ""}`}>
            <CardContent className="flex items-center justify-between p-4">

                <div className="flex items-center gap-3">
                    {drink.image_url && (
                        <img
                            src={drink.image_url}
                            alt={drink.name}
                            className={`w-12 h-12 rounded-lg object-cover ${!drink.available ? "grayscale" : ""}`}
                        />
                    )}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{drink.name}</h3>
                            {!drink.available && (
                                <Badge
                                    variant="secondary"
                                    className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-xs"
                                >
                                    Unavailable
                                </Badge>
                            )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                            ₹{drink.price}
                        </span>
                    </div>
                </div>

                {drink.available && <Quantity drink={drink} />}

            </CardContent>
        </Card>
    )
}