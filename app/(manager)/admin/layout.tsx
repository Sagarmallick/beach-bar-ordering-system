import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
