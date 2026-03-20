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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">🛒 Marketplace</h1>
      <p className="text-gray-600 mb-6">Temukan ikan hias berkualitas dari seller terpercaya</p>

      {/* Search */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <input
          type="text" placeholder="🔍 Cari produk..." className="w-full px-4 py-2 border rounded-lg"
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Memuat produk...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">Belum ada produk tersedia</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <Link key={p.id} href={`/marketplace/${p.id}`}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden block">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-6xl">
                🐠
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-gray-800 mb-1 line-clamp-1">{p.title}</h2>
                {p.fishSpecies && (
                  <p className="text-xs text-blue-600 mb-1">{p.fishSpecies.commonName}</p>
                )}
                <p className="text-xl font-bold text-blue-700 mb-2">{formatPrice(p.price)}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>📦 Stok: {p.stock}</span>
                  <span>📍 {p.seller?.city || 'Indonesia'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

