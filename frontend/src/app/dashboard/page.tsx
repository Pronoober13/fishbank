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
    pending_payment: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Memuat dashboard...</div>;
  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">👤 Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        {(['profile', 'orders'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`pb-2 px-1 font-medium ${tab === t ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
            {t === 'profile' ? '👤 Profil' : '📦 Pesanan'}
          </button>
        ))}
      </div>

      {tab === 'profile' ? (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: 'Nama', value: user.fullName },
              { label: 'Email', value: user.email },
              { label: 'Telepon', value: user.phone || '-' },
              { label: 'Kota', value: user.city || '-' },
              { label: 'Provinsi', value: user.province || '-' },
              { label: 'Role', value: user.role },
              { label: 'Status Seller', value: user.sellerVerificationStatus || 'not_applied' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="font-medium text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Belum ada pesanan</div>
          ) : orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">{order.product?.title || 'Produk'}</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-700">{formatPrice(order.totalPrice)}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor[order.status] || 'bg-gray-100'}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

