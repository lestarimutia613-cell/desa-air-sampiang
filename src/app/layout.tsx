import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Desa Air Sempiang - Website Desa Digital Terintegrasi",
  description: "Implementasi Website Desa Digital Terintegrasi sebagai Upaya Optimalisasi Layanan Pendidikan, Pemberdayaan UMKM dan Pertanian, serta Penguatan Program Desa Cantik di Desa Air Sempiang Kabupaten Kepahiang Provinsi Bengkulu",
  keywords: ["Desa Air Sempiang", "Desa Digital", "Kepahiang", "Bengkulu", "Program Desa Cantik", "UMKM", "Pertanian", "Marketplace Desa"],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
