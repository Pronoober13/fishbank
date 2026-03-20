'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Password tidak cocok');
      return;
    }
    if (form.password.length < 8) {
      setError('Password minimal 8 karakter');
      return;
    }
    setLoading(true);
    try {
      await authApi.register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      });
      router.push('/auth/login?registered=true');
    } catch (err: any) {
      setError(err.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'fullName', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama lengkap Anda', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
    { name: 'phone', label: 'No. Telepon (opsional)', type: 'tel', placeholder: '08xxxxxxxxxx', required: false },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Minimal 8 karakter', required: true },
    { name: 'confirmPassword', label: 'Konfirmasi Password', type: 'password', placeholder: 'Ulangi password', required: true },
  ];

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-ocean-400 to-teal-400 text-2xl shadow-lg shadow-ocean-400/20 mb-4">
              🐟
            </div>
            <h1 className="text-2xl font-bold text-ocean-950">Daftar FishBank</h1>
            <p className="text-slate-400 text-sm mt-1">Buat akun gratis dan mulai jelajahi</p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-3.5 rounded-xl mb-5 text-sm border border-rose-200 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-semibold text-ocean-950 mb-1.5">{f.label}</label>
                <input
                  type={f.type} required={f.required}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-transparent outline-none transition text-sm"
                  placeholder={f.placeholder}
                  value={form[f.name as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                />
              </div>
            ))}
            <button
              type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-ocean-600 to-teal-500 text-white py-3 rounded-xl font-semibold hover:from-ocean-500 hover:to-teal-400 transition-all disabled:opacity-50 shadow-lg shadow-ocean-500/20"
            >
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-ocean-600 font-semibold hover:text-ocean-800 transition">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
