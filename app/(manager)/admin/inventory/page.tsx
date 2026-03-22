"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useInventory } from "@/hooks/useInventory"
import { useAuth } from "@/hooks/useAuth"
import { uploadDrinkImage } from "@/lib/uploadImage"
import { generateDrinkImage } from "@/lib/generateImage"

export default function InventoryPage() {
    const { profile } = useAuth()
    const { drinks, loading, error, addDrink, toggleAvailability, deleteDrink } = useInventory(profile?.vendor_id || undefined)
    const [showForm, setShowForm] = useState(false)
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [generating, setGenerating] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleGenerate = async () => {
        if (!name.trim()) {
            alert("Please enter a drink name first so we can generate an image for it.")
            return
        }

        setGenerating(true)
        try {
            const file = await generateDrinkImage(name)
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
            // Clear the file input since we're using AI generated image
            if (fileInputRef.current) fileInputRef.current.value = ""
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to generate image")
        } finally {
            setGenerating(false)
        }
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !price || !category) return

        setSubmitting(true)
        try {
            let image_url: string | undefined
            if (imageFile) {
                image_url = await uploadDrinkImage(imageFile)
            }
            await addDrink({ name, price: parseFloat(price), category, image_url })
            setName("")
            setPrice("")
            setCategory("")
            setImageFile(null)
            setImagePreview(null)
            if (fileInputRef.current) fileInputRef.current.value = ""
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

                            {/* Image Section */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium">Drink Image</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="rounded-md border bg-background py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-primary-foreground file:text-sm file:font-medium file:cursor-pointer"
                                    />
                                    <span className="text-sm text-muted-foreground">or</span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleGenerate}
                                        disabled={generating}
                                    >
                                        {generating ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Generating...
                                            </span>
                                        ) : (
                                            "Generate with AI"
                                        )}
                                    </Button>
                                </div>

                                {/* Preview */}
                                {imagePreview && (
                                    <div className="flex items-end gap-3 mt-2">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-24 h-24 rounded-lg object-cover border"
                                        />
                                        <div className="flex flex-col gap-1">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleGenerate}
                                                disabled={generating}
                                            >
                                                ↻ Regenerate
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500"
                                                onClick={() => {
                                                    setImageFile(null)
                                                    setImagePreview(null)
                                                    if (fileInputRef.current) fileInputRef.current.value = ""
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button type="submit" disabled={submitting || generating} className="w-fit">
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
                                    <th className="text-left px-4 py-3 font-medium">Image</th>
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
                                        <td className="px-4 py-3">
                                            {drink.image_url ? (
                                                <img src={drink.image_url} alt={drink.name} className="w-10 h-10 rounded object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">N/A</div>
                                            )}
                                        </td>
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
