'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function adminFetch(endpoint: string, token: string) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

async function adminPost(endpoint: string, token: string, body?: any) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

interface Dashboard {
  totalUsers: number; totalSellers: number; totalProducts: number; totalOrders: number;
  pendingProducts: number; pendingSellers: number; pendingReports: number;
  totalGMV: number; totalPlatformFee: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [pendingSellers, setPendingSellers] = useState<any[]>([]);
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'sellers' | 'products'>('overview');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || user.role !== 'admin') { router.push('/'); return; }

    const fetchData = async () => {
      try {
        const [dash, sellers, products] = await Promise.all([
          adminFetch('/api/admin/dashboard', token),
          adminFetch('/api/admin/sellers/pending', token),
          adminFetch('/api/admin/products/pending', token),
        ]);
        setDashboard(dash);
        setPendingSellers(sellers);
        setPendingProducts(products);
      } catch {
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleApproveSeller = async (userId: string) => {
    const token = localStorage.getItem('token')!;
    await adminPost(`/api/admin/sellers/${userId}/approve`, token);
    setPendingSellers((s) => s.filter((x) => x.id !== userId));
  };

  const handleApproveProduct = async (productId: string) => {
    const token = localStorage.getItem('token')!;
    await adminPost(`/api/admin/products/${productId}/approve`, token);
    setPendingProducts((p) => p.filter((x) => x.id !== productId));
  };

  const formatPrice = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  if (loading) return <div className="text-center py-20 text-gray-500">Memuat admin panel...</div>;
  if (!dashboard) return null;

  const stats = [
    { label: 'Total Users', value: dashboard.totalUsers, icon: '👥' },
    { label: 'Total Sellers', value: dashboard.totalSellers, icon: '🏪' },
    { label: 'Total Produk', value: dashboard.totalProducts, icon: '📦' },
    { label: 'Total Orders', value: dashboard.totalOrders, icon: '🛒' },
    { label: 'Pending Sellers', value: dashboard.pendingSellers, icon: '⏳' },
    { label: 'Pending Produk', value: dashboard.pendingProducts, icon: '⏳' },
    { label: 'Total GMV', value: formatPrice(dashboard.totalGMV), icon: '💰' },
    { label: 'Platform Fee', value: formatPrice(dashboard.totalPlatformFee), icon: '💵' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <span className="inline-block bg-ocean-100 text-ocean-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">Admin</span>
        <h1 className="text-3xl font-bold text-ocean-950">Admin Panel</h1>
        <p className="text-slate-400 mt-1">Kelola platform FishBank</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-slate-100 rounded-xl p-1 w-fit">
        {([['overview', 'Overview'], ['sellers', 'Sellers'], ['products', 'Produk']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key as 'overview' | 'sellers' | 'products')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-white text-ocean-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 card-hover">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-ocean-50 flex items-center justify-center text-lg">{s.icon}</div>
              </div>
              <p className="text-2xl font-extrabold text-ocean-950">{s.value}</p>
              <p className="text-xs text-slate-400 font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'sellers' && (
        <div className="space-y-4">
          {pendingSellers.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🏪</div>
              <p className="text-slate-400">Tidak ada seller menunggu verifikasi</p>
            </div>
          ) : pendingSellers.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between hover:border-ocean-200 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm">
                  {s.fullName?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-bold text-ocean-950">{s.fullName}</p>
                  <p className="text-sm text-slate-400">{s.email}</p>
                </div>
              </div>
              <button onClick={() => handleApproveSeller(s.id)}
                className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-5 py-2.5 rounded-xl hover:from-emerald-400 hover:to-green-400 transition font-medium text-sm shadow-md shadow-emerald-500/20">
                Approve
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'products' && (
        <div className="space-y-4">
          {pendingProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-slate-400">Tidak ada produk menunggu approval</p>
            </div>
          ) : pendingProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between hover:border-ocean-200 transition">
              <div>
                <p className="font-bold text-ocean-950">{p.title}</p>
                <p className="text-sm text-slate-400">{p.seller?.fullName} — Rp {p.price?.toLocaleString()}</p>
              </div>
              <button onClick={() => handleApproveProduct(p.id)}
                className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-5 py-2.5 rounded-xl hover:from-emerald-400 hover:to-green-400 transition font-medium text-sm shadow-md shadow-emerald-500/20">
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
