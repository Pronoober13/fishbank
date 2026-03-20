'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fishApi } from '@/lib/api';

interface FishDetail {
  id: string;
  commonName: string;
  scientificName: string;
  localName: string;
  habitat: string;
  description: string;
  distributionProvinces: string[];
  tempMin: number;
  tempMax: number;
  phMin: number;
  phMax: number;
  minTankSizeLiters: number;
  maxSizeCm: number;
  dietDescription: string;
  aggressiveness: string;
  careTips: string;
  difficultyLevel: string;
  isProtected: boolean;
  citesAppendix: string | null;
  iucnStatus: string;
  protectionNote: string | null;
}

const ProvinceMap = lazy(() => import('@/components/ProvinceMap'));

export default function FishDetailPage() {
  const params = useParams();
  const [fish, setFish] = useState<FishDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFish = async () => {
      try {
        const res: any = await fishApi.getById(params.id as string);
        setFish(res);
      } catch {
        setFish(null);
      } finally {
        setLoading(false);
      }
    };
    fetchFish();
  }, [params.id]);

  if (loading) return (
    <div className="text-center py-20">
      <div className="inline-block w-8 h-8 border-3 border-ocean-200 border-t-ocean-600 rounded-full animate-spin mb-4" />
      <p className="text-slate-400">Memuat detail ikan...</p>
    </div>
  );
  if (!fish) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">🐠</div>
      <p className="text-slate-400 text-lg">Ikan tidak ditemukan</p>
    </div>
  );

  const infoCards = [
    { label: 'Suhu', value: `${fish.tempMin}–${fish.tempMax}°C`, icon: '🌡️', color: 'from-orange-400 to-red-400' },
    { label: 'pH', value: `${fish.phMin}–${fish.phMax}`, icon: '⚗️', color: 'from-purple-400 to-indigo-400' },
    { label: 'Ukuran Max', value: `${fish.maxSizeCm} cm`, icon: '📏', color: 'from-ocean-400 to-ocean-600' },
    { label: 'Min Tank', value: `${fish.minTankSizeLiters} L`, icon: '🏠', color: 'from-teal-400 to-emerald-500' },
    { label: 'Agresivitas', value: fish.aggressiveness, icon: '🔥', color: 'from-rose-400 to-pink-500' },
    { label: 'Level', value: fish.difficultyLevel, icon: '📊', color: 'from-amber-400 to-orange-500' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Back link */}
      <Link href="/fish" className="inline-flex items-center gap-2 text-ocean-600 hover:text-ocean-800 transition mb-6 text-sm font-medium group">
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
        Kembali ke Ensiklopedia
      </Link>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Top gradient */}
        <div className="h-3 bg-gradient-to-r from-ocean-400 via-teal-400 to-ocean-500" />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-ocean-950">{fish.commonName}</h1>
              <p className="text-lg text-slate-400 italic mt-1">{fish.scientificName}</p>
              {fish.localName && <p className="text-sm text-slate-500 mt-1">Nama lokal: <span className="font-medium">{fish.localName}</span></p>}
            </div>
            {fish.isProtected && (
              <span className="flex-shrink-0 bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full text-sm font-semibold border border-rose-200">
                🛡 Dilindungi {fish.citesAppendix ? `(CITES ${fish.citesAppendix})` : ''}
              </span>
            )}
          </div>

          <p className="text-slate-600 leading-relaxed mb-8">{fish.description}</p>

          {fish.isProtected && fish.protectionNote && (
            <div className="bg-rose-50 border border-rose-200 p-5 mb-8 rounded-xl flex gap-3">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <div>
                <p className="text-rose-800 font-semibold">Status Perlindungan</p>
                <p className="text-rose-700 text-sm mt-1">{fish.protectionNote}</p>
              </div>
            </div>
          )}

          {/* Parameter Cards */}
          <h2 className="text-xl font-bold text-ocean-950 mb-4">Parameter Perawatan</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {infoCards.map((c) => (
              <div key={c.label} className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-ocean-200 transition">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center text-sm`}>{c.icon}</div>
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">{c.label}</span>
                </div>
                <p className="text-lg font-bold text-ocean-950">{c.value}</p>
              </div>
            ))}
          </div>

          {/* Diet & Care in 2-col grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-ocean-50 rounded-xl p-6 border border-ocean-100">
              <h2 className="text-lg font-bold text-ocean-950 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center text-sm">🍽️</span>
                Makanan
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">{fish.dietDescription}</p>
            </div>
            <div className="bg-teal-50 rounded-xl p-6 border border-teal-100">
              <h2 className="text-lg font-bold text-ocean-950 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-sm">💡</span>
                Tips Perawatan
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">{fish.careTips}</p>
            </div>
          </div>

          {/* Distribution */}
          {fish.distributionProvinces?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-ocean-950 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-sm">📍</span>
                Peta Distribusi
              </h2>
              <Suspense fallback={
                <div className="w-full h-64 md:h-80 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <p className="text-slate-400 text-sm">Memuat peta...</p>
                </div>
              }>
                <ProvinceMap provinces={fish.distributionProvinces} />
              </Suspense>
              <div className="flex flex-wrap gap-2 mt-4">
                {fish.distributionProvinces.map((p) => (
                  <span key={p} className="bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full text-sm font-medium border border-emerald-200">{p}</span>
                ))}
              </div>
            </div>
          )}

          {/* IUCN Status */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-500 font-medium">Status IUCN</span>
            <span className="font-bold text-ocean-950 bg-ocean-100 px-4 py-1.5 rounded-full text-sm">{fish.iucnStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
