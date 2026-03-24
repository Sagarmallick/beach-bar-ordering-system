"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { generateSignature } from "@/lib/signatures"
import { useVendor } from "@/hooks/useVendor"
import { useAuth } from "@/hooks/useAuth"

export default function QRCodesPage() {
    const { profile } = useAuth()
    const [numChairs, setNumChairs] = useState(20)
    const [baseUrl, setBaseUrl] = useState("")
    // For now, we manage the 'default-bar'
    const { vendor, loading } = useVendor(undefined, profile?.vendor_id ?? undefined)

    useEffect(() => {
        // Set base URL from window location
        setBaseUrl(`${window.location.protocol}//${window.location.host}`)
    }, [])

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8 print:hidden">
                <div>
                    <h1 className="text-2xl font-bold italic text-orange-500">QR CODE GENERATOR</h1>
                    <p className="text-muted-foreground font-mono uppercase text-xs">Generate and print QR codes for chairs</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Chairs:</span>
                        <Input
                            type="number"
                            value={numChairs}
                            onChange={(e) => setNumChairs(parseInt(e.target.value) || 0)}
                            className="w-20"
                            min="1"
                        />
                    </div>
                    <Button onClick={handlePrint} className="bg-orange-500 hover:bg-orange-600 rounded-none italic font-bold">
                        PRINT ALL
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {!loading && vendor && Array.from({ length: numChairs }).map((_, i) => {
                    const chairId = i + 1
                    const sig = generateSignature(chairId, vendor.qr_secret)
                    const orderUrl = `${baseUrl}/${vendor.slug}/order/${chairId}?s=${sig}`

                    return (
                        <Card key={chairId} className="print:break-inside-avoid print:shadow-none bg-zinc-950 border-zinc-800 rounded-none overflow-hidden">
                            <CardContent className="p-6 flex flex-col items-center gap-4">
                                <div className="text-center">
                                    <p className="text-xs text-zinc-500 uppercase font-mono tracking-widest mb-1">BEACH BAR ORDER SYSTEM</p>
                                    <h2 className="text-3xl font-black italic text-zinc-100">CHAIR {chairId}</h2>
                                </div>
                                <div className="bg-white p-3 rounded-sm shadow-2xl">
                                    {baseUrl && (
                                        <QRCodeSVG
                                            value={orderUrl}
                                            size={150}
                                            level="H"
                                            includeMargin={false}
                                        />
                                    )}
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-zinc-400 font-mono mb-2 truncate max-w-[150px]">{orderUrl}</p>
                                    <p className="text-xs font-bold text-orange-500 italic uppercase">Scan to order drinks</p>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <style jsx global>{`
                @media print {
                    body {
                        background: white !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    aside {
                        display: none !important;
                    }
                    main {
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                }
            `}</style>
        </div>
    )
}
