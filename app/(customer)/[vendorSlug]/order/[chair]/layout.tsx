import Header from "@/components/customer/Header";
import { getVendorBySlug } from "@/lib/vendors";

export default async function CustomerLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ chair: string; vendorSlug: string }>;
}>) {
    const { chair, vendorSlug } = await params;
    const vendor = await getVendorBySlug(vendorSlug);

    return (
        <>
            <Header chair={chair} vendorName={vendor?.name} />
            {children}
        </>
    );
}
