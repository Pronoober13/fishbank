'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { userApi, orderApi, reviewApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phone: string;
  city: string;
  province: string;
  sellerVerificationStatus: string;
}

interface Order {
  id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  productId: string;
  product: { id: string; title: string };
  hasReview?: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const { token: authToken, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'profile' | 'orders'>('profile');

  // Review modal state
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewHover, setReviewHover] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewedOrders, setReviewedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!authToken) { router.push('/auth/login'); return; }

    const fetchData = async () => {
      try {
        const [profileRes, ordersRes]: any[] = await Promise.all([
          userApi.getProfile(authToken),
          orderApi.getBuyerOrders(authToken),
        ]);
        setUser(profileRes);
        setOrders(ordersRes.data || ordersRes || []);
      } catch {
        logout();
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [authToken, router, logout]);

  const handleSubmitReview = async () => {
    if (!reviewOrder || !authToken) return;
    setSubmittingReview(true);
    try {
      await reviewApi.create({
        orderId: reviewOrder.id,
        productId: reviewOrder.product?.id || reviewOrder.productId,
        rating: reviewRating,
        comment: reviewComment || undefined,
      }, authToken);
      setReviewedOrders((prev) => new Set(prev).add(reviewOrder.id));
      setReviewOrder(null);
      setReviewRating(5);
      setReviewComment('');
    } catch (err: any) {
      alert(err.message || 'Gagal mengirim review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const statusColor: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    pending_payment: 'bg-amber-50 text-amber-700 border-amber-200',
    paid: 'bg-ocean-50 text-ocean-700 border-ocean-200',
    processing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-teal-50 text-teal-700 border-teal-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  const statusLabel: Record<string, string> = {
    pending: 'Menunggu', pending_payment: 'Menunggu Bayar', paid: 'Dibayar',
    processing: 'Diproses', shipped: 'Dikirim', delivered: 'Diterima',
    completed: 'Selesai', cancelled: 'Dibatalkan',
  };

  if (loading) return (
    <div className="text-center py-20">
      <div className="inline-block w-8 h-8 border-3 border-ocean-200 border-t-ocean-600 rounded-full animate-spin mb-4" />
      <p className="text-slate-400">Memuat dashboard...</p>
    </div>
  );
  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ocean-400 to-teal-400 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-ocean-400/20">
          {user.fullName?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-ocean-950">Halo, {user.fullName}!</h1>
          <p className="text-slate-400 text-sm">Selamat datang di dashboard Anda</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-slate-100 rounded-xl p-1 w-fit">
        {([['profile', 'Profil'], ['orders', 'Pesanan']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key as 'profile' | 'orders')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-white text-ocean-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'profile' ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
          <h2 className="text-lg font-bold text-ocean-950 mb-5">Informasi Profil</h2>

          {(user.role === 'seller' || user.role === 'admin') && (
            <Link href="/dashboard/products"
              className="mb-5 flex items-center justify-between p-4 bg-gradient-to-r from-ocean-50 to-teal-50 rounded-xl border border-ocean-100 hover:border-ocean-300 transition group">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <p className="font-semibold text-ocean-950 text-sm">Produk Saya</p>
                  <p className="text-xs text-slate-400">Kelola listing produk ikan Anda</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-ocean-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </Link>
          )}
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { label: 'Nama Lengkap', value: user.fullName, icon: '👤' },
              { label: 'Email', value: user.email, icon: '📧' },
              { label: 'Telepon', value: user.phone || '-', icon: '📱' },
              { label: 'Kota', value: user.city || '-', icon: '🏙️' },
              { label: 'Provinsi', value: user.province || '-', icon: '📍' },
              { label: 'Role', value: user.role, icon: '🔑' },
              { label: 'Status Seller', value: user.sellerVerificationStatus || 'not_applied', icon: '🏪' },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">{item.label}</span>
                </div>
                <p className="font-semibold text-ocean-950">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-slate-400 text-lg">Belum ada pesanan</p>
              <p className="text-slate-400 text-sm mt-1">Mulai belanja di marketplace</p>
            </div>
          ) : orders.map((order) => {
            const canReview = order.status === 'completed' && !order.hasReview && !reviewedOrders.has(order.id);
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:border-ocean-200 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-ocean-950">{order.product?.title || 'Produk'}</p>
                    <p className="text-sm text-slate-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-ocean-700">{formatPrice(order.totalPrice)}</p>
                    <span className={`inline-block text-xs px-2.5 py-1 rounded-full border font-medium mt-1 ${statusColor[order.status] || 'bg-slate-50 border-slate-200'}`}>
                      {statusLabel[order.status] || order.status}
                    </span>
                  </div>
                </div>
                {canReview && (
                  <button
                    onClick={() => { setReviewOrder(order); setReviewRating(5); setReviewComment(''); }}
                    className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition"
                  >
                    ⭐ Beri Review
                  </button>
                )}
                {(order.hasReview || reviewedOrders.has(order.id)) && order.status === 'completed' && (
                  <p className="mt-3 text-xs text-emerald-600 font-medium flex items-center gap-1">
                    ✅ Sudah direview
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-7">
            <h2 className="text-lg font-bold text-ocean-950 mb-1">Beri Review</h2>
            <p className="text-sm text-slate-400 mb-5">{reviewOrder.product?.title || 'Produk'}</p>

            {/* Star Rating */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-ocean-950 mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    onMouseEnter={() => setReviewHover(star)}
                    onMouseLeave={() => setReviewHover(0)}
                    className="text-3xl transition-transform hover:scale-110"
                  >
                    {star <= (reviewHover || reviewRating) ? '⭐' : '☆'}
                  </button>
                ))}
                <span className="ml-2 text-sm text-slate-500 self-center font-medium">{reviewRating}/5</span>
              </div>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-ocean-950 mb-1.5">Komentar (opsional)</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Ceritakan pengalaman Anda..."
                rows={3}
                maxLength={500}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-transparent outline-none transition text-sm resize-none"
              />
              <p className="text-xs text-slate-400 mt-1 text-right">{reviewComment.length}/500</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setReviewOrder(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-ocean-500 to-teal-500 hover:from-ocean-400 hover:to-teal-400 transition-all disabled:opacity-50 shadow-md shadow-ocean-500/20"
              >
                {submittingReview ? 'Mengirim...' : 'Kirim Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
