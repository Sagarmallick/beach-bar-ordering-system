"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useInventory } from "@/hooks/useInventory"

export default function InventoryPage() {
    const { drinks, loading, error, addDrink, toggleAvailability, deleteDrink } = useInventory()
    const [showForm, setShowForm] = useState(false)
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !price || !category) return

        setSubmitting(true)
        try {
            await addDrink({ name, price: parseFloat(price), category })
            setName("")
            setPrice("")
            setCategory("")
            setShowForm(false)
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to add drink")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-16">
                <p className="text-muted-foreground">Loading inventory...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-16">
                <p className="text-red-500">Failed to load inventory: {error}</p>
            </div>
        )
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Inventory</h1>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancel" : "+ Add Drink"}
                </Button>
            </div>

            {/* Add Drink Form */}
            {showForm && (
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <form onSubmit={handleAdd} className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium">Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Mojito"
                                        className="rounded-md border bg-background px-3 py-2 text-sm"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium">Price (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="e.g. 8.50"
                                        className="rounded-md border bg-background px-3 py-2 text-sm"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium">Category</label>
                                    <input
                                        type="text"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        placeholder="e.g. Cocktails"
                                        className="rounded-md border bg-background px-3 py-2 text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" disabled={submitting} className="w-fit">
                                {submitting ? "Adding..." : "Add Drink"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Drinks Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="text-left px-4 py-3 font-medium">Name</th>
                                    <th className="text-left px-4 py-3 font-medium">Category</th>
                                    <th className="text-left px-4 py-3 font-medium">Price</th>
                                    <th className="text-left px-4 py-3 font-medium">Status</th>
                                    <th className="text-right px-4 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {drinks.map((drink) => (
                                    <tr key={drink.id} className="border-b last:border-0">
                                        <td className="px-4 py-3 font-medium">{drink.name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{drink.category}</td>
                                        <td className="px-4 py-3">₹{Number(drink.price).toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant="secondary"
                                                className={
                                                    drink.available
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                                }
                                            >
                                                {drink.available ? "Available" : "Unavailable"}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => toggleAvailability(drink.id, drink.available)}
                                                >
                                                    {drink.available ? "Disable" : "Enable"}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => {
                                                        if (confirm(`Delete "${drink.name}"?`)) {
                                                            deleteDrink(drink.id)
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
