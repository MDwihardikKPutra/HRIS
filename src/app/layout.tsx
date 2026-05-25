import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
 subsets: ["latin"],
 weight: ["200", "300", "400", "500", "600", "700", "800"],
 variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
 title: "HRIS — Human Resource Integration System",
 description: "Sistem manajemen kantor terintegrasi untuk mengelola workflow operasional perusahaan.",
 viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html lang="id" className={plusJakartaSans.variable}>
 <body className="font-sans antialiased">
 {children}
 </body>
 </html>
 );
}
