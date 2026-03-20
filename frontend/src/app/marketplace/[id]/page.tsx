'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { productApi, orderApi } from '@/lib/api';

interface ProductDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  condition: string;
  sizeCm: number;
  ageMths: number;
  images: string[];
  shippingMethods: string[];
  seller: { id: string; fullName: string; city: string; province: string };
  fishSpecies: { id: string; commonName: string; scientificName: string } | null;
  averageRating: number;
  totalReviews: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res: any = await productApi.getById(params.id as string);
        setProduct(res);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  const handleOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/login'); return; }
    if (!product) return;
    setOrdering(true);
    try {
      await orderApi.create({ productId: product.id, quantity: qty, shippingMethod: product.shippingMethods?.[0] || 'standard', shippingAddress: 'Alamat dari profil' }, token);
      alert('Order berhasil dibuat!');
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.message || 'Gagal membuat order');
    } finally {
      setOrdering(false);
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  if (loading) return <div className="text-center py-20 text-gray-500">Memuat produk...</div>;
  if (!product) return <div className="text-center py-20 text-gray-500">Produk tidak ditemukan</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/marketplace" className="text-blue-600 hover:underline mb-4 inline-block">← Kembali ke Marketplace</Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 h-80 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-8xl">
            🐠
          </div>
          <div className="md:w-1/2 p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">{product.title}</h1>
            {product.fishSpecies && (
              <Link href={`/fish/${product.fishSpecies.id}`} className="text-sm text-blue-600 hover:underline">
                {product.fishSpecies.commonName} ({product.fishSpecies.scientificName})
              </Link>
            )}
            <p className="text-3xl font-bold text-blue-700 mt-3">{formatPrice(product.price)}</p>

            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div className="bg-gray-50 p-2 rounded"><span className="text-gray-500">Kondisi:</span> <span className="font-medium">{product.condition}</span></div>
              <div className="bg-gray-50 p-2 rounded"><span className="text-gray-500">Stok:</span> <span className="font-medium">{product.stock}</span></div>
              {product.sizeCm > 0 && <div className="bg-gray-50 p-2 rounded"><span className="text-gray-500">Ukuran:</span> <span className="font-medium">{product.sizeCm} cm</span></div>}
              {product.ageMths > 0 && <div className="bg-gray-50 p-2 rounded"><span className="text-gray-500">Umur:</span> <span className="font-medium">{product.ageMths} bulan</span></div>}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <label className="text-sm text-gray-600">Jumlah:</label>
              <input type="number" min={1} max={product.stock} value={qty} onChange={(e) => setQty(Number(e.target.value))}
                className="w-20 px-2 py-1 border rounded" />
            </div>

            <button onClick={handleOrder} disabled={ordering || product.stock === 0}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
              {ordering ? 'Memproses...' : product.stock === 0 ? 'Stok Habis' : '🛒 Beli Sekarang'}
            </button>

            <div className="mt-4 text-sm text-gray-500">
              <p>📍 Seller: {product.seller?.fullName} — {product.seller?.city}, {product.seller?.province}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Deskripsi</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
        </div>
      </div>
    </div>
  );
}

