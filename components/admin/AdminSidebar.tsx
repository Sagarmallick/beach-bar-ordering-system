"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "../ui/button"
const navItems = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M2.5 3A1.5 1.5 0 001 4.5v4A1.5 1.5 0 002.5 10h6A1.5 1.5 0 0010 8.5v-4A1.5 1.5 0 008.5 3h-6zm11 2A1.5 1.5 0 0012 6.5v7a1.5 1.5 0 001.5 1.5h4A1.5 1.5 0 0019 13.5v-7A1.5 1.5 0 0017.5 5h-4zm-11 7A1.5 1.5 0 001 13.5v2A1.5 1.5 0 002.5 17h6A1.5 1.5 0 0010 15.5v-2A1.5 1.5 0 008.5 12h-6z" clipRule="evenodd" />
            </svg>
        ),
    },
    {
        label: "Inventory",
        href: "/admin/inventory",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0018 14.25V6.443zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 00.388.657l6.862 3.786z" />
            </svg>
        ),
    },
    {
        label: "Orders",
        href: "/admin/orders",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
            </svg>
        ),
    },
    {
        label: "QR Codes",
        href: "/admin/qr-codes",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.848 2.158a1.5 1.5 0 011.06-.439h8.184a1.5 1.5 0 011.06.44l1.178 1.178a1.5 1.5 0 01.439 1.06V15.25a2.75 2.75 0 01-2.75 2.75h-8A2.75 2.75 0 013.25 15.25V4.397a1.5 1.5 0 01.44-1.06l1.158-1.179zM14.25 4.5l-1.159-1.159a.25.25 0 00-.176-.074H7.085a.25.25 0 00-.176.074L5.75 4.5h8.5zM3.25 13.25v2c0 .69.56 1.25 1.25 1.25h8c.69 0 1.25-.56 1.25-1.25v-2h-10.5z" clipRule="evenodd" />
            </svg>
        ),
    },
    {
        label: "Live Dashboard",
        href: "/dashboard",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M3.5 2A1.5 1.5 0 002 3.5v13A1.5 1.5 0 003.5 18h13a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-13zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm-4 4a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 016 10zm8-2a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0v-5.5A.75.75 0 0114 8z" clipRule="evenodd" />
            </svg>
        ),
    },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { profile, signOut } = useAuth()

    const handleLogout = async () => {
        await signOut()
        router.push("/login")
    }

    return (
        <aside className="sticky top-0 h-screen w-64 border-r bg-card flex flex-col">
            {/* Logo */}
            <div className="px-6 py-5 border-b">
                <h1 className="text-lg font-bold">Beach Bar</h1>
                <p className="text-xs text-muted-foreground">Manager Panel</p>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-4">
                <ul className="flex flex-col gap-1">
                    {navItems.map((item) => {
                        const isActive =
                            item.href === "/admin"
                                ? pathname === "/admin"
                                : pathname.startsWith(item.href)

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            </li>
                        )
                    })}

                    {/* Super Admin Link */}
                    {profile?.role === "super-admin" && (
                        <li>
                            <Link
                                href="/super-admin"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-black italic transition-colors ${pathname === "/super-admin"
                                    ? "bg-orange-500 text-white"
                                    : "text-orange-500 hover:bg-orange-500/10"
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                                </svg>
                                SUPER ADMIN
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>

            {/* User Info & Logout */}
            <div className="border-t px-4 py-3 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground uppercase">{profile?.role || "Staff"}</span>
                    <ThemeToggle />
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full rounded-none border-zinc-800 text-xs font-bold uppercase italic hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                >
                    Sign Out
                </Button>
            </div>
        </aside>
    )
}
