'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fishApi } from '@/lib/api';

interface Fish {
  id: string;
  commonName: string;
  scientificName: string;
  localName: string;
  habitat: string;
  description: string;
  maxSizeCm: number;
  difficultyLevel: string;
  isProtected: boolean;
  iucnStatus: string;
}

const habitatOptions = ['ALL', 'freshwater', 'marine', 'brackish'];
const difficultyOptions = ['ALL', 'beginner', 'intermediate', 'advanced'];

export default function FishEncyclopediaPage() {
  const [fish, setFish] = useState<Fish[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [habitat, setHabitat] = useState('ALL');
  const [difficulty, setDifficulty] = useState('ALL');

  useEffect(() => {
    const fetchFish = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (habitat !== 'ALL') params.habitat = habitat;
        if (difficulty !== 'ALL') params.difficulty = difficulty;
        const res: any = await fishApi.getAll(Object.keys(params).length ? params : undefined);
        setFish(res.data || res);
      } catch {
        setFish([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFish();
  }, [search, habitat, difficulty]);

  const difficultyColor: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">📚 Ensiklopedia Ikan</h1>
      <p className="text-gray-600 mb-6">Jelajahi database spesies ikan Indonesia</p>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text" placeholder="🔍 Cari ikan..." className="flex-1 px-4 py-2 border rounded-lg"
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        <select className="px-4 py-2 border rounded-lg" value={habitat} onChange={(e) => setHabitat(e.target.value)}>
          {habitatOptions.map((h) => <option key={h} value={h}>{h === 'ALL' ? 'Semua Habitat' : h}</option>)}
        </select>
        <select className="px-4 py-2 border rounded-lg" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          {difficultyOptions.map((d) => <option key={d} value={d}>{d === 'ALL' ? 'Semua Level' : d}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Memuat data ikan...</div>
      ) : fish.length === 0 ? (
        <div className="text-center py-20 text-gray-500">Tidak ada ikan ditemukan</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fish.map((f) => (
            <Link key={f.id} href={`/fish/${f.id}`}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 block">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-800">{f.commonName}</h2>
                {f.isProtected && <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">🛡 Dilindungi</span>}
              </div>
              <p className="text-sm text-gray-500 italic mb-2">{f.scientificName}</p>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{f.description}</p>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{f.habitat}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${difficultyColor[f.difficultyLevel] || 'bg-gray-100'}`}>{f.difficultyLevel}</span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">Max {f.maxSizeCm}cm</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

