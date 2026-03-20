import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
      <body className="min-h-full flex flex-col" style={{ background: '#f0f7ff' }}>
        <Navbar />
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-ocean-950 text-ocean-200">
          {/* Wave top */}
          <div className="relative -mb-px">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
              <path d="M0 60V20C240 0 480 40 720 30C960 20 1200 0 1440 20V60H0Z" fill="#162b53"/>
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="md:col-span-1">
                <div className="flex items-center space-x-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ocean-400 to-teal-400 flex items-center justify-center text-lg shadow-md">
                    🐟
                  </div>
                  <span className="text-xl font-bold text-white">
                    Fish<span className="text-teal-400">Bank</span>
                  </span>
                </div>
                <p className="text-sm text-ocean-300 leading-relaxed">
                  Platform ekosistem perikanan Indonesia. Ensiklopedia ikan terlengkap & marketplace terpercaya.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Jelajahi</h4>
                <ul className="space-y-2">
                  <li><Link href="/fish" className="text-sm text-ocean-300 hover:text-teal-400 transition">Ensiklopedia Ikan</Link></li>
                  <li><Link href="/marketplace" className="text-sm text-ocean-300 hover:text-teal-400 transition">Marketplace</Link></li>
                  <li><Link href="/dashboard" className="text-sm text-ocean-300 hover:text-teal-400 transition">Dashboard</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Akun</h4>
                <ul className="space-y-2">
                  <li><Link href="/auth/login" className="text-sm text-ocean-300 hover:text-teal-400 transition">Masuk</Link></li>
                  <li><Link href="/auth/register" className="text-sm text-ocean-300 hover:text-teal-400 transition">Daftar</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Kontak</h4>
                <ul className="space-y-2">
                  <li className="text-sm text-ocean-300">📧 info@fishbank.id</li>
                  <li className="text-sm text-ocean-300">📱 +62 812-3456-7890</li>
                  <li className="text-sm text-ocean-300">📍 Jakarta, Indonesia</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-ocean-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-ocean-400">&copy; 2026 FishBank. All rights reserved.</p>
              <p className="text-xs text-ocean-400">Dibuat dengan 💙 untuk ekosistem perikanan Indonesia</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
