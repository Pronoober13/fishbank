'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'glass-dark shadow-lg shadow-ocean-950/20'
        : 'bg-ocean-950/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ocean-400 to-teal-400 flex items-center justify-center text-white text-lg font-bold shadow-md group-hover:shadow-ocean-400/40 transition-shadow">
              🐟
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Fish<span className="text-teal-400">Bank</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/fish" className="px-4 py-2 rounded-lg text-ocean-200 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium">
              Ensiklopedia
            </Link>
            <Link href="/marketplace" className="px-4 py-2 rounded-lg text-ocean-200 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium">
              Marketplace
            </Link>
            <div className="w-px h-6 bg-white/20 mx-2" />
            <Link href="/auth/login" className="px-5 py-2 rounded-lg text-white border border-white/25 hover:bg-white/10 transition-all duration-200 text-sm font-medium">
              Masuk
            </Link>
            <Link href="/auth/register" className="px-5 py-2 rounded-lg bg-gradient-to-r from-ocean-500 to-teal-500 text-white hover:from-ocean-400 hover:to-teal-400 transition-all duration-200 text-sm font-semibold shadow-md shadow-ocean-500/25">
              Daftar
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-white/10 transition" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1 border-t border-white/10">
            <Link href="/fish" className="block px-4 py-2.5 rounded-lg text-ocean-200 hover:text-white hover:bg-white/10 transition" onClick={() => setIsMenuOpen(false)}>
              Ensiklopedia
            </Link>
            <Link href="/marketplace" className="block px-4 py-2.5 rounded-lg text-ocean-200 hover:text-white hover:bg-white/10 transition" onClick={() => setIsMenuOpen(false)}>
              Marketplace
            </Link>
            <div className="h-px bg-white/10 my-2" />
            <Link href="/auth/login" className="block px-4 py-2.5 rounded-lg text-white hover:bg-white/10 transition" onClick={() => setIsMenuOpen(false)}>
              Masuk
            </Link>
            <Link href="/auth/register" className="block px-4 py-2.5 rounded-lg bg-gradient-to-r from-ocean-500 to-teal-500 text-white text-center font-medium" onClick={() => setIsMenuOpen(false)}>
              Daftar Sekarang
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
