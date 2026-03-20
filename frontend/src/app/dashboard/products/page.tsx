'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { productApi, fishApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import ImageUpload from '@/components/ImageUpload';

interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
  status: string;
  imageUrls: string[];
  fishSpecies?: { commonName: string };
  createdAt: string;
}

interface FishOption {
  id: string;
  commonName: string;
  scientificName: string;
  isProtected: boolean;
}

const statusColor: Record<string, string> = {
  pending_review: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  paused: 'bg-slate-50 text-slate-600 border-slate-200',
};
const statusLabel: Record<string, string> = {
  pending_review: 'Menunggu Review', approved: 'Aktif', rejected: 'Ditolak', paused: 'Dijeda',
};

export default function SellerProductsPage() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [fishOptions, setFishOptions] = useState<FishOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [form, setForm] = useState({
    fishSpeciesId: '',
    title: '',
    description: '',
    price: '',
    unit: 'pcs',
    stock: '',
    sizeInfo: '',
    ageInfo: '',
    imageUrls: [] as string[],
    pickupLocation: '',
    shippingMethods: ['standard'],
  });

  useEffect(() => {
    if (!token) { router.push('/auth/login'); return; }
    const fetchData = async () => {
      try {
        const [productsRes, fishRes]: any[] = await Promise.all([
          productApi.getMyListings(token),
          fishApi.getAll(),
        ]);
        setProducts(productsRes || []);
        const allFish = fishRes.data || fishRes || [];
        setFishOptions(allFish.filter((f: FishOption) => !f.isProtected));
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    fetchData();
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.imageUrls.length < 3) { setError('Minimal 3 foto produk'); return; }
    if (!form.fishSpeciesId) { setError('Pilih spesies ikan'); return; }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
      };
      await productApi.create(payload, token!);
      // Refresh list
      const res: any = await productApi.getMyListings(token!);
      setProducts(res || []);
      setShowForm(false);
      setForm({ fishSpeciesId: '', title: '', description: '', price: '', unit: 'pcs', stock: '', sizeInfo: '', ageInfo: '', imageUrls: [], pickupLocation: '', shippingMethods: ['standard'] });
    } catch (err: any) {
      setError(err.message || 'Gagal membuat listing');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (p: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

  if (!token) return null;

  if (loading) return (
    <div className="text-center py-20">
      <div className="inline-block w-8 h-8 border-3 border-ocean-200 border-t-ocean-600 rounded-full animate-spin mb-4" />
      <p className="text-slate-400">Memuat produk...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/dashboard" className="text-sm text-ocean-600 hover:text-ocean-800 transition mb-2 inline-block">← Dashboard</Link>
          <h1 className="text-2xl font-bold text-ocean-950">Produk Saya</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola listing produk ikan Anda</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-gradient-to-r from-ocean-500 to-teal-500 text-white rounded-xl font-semibold text-sm hover:from-ocean-400 hover:to-teal-400 transition-all shadow-md shadow-ocean-500/20"
        >
          {showForm ? 'Batal' : '+ Listing Baru'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 mb-8">
          <h2 className="text-lg font-bold text-ocean-950 mb-5">Buat Listing Baru</h2>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-3.5 rounded-xl mb-5 text-sm border border-rose-200 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Fish Species */}
            <div>
              <label className="block text-sm font-semibold text-ocean-950 mb-1.5">Spesies Ikan *</label>
              <select
                required
                value={form.fishSpeciesId}
                onChange={(e) => setForm({ ...form, fishSpeciesId: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-transparent outline-none transition text-sm bg-white"
              >
                <option value="">Pilih spesies...</option>
                {fishOptions.map((f) => (
                  <option key={f.id} value={f.id}>{f.commonName} ({f.scientificName})</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-ocean-950 mb-1.5">Judul Produk *</label>
              <input
                type="text" required maxLength={100}
                placeholder="Contoh: Cupang Halfmoon Blue Rim"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-transparent outline-none transition text-sm"
              />
              <p className="text-xs text-slate-400 mt-1 text-right">{form.title.length}/100</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-ocean-950 mb-1.5">Deskripsi *</label>
              <textarea
                required maxLength={1000} rows={4}
                placeholder="Jelaskan kondisi, warna, keunikan ikan..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-transparent outline-none transition text-sm resize-none"
              />
              <p className="text-xs text-slate-400 mt-1 text-right">{form.description.length}/1000</p>
            </div>

            {/* Price + Unit + Stock */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-ocean-950 mb-1.5">Harga (Rp) *</label>
                <input
                  type="number" required min={1}
                  placeholder="50000"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-transparent outline-none transition text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ocean-950 mb-1.5">Satuan</label>
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-transparent outline-none transition text-sm bg-white"
                >
                  <option value="pcs">Ekor (pcs)</option>
                  <option value="pair">Pasang (pair)</option>
                  <option value="kg">Kilogram (kg)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ocean-950 mb-1.5">Stok *</label>
                <input
                  type="number" required min={1}
                  placeholder="10"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-transparent outline-none transition text-sm"
                />
              </div>
            </div>

            {/* Size + Age */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-ocean-950 mb-1.5">Ukuran</label>
                <input
                  type="text" placeholder="5-7 cm"
                  value={form.sizeInfo}
                  onChange={(e) => setForm({ ...form, sizeInfo: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-transparent outline-none transition text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ocean-950 mb-1.5">Umur</label>
                <input
                  type="text" placeholder="3-4 bulan"
                  value={form.ageInfo}
                  onChange={(e) => setForm({ ...form, ageInfo: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-transparent outline-none transition text-sm"
                />
              </div>
            </div>

            {/* Pickup Location */}
            <div>
              <label className="block text-sm font-semibold text-ocean-950 mb-1.5">Lokasi Pickup</label>
              <input
                type="text" placeholder="Contoh: Yogyakarta, Sleman"
                value={form.pickupLocation}
                onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-transparent outline-none transition text-sm"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-ocean-950 mb-1.5">Foto Produk * (min 3, max 10)</label>
              <ImageUpload
                token={token!}
                images={form.imageUrls}
                onChange={(urls) => setForm({ ...form, imageUrls: urls })}
                min={3}
                max={10}
              />
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={submitting}
              className="w-full bg-gradient-to-r from-ocean-600 to-teal-500 text-white py-3 rounded-xl font-semibold hover:from-ocean-500 hover:to-teal-400 transition-all disabled:opacity-50 shadow-lg shadow-ocean-500/20"
            >
              {submitting ? 'Membuat listing...' : 'Buat Listing'}
            </button>
          </form>
        </div>
      )}

      {/* Product List */}
      {products.length === 0 && !showForm ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-slate-400 text-lg">Belum ada produk</p>
          <p className="text-slate-400 text-sm mt-1">Buat listing pertama Anda</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-ocean-200 transition">
              <div className="flex">
                {/* Thumbnail */}
                <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-ocean-100 to-teal-50 flex items-center justify-center overflow-hidden">
                  {p.imageUrls?.[0] ? (
                    <img src={p.imageUrls[0]} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">🐠</span>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-ocean-950">{p.title}</p>
                    <p className="text-sm text-slate-400">{p.fishSpecies?.commonName || ''} · Stok: {p.stock}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-ocean-700">{formatPrice(p.price)}</p>
                    <span className={`inline-block text-xs px-2.5 py-1 rounded-full border font-medium mt-1 ${statusColor[p.status] || 'bg-slate-50 border-slate-200'}`}>
                      {statusLabel[p.status] || p.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
