import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FishBank - Platform Ekosistem Perikanan Indonesia",
  description: "Ensiklopedia ikan dan marketplace perikanan terlengkap di Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-800 text-gray-300 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold text-white">🐠 FishBank</p>
            <p className="mt-1 text-sm">Platform Ekosistem Perikanan Indonesia</p>
            <p className="mt-4 text-xs text-gray-500">&copy; 2026 FishBank. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
