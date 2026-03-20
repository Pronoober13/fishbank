'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🐠</span>
            <span className="text-xl font-bold">FishBank</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/fish" className="hover:text-blue-200 transition">
              📚 Ensiklopedia
            </Link>
            <Link href="/marketplace" className="hover:text-blue-200 transition">
              🛒 Marketplace
            </Link>
            <Link href="/auth/login" className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition">
              Masuk
            </Link>
            <Link href="/auth/register" className="bg-blue-500 px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition">
              Daftar
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/fish" className="block py-2 hover:text-blue-200">📚 Ensiklopedia</Link>
            <Link href="/marketplace" className="block py-2 hover:text-blue-200">🛒 Marketplace</Link>
            <Link href="/auth/login" className="block py-2 hover:text-blue-200">Masuk</Link>
            <Link href="/auth/register" className="block py-2 hover:text-blue-200">Daftar</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

