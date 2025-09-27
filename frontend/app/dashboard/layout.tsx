import { Geist, Geist_Mono } from "next/font/google";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { GridBackground, Spotlight } from "@/components/ui/spotlight-background";

const fontSans = Geist({
    variable: "--font-sans",
    subsets: ["latin"],
    display: 'swap',
});

const fontMono = Geist_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
    display: 'swap',
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden rounded-2xl">
                    <Spotlight />
                    <div className="flex-1 overflow-y-auto p-4 pt-6 md:p-6 lg:p-8">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}