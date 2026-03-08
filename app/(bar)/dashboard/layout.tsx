import BarNavbar from "@/components/bar/BarNavbar"

export default function BarLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <BarNavbar />
            {children}
        </>
    )
}
