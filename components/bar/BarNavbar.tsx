import { ThemeToggle } from "@/components/ThemeToggle"

export default function BarNavbar() {
    return (
        <header className="sticky top-0 z-10 w-full border-b bg-background">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div className="flex flex-col">
                    <h1 className="text-lg font-semibold">Beach Bar Dashboard</h1>
                    <span className="text-sm text-muted-foreground">
                        Manage incoming orders
                    </span>
                </div>
                <ThemeToggle />
            </div>
        </header>
    )
}
