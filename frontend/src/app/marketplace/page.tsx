'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { productApi } from '@/lib/api';

interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
  condition: string;
  images: string[];
  seller: { fullName: string; city: string };
  fishSpecies: { commonName: string } | null;
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        const res: any = await productApi.getAll(Object.keys(params).length ? params : undefined);
        setProducts(res.data || res);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search]);

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <span className="inline-block bg-teal-50 text-teal-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">Marketplace</span>
        <h1 className="text-3xl md:text-4xl font-bold text-ocean-950">Marketplace Ikan</h1>
        <p className="text-slate-500 mt-2">Temukan ikan hias berkualitas dari seller terpercaya</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-8">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          <input
            type="text" placeholder="Cari produk ikan..."
            className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-transparent outline-none transition text-sm"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-3 border-ocean-200 border-t-ocean-600 rounded-full animate-spin mb-4" />
          <p className="text-slate-400">Memuat produk...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🛒</div>
          <p className="text-slate-400 text-lg">Belum ada produk tersedia</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <Link key={p.id} href={`/marketplace/${p.id}`}
              className="group bg-white rounded-2xl border border-slate-100 overflow-hidden card-hover block">
              {/* Image placeholder */}
              <div className="h-48 bg-gradient-to-br from-ocean-100 via-teal-50 to-ocean-50 flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300">🐠</div>
                {p.condition && (
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-ocean-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-ocean-100">
                    {p.condition}
                  </span>
                )}
                {p.stock <= 3 && p.stock > 0 && (
                  <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    Sisa {p.stock}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h2 className="font-bold text-ocean-950 mb-1 line-clamp-1 group-hover:text-ocean-600 transition">{p.title}</h2>
                {p.fishSpecies && (
                  <p className="text-xs text-teal-600 font-medium mb-2">{p.fishSpecies.commonName}</p>
                )}
                <p className="text-xl font-extrabold text-ocean-700 mb-3">{formatPrice(p.price)}</p>
                <div className="flex justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                    Stok: {p.stock}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                    {p.seller?.city || 'Indonesia'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
