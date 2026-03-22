"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useAdminStats } from "@/hooks/useAdminStats"
import { useAuth } from "@/hooks/useAuth"

export default function AdminDashboard() {
    const { profile } = useAuth()
    const { stats, loading } = useAdminStats(profile?.vendor_id || undefined)

    if (loading) {
        return (
            <div className="flex items-center justify-center p-16">
                <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
        )
    }

    const cards = [
        {
            title: "Orders Today",
            value: stats.totalOrdersToday,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-blue-500">
                    <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
                </svg>
            ),
        },
        {
            title: "Total Revenue",
            value: `₹${stats.totalRevenue.toFixed(2)}`,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-green-500">
                    <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.92.363c-.293.18-.418.404-.418.607 0 .203.125.428.418.607z" />
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.514.093.994.252 1.42.49.592.33 1.08.812 1.08 1.56 0 .749-.488 1.23-1.08 1.561-.426.237-.906.396-1.42.489v.316a.75.75 0 01-1.5 0v-.316a3.78 3.78 0 01-1.653-.713 2.42 2.42 0 01-.925-1.2.75.75 0 011.395-.55c.12.3.272.524.447.563.232.105.49.187.736.363V10.7a7.304 7.304 0 01-1.42-.49C5.488 9.88 5 9.398 5 8.65c0-.749.488-1.23 1.08-1.561.426-.237.906-.396 1.42-.489V6.35A.75.75 0 0110 4z" clipRule="evenodd" />
                </svg>
            ),
        },
        {
            title: "Active Orders",
            value: stats.activeOrders,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-orange-500">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                </svg>
            ),
        },
    ]

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <Card key={card.title}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">{card.title}</span>
                                {card.icon}
                            </div>
                            <p className="text-3xl font-bold">{card.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}