"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/ThemeToggle"

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
]

export default function AdminSidebar() {
    const pathname = usePathname()

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
                </ul>
            </nav>

            {/* Footer */}
            <div className="border-t px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Theme</span>
                <ThemeToggle />
            </div>
        </aside>
    )
}
