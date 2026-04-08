import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HRIS — Human Resource Integration System",
  description: "Sistem manajemen kantor terintegrasi untuk mengelola workflow operasional perusahaan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
