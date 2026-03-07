import Header from "@/components/customer/Header";

export default async function CustomerLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ chair: string }>;
}>) {
    const { chair } = await params;
    return (
        <>
            <Header chair={chair} />
            {children}
        </>
    );
}
