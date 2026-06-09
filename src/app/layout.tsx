import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
 title: "HRIS — Human Resource Integration System",
 description: "Sistem manajemen kantor terintegrasi untuk mengelola workflow operasional perusahaan.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html lang="id">
 <head>
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
   <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
 </head>
 <body className="font-sans antialiased" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
 {children}
 </body>
 </html>
 );
}
