'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { productApi, orderApi, reviewApi, paymentApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

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
  imageUrls: string[];
  shippingMethods: string[];
  seller: { id: string; fullName: string; city: string; province: string };
  fishSpecies: { id: string; commonName: string; scientificName: string } | null;
  averageRating: number;
  totalReviews: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: { fullName: string };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token: authToken } = useAuth();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res: any = await productApi.getById(params.id as string);
        setProduct(res);
        const revRes: any = await reviewApi.getProductReviews(params.id as string);
        setReviews(revRes || []);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  // Load Midtrans Snap.js
  useEffect(() => {
    if (document.getElementById('midtrans-snap')) return;
    const loadSnap = async () => {
      try {
        const { clientKey } = await paymentApi.getClientKey();
        const script = document.createElement('script');
        script.id = 'midtrans-snap';
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', clientKey);
        document.head.appendChild(script);
      } catch { /* ignore */ }
    };
    loadSnap();
  }, []);

  const handleOrder = async () => {
    if (!authToken) { router.push('/auth/login'); return; }
    if (!product) return;
    setOrdering(true);
    try {
      // 1. Create order
      const order: any = await orderApi.create({
        productId: product.id,
        quantity: qty,
        shippingMethod: product.shippingMethods?.[0] || 'standard',
        shippingAddress: 'Alamat dari profil',
      }, authToken);

      // 2. Create Midtrans transaction
      const { snapToken } = await paymentApi.createTransaction(order.id, authToken);

      // 3. Open Snap popup
      const win = window as any;
      if (win.snap) {
        win.snap.pay(snapToken, {
          onSuccess: () => router.push('/dashboard?tab=orders'),
          onPending: () => router.push('/dashboard?tab=orders'),
          onError: () => alert('Pembayaran gagal. Silakan coba lagi.'),
          onClose: () => { /* user closed popup */ },
        });
      } else {
        alert('Order berhasil dibuat! Silakan selesaikan pembayaran.');
        router.push('/dashboard');
      }
    } catch (err: any) {
      alert(err.message || 'Gagal membuat order');
    } finally {
      setOrdering(false);
    }
  };

  const handleChatSeller = () => {
    if (!authToken) { router.push('/auth/login'); return; }
    if (!product) return;
    router.push(`/chat?to=${product.seller.id}&name=${encodeURIComponent(product.seller.fullName)}&product=${product.id}`);
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  if (loading) return (
    <div className="text-center py-20">
      <div className="inline-block w-8 h-8 border-3 border-ocean-200 border-t-ocean-600 rounded-full animate-spin mb-4" />
      <p className="text-slate-400">Memuat produk...</p>
    </div>
  );
  if (!product) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">🛒</div>
      <p className="text-slate-400 text-lg">Produk tidak ditemukan</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link href="/marketplace" className="inline-flex items-center gap-2 text-ocean-600 hover:text-ocean-800 transition mb-6 text-sm font-medium group">
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
        Kembali ke Marketplace
      </Link>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="md:flex">
          {/* Image */}
          <div className="md:w-1/2 h-80 md:h-auto bg-gradient-to-br from-ocean-100 via-teal-50 to-ocean-50 flex items-center justify-center relative overflow-hidden">
            {(product.imageUrls?.[0] || product.images?.[0]) ? (
              <img src={product.imageUrls?.[0] || product.images?.[0]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="text-8xl animate-float">🐠</div>
            )}
            {product.condition && (
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-ocean-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-ocean-100">
                {product.condition}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="md:w-1/2 p-8">
            <h1 className="text-2xl font-bold text-ocean-950 mb-1">{product.title}</h1>
            {product.fishSpecies && (
              <Link href={`/fish/${product.fishSpecies.id}`} className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-800 transition font-medium">
                {product.fishSpecies.commonName}
                <span className="text-slate-400 italic">({product.fishSpecies.scientificName})</span>
              </Link>
            )}
            <p className="text-3xl font-extrabold text-ocean-700 mt-4">{formatPrice(product.price)}</p>
            {product.totalReviews > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-amber-500">{'⭐'.repeat(Math.round(product.averageRating))}</span>
                <span className="text-sm font-semibold text-ocean-950">{product.averageRating.toFixed(1)}</span>
                <span className="text-sm text-slate-400">({product.totalReviews} ulasan)</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-xs block">Kondisi</span>
                <span className="font-semibold text-ocean-950">{product.condition}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-xs block">Stok</span>
                <span className="font-semibold text-ocean-950">{product.stock}</span>
              </div>
              {product.sizeCm > 0 && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-xs block">Ukuran</span>
                  <span className="font-semibold text-ocean-950">{product.sizeCm} cm</span>
                </div>
              )}
              {product.ageMths > 0 && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-xs block">Umur</span>
                  <span className="font-semibold text-ocean-950">{product.ageMths} bulan</span>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <label className="text-sm text-slate-500 font-medium">Jumlah:</label>
              <input type="number" min={1} max={product.stock} value={qty} onChange={(e) => setQty(Number(e.target.value))}
                className="w-20 px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-transparent outline-none text-sm" />
            </div>

            <button onClick={handleOrder} disabled={ordering || product.stock === 0}
              className="w-full mt-5 bg-gradient-to-r from-ocean-600 to-teal-500 text-white py-3.5 rounded-xl font-semibold hover:from-ocean-500 hover:to-teal-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-ocean-500/20">
              {ordering ? 'Memproses...' : product.stock === 0 ? 'Stok Habis' : '💳 Beli & Bayar'}
            </button>

            <button onClick={handleChatSeller}
              className="w-full mt-3 py-3.5 rounded-xl font-semibold text-ocean-700 border-2 border-ocean-200 hover:bg-ocean-50 transition-all text-sm">
              💬 Chat Seller
            </button>

            {/* Seller info */}
            <div className="mt-5 p-4 bg-ocean-50 rounded-xl border border-ocean-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm">
                {product.seller?.fullName?.charAt(0) || 'S'}
              </div>
              <div>
                <p className="font-semibold text-ocean-950 text-sm">{product.seller?.fullName}</p>
                <p className="text-xs text-slate-400">{product.seller?.city}, {product.seller?.province}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-8 border-t border-slate-100">
          <h2 className="text-xl font-bold text-ocean-950 mb-3">Deskripsi</h2>
          <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{product.description}</p>
        </div>

        {/* Reviews */}
        <div className="p-8 border-t border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-ocean-950">Ulasan</h2>
            {product.totalReviews > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-amber-500 text-lg">{'⭐'.repeat(Math.round(product.averageRating))}</span>
                <span className="text-sm font-semibold text-ocean-950">{product.averageRating.toFixed(1)}</span>
                <span className="text-sm text-slate-400">({product.totalReviews} ulasan)</span>
              </div>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-3xl mb-2">📝</div>
              <p className="text-slate-400 text-sm">Belum ada ulasan untuk produk ini</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ocean-400 to-teal-400 flex items-center justify-center text-white text-xs font-bold">
                        {rev.reviewer?.fullName?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ocean-950">{rev.reviewer?.fullName || 'User'}</p>
                        <p className="text-xs text-slate-400">{new Date(rev.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-amber-500 text-sm">{'⭐'.repeat(rev.rating)}</span>
                      <span className="text-xs text-slate-500 font-medium">{rev.rating}/5</span>
                    </div>
                  </div>
                  {rev.comment && (
                    <p className="text-sm text-slate-600 leading-relaxed mt-2">{rev.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
