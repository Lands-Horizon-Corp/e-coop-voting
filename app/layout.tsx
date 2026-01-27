import "./globals.css";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/providers/modal-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import QueryClientProviderWrapper from "@/providers/query-client-provider-wrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins",
});

export const metadata: Metadata = {
    title: {
        default : "ACE System",
        template : "ACE System: %s"
    },
    description: "Attendance Capturing and Election System",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${poppins.variable} ${inter.variable} thin-scroll`}>
                <QueryClientProviderWrapper>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                    >
                        <ModalProvider />
                        <Toaster
                            richColors
                            closeButton
                            toastOptions={{
                                classNames: {
                                    title: "text-sm",
                                    
                                },
                            }}
                        />
                        <div className="font-inter">{children}</div>
                    </ThemeProvider>
                </QueryClientProviderWrapper>
            </body>
        </html>
    );
}
