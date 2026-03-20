'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userApi, orderApi } from '@/lib/api';

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
  product: { title: string };
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'profile' | 'orders'>('profile');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/login'); return; }

    const fetchData = async () => {
      try {
        const [profileRes, ordersRes]: any[] = await Promise.all([
          userApi.getProfile(token),
          orderApi.getBuyerOrders(token),
        ]);
        setUser(profileRes);
        setOrders(ordersRes.data || ordersRes || []);
      } catch {
        localStorage.removeItem('token');
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const statusColor: Record<string, string> = {
    pending_payment: 'bg-amber-50 text-amber-700 border-amber-200',
    paid: 'bg-ocean-50 text-ocean-700 border-ocean-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  const statusLabel: Record<string, string> = {
    pending_payment: 'Menunggu Bayar', paid: 'Dibayar', shipped: 'Dikirim', completed: 'Selesai', cancelled: 'Dibatalkan',
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
          ) : orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between hover:border-ocean-200 transition">
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
          ))}
        </div>
      )}
    </div>
  );
}
