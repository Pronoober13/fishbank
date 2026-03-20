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

const habitatLabel: Record<string, string> = { freshwater: 'Air Tawar', marine: 'Laut', brackish: 'Payau' };
const habitatColor: Record<string, string> = { freshwater: 'bg-teal-50 text-teal-700 border-teal-200', marine: 'bg-ocean-50 text-ocean-700 border-ocean-200', brackish: 'bg-sand-100 text-amber-700 border-amber-200' };

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
    beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
    advanced: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  const difficultyLabel: Record<string, string> = { beginner: 'Pemula', intermediate: 'Menengah', advanced: 'Ahli' };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <span className="inline-block bg-ocean-100 text-ocean-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">Ensiklopedia</span>
        <h1 className="text-3xl md:text-4xl font-bold text-ocean-950">Ensiklopedia Ikan</h1>
        <p className="text-slate-500 mt-2">Jelajahi database lengkap spesies ikan Indonesia</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          <input
            type="text" placeholder="Cari nama ikan..."
            className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-transparent outline-none transition text-sm"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-transparent outline-none transition text-sm bg-white" value={habitat} onChange={(e) => setHabitat(e.target.value)}>
          {habitatOptions.map((h) => <option key={h} value={h}>{h === 'ALL' ? 'Semua Habitat' : habitatLabel[h] || h}</option>)}
        </select>
        <select className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-transparent outline-none transition text-sm bg-white" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          {difficultyOptions.map((d) => <option key={d} value={d}>{d === 'ALL' ? 'Semua Level' : difficultyLabel[d] || d}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-3 border-ocean-200 border-t-ocean-600 rounded-full animate-spin mb-4" />
          <p className="text-slate-400">Memuat data ikan...</p>
        </div>
      ) : fish.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🐠</div>
          <p className="text-slate-400 text-lg">Tidak ada ikan ditemukan</p>
          <p className="text-slate-400 text-sm mt-1">Coba ubah filter pencarian</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fish.map((f) => (
            <Link key={f.id} href={`/fish/${f.id}`}
              className="group bg-white rounded-2xl border border-slate-100 overflow-hidden card-hover block">
              {/* Top gradient bar */}
              <div className="h-2 bg-gradient-to-r from-ocean-400 to-teal-400" />
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-ocean-950 group-hover:text-ocean-600 transition truncate">{f.commonName}</h2>
                    <p className="text-sm text-slate-400 italic truncate">{f.scientificName}</p>
                  </div>
                  {f.isProtected && (
                    <span className="ml-2 flex-shrink-0 bg-rose-50 text-rose-600 text-xs px-2.5 py-1 rounded-full border border-rose-200 font-medium">
                      Dilindungi
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">{f.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${habitatColor[f.habitat] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    {habitatLabel[f.habitat] || f.habitat}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${difficultyColor[f.difficultyLevel] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    {difficultyLabel[f.difficultyLevel] || f.difficultyLevel}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-600 font-medium">
                    {f.maxSizeCm} cm
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
