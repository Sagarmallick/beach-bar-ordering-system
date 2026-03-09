import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const { drinkName } = await request.json()

        if (!drinkName) {
            return NextResponse.json({ error: "Drink name is required" }, { status: 400 })
        }

        const prompt = `A professional product photo of a ${drinkName} drink, studio lighting, vibrant colors, high quality, background is white `
        const encodedPrompt = encodeURIComponent(prompt)
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=200&height=200&nologo=true`

        const response = await fetch(url)

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
        }

        const blob = await response.blob()
        const arrayBuffer = await blob.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "image/png",
                "Content-Disposition": `inline; filename="${drinkName.toLowerCase().replace(/\s+/g, "-")}.png"`,
            },
        })
    } catch {
        return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
    }
}
