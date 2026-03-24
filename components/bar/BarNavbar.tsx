import { ThemeToggle } from "@/components/ThemeToggle"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function BarNavbar() {
    const { profile, signOut } = useAuth()
    const router = useRouter()

    const handleLogout = async () => {
        await signOut()
        router.push("/login")
    }

    return (
        <header className="sticky top-0 z-10 w-full border-b bg-background">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div className="flex flex-col">
                    <h1 className="text-lg font-semibold">{profile?.role === 'super-admin' ? 'Master Dashboard' : 'Bar Dashboard'}</h1>
                    <span className="text-sm text-muted-foreground">
                        {profile?.role === 'super-admin' ? 'Viewing all orders' : 'Manage your orders'}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/admin")}
                        className="text-xs font-bold uppercase italic text-orange-500 hover:bg-orange-500/10"
                    >
                        Admin Panel
                    </Button>
                    <ThemeToggle />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-xs font-bold uppercase italic text-muted-foreground hover:text-red-500"
                    >
                        Sign Out
                    </Button>
                </div>
            </div>
        </header>
    )
}
