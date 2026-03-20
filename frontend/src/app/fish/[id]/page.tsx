'use client';

import { useState, useEffect } from 'react';
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

  if (loading) return <div className="text-center py-20 text-gray-500">Memuat detail ikan...</div>;
  if (!fish) return <div className="text-center py-20 text-gray-500">Ikan tidak ditemukan</div>;

  const infoCards = [
    { label: '🌡️ Suhu', value: `${fish.tempMin}–${fish.tempMax}°C` },
    { label: '⚗️ pH', value: `${fish.phMin}–${fish.phMax}` },
    { label: '📏 Ukuran Max', value: `${fish.maxSizeCm} cm` },
    { label: '🏠 Min Tank', value: `${fish.minTankSizeLiters} L` },
    { label: '🔥 Agresivitas', value: fish.aggressiveness },
    { label: '📊 Level', value: fish.difficultyLevel },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/fish" className="text-blue-600 hover:underline mb-4 inline-block">← Kembali ke Ensiklopedia</Link>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{fish.commonName}</h1>
            <p className="text-lg text-gray-500 italic">{fish.scientificName}</p>
            {fish.localName && <p className="text-sm text-gray-500">Nama lokal: {fish.localName}</p>}
          </div>
          {fish.isProtected && (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
              🛡 Dilindungi {fish.citesAppendix ? `(CITES ${fish.citesAppendix})` : ''}
            </span>
          )}
        </div>

        <p className="text-gray-700 mb-6">{fish.description}</p>

        {fish.isProtected && fish.protectionNote && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-800 font-medium">⚠️ Status Perlindungan</p>
            <p className="text-red-700 text-sm mt-1">{fish.protectionNote}</p>
          </div>
        )}

        {/* Parameter Cards */}
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Parameter Perawatan</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {infoCards.map((c) => (
            <div key={c.label} className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-500">{c.label}</p>
              <p className="text-lg font-semibold text-blue-700">{c.value}</p>
            </div>
          ))}
        </div>

        {/* Diet */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">🍽️ Makanan</h2>
        <p className="text-gray-700 mb-6">{fish.dietDescription}</p>

        {/* Care Tips */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">💡 Tips Perawatan</h2>
        <p className="text-gray-700 mb-6">{fish.careTips}</p>

        {/* Distribution */}
        {fish.distributionProvinces?.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">📍 Distribusi</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {fish.distributionProvinces.map((p) => (
                <span key={p} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">{p}</span>
              ))}
            </div>
          </>
        )}

        {/* IUCN Status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <span className="text-sm text-gray-500">Status IUCN: </span>
          <span className="font-semibold text-gray-800">{fish.iucnStatus}</span>
        </div>
      </div>
    </div>
  );
}

