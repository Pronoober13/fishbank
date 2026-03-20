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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🔧 Admin Panel</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        {(['overview', 'sellers', 'products'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`pb-2 px-1 font-medium ${tab === t ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
            {t === 'overview' ? '📊 Overview' : t === 'sellers' ? '🏪 Sellers' : '📦 Produk'}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow p-4 text-center">
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'sellers' && (
        <div className="space-y-4">
          {pendingSellers.length === 0 ? (
            <p className="text-center py-10 text-gray-500">Tidak ada seller menunggu verifikasi</p>
          ) : pendingSellers.map((s) => (
            <div key={s.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{s.fullName}</p>
                <p className="text-sm text-gray-500">{s.email}</p>
              </div>
              <button onClick={() => handleApproveSeller(s.id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                ✅ Approve
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'products' && (
        <div className="space-y-4">
          {pendingProducts.length === 0 ? (
            <p className="text-center py-10 text-gray-500">Tidak ada produk menunggu approval</p>
          ) : pendingProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-gray-500">{p.seller?.fullName} — Rp {p.price?.toLocaleString()}</p>
              </div>
              <button onClick={() => handleApproveProduct(p.id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                ✅ Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

