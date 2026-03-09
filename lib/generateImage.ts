/**
 * Generate a drink image using Pollinations.ai via our API route.
 *
 * How it works:
 * 1. Calls our /api/generate-image endpoint with the drink name
 * 2. The API route fetches from Pollinations server-side (bypasses Turnstile)
 * 3. Returns the image as a blob
 * 4. We convert it to a File object ready for Supabase upload
 */
export async function generateDrinkImage(drinkName: string): Promise<File> {
    const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drinkName }),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Failed to generate image" }))
        throw new Error(error.error || "Failed to generate image")
    }

    const blob = await response.blob()
    const fileName = `${drinkName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.png`
    const file = new File([blob], fileName, { type: "image/png" })

    return file
}
