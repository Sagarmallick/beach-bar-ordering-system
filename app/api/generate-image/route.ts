import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const { drinkName } = await request.json()

        if (!drinkName) {
            return NextResponse.json({ error: "Drink name is required" }, { status: 400 })
        }

        console.log(`Generating image for: ${drinkName}`)
        const prompt = `A professional product photo of a ${drinkName} drink, studio lighting, white background, high resolution, 4k`
        const encodedPrompt = encodeURIComponent(prompt)

        // Simpler, direct URL structure
        const url = `https://pollinations.ai/p/${encodedPrompt}?width=512&height=512&seed=${Math.floor(Math.random() * 100000)}`

        console.log(`Fetching from: ${url}`)

        const response = await fetch(url, {
            headers: {
                "Accept": "image/*",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
            cache: "no-store"
        })

        if (!response.ok) {
            console.error(`Pollinations API error: ${response.status}`)
            return NextResponse.json({ error: `Provider error code: ${response.status}` }, { status: 500 })
        }

        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Detect if the response is actually HTML instead of an image
        const isHtml = buffer.toString('utf8', 0, 100).toLowerCase().includes('<html') ||
            buffer.toString('utf8', 0, 100).toLowerCase().includes('<!doctype html')

        if (isHtml) {
            console.error("Pollinations returned an HTML page instead of an image. This usually means a rate limit or a wait page.")
            return NextResponse.json({
                error: "Image provider returned an error page",
                details: "The generation service is currently busy or blocking the request. Please try again in 30 seconds."
            }, { status: 503 })
        }

        console.log(`Successfully received ${arrayBuffer.byteLength} bytes`)

        return new NextResponse(arrayBuffer, {
            headers: {
                "Content-Type": "image/png",
                "Cache-Control": "no-cache",
            },
        })
    } catch (error: any) {
        console.error("Fetch Exception:", error.message)
        return NextResponse.json({
            error: "Connection timeout while generating image",
            details: error?.message || "Please check your internet connection"
        }, { status: 500 })
    }
}
