"use client"

import DrinkCard from "@/components/customer/DrinkCard"

type Drink = {
    id: string
    name: string
    price: number
}

type DrinkListProps = {
    drinks: Drink[]
}

export default function DrinkList({
    drinks,
}: DrinkListProps) {
    return (
        <div className="flex flex-col gap-4 p-4">
            {drinks.map((drink) => (
                <DrinkCard
                    key={drink.id}
                    drink={drink}
                />
            ))}
        </div>
    )
}