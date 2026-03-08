import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ThemeToggle"

type OrderHeaderProps = {
    chair: string
}

export default function Header({ chair }: OrderHeaderProps) {
    return (
        <header className="sticky top-0 z-10 w-full border-b bg-background">
            <div className="mx-auto flex max-w-md items-center justify-between px-4 py-4">

                <div className="flex flex-col">
                    <h1 className="text-lg font-semibold">
                        Beach Bar
                    </h1>
                    <span className="text-sm text-muted-foreground">
                        Order your drinks
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                        Chair {chair}
                    </Badge>
                    <ThemeToggle />
                </div>

            </div>
        </header>
    )
}