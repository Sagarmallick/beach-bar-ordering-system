/**
 * Generate a drink image using Pollinations.ai via our API route.
 *
 * How it works:
 * 1. Attempts to fetch directly from Pollinations.ai in the browser.
 * 2. If direct fetch fails (e.g., CORS, network issues, invalid image data), it falls back to our /api/generate-image endpoint.
 * 3. The API route fetches from Pollinations server-side (bypasses Turnstile).
 * 4. Returns the image as a blob.
 * 5. We convert it to a File object ready for Supabase upload.
 */
export async function generateDrinkImage(drinkName: string): Promise<File> {
    console.log(`[Client] Generating image for: ${drinkName}`)
    const prompt = encodeURIComponent(`A professional product photo of a ${drinkName} cocktail, studio lighting, white background, high quality`);
    const seed = Math.floor(Math.random() * 1000000);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${prompt}?width=512&height=512&nologo=true&seed=${seed}`;

    try {
        console.log(`[Client] Attempting direct browser fetch from: ${pollinationsUrl}`)
        const response = await fetch(pollinationsUrl, {
            mode: 'cors',
            cache: 'no-store'
        });

        if (!response.ok) throw new Error(`Status ${response.status}`);

        const blob = await response.blob();

        // Basic check if it's an image
        if (blob.type.includes('html') || blob.size < 10000) {
            throw new Error("Received invalid image data from provider");
        }

        console.log(`[Client] Successfully fetched image (${blob.size} bytes)`)
        const fileName = `${drinkName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.png`;
        return new File([blob], fileName, { type: "image/png" });

    } catch (err: any) {
        console.warn(`[Client] Direct fetch failed, falling back to server API:`, err);

        // Fallback to our server API if direct fetch fails (e.g. CORS or network blocking)
        const apiResponse = await fetch("/api/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ drinkName }),
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json().catch(() => ({ error: "Generation failed" }));
            throw new Error(errorData.details || errorData.error || "Failed to generate image");
        }

        const blob = await apiResponse.blob();
        const fileName = `${drinkName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.png`;
        return new File([blob], fileName, { type: "image/png" });
    }
}
