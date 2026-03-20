import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">🐠 FishBank</h1>
          <p className="text-xl mb-2 text-blue-100">Platform Ekosistem Perikanan Indonesia</p>
          <p className="text-lg mb-8 text-blue-200 max-w-2xl mx-auto">
            Ensiklopedia ikan terlengkap &amp; marketplace terpercaya untuk pecinta ikan hias di Indonesia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/fish" className="bg-white text-blue-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition">
              📚 Jelajahi Ensiklopedia
            </Link>
            <Link href="/marketplace" className="bg-blue-500 border-2 border-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-400 transition">
              🛒 Buka Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Fitur Utama</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: "📚", title: "Ensiklopedia Ikan", desc: "Database lengkap spesies ikan Indonesia dengan informasi habitat, perawatan, dan status konservasi." },
            { icon: "🛒", title: "Marketplace", desc: "Jual-beli ikan hias dengan sistem escrow yang aman. Termasuk panduan pengiriman ikan hidup." },
            { icon: "💬", title: "Chat & Komunitas", desc: "Komunikasi langsung antara buyer dan seller. Diskusi dan berbagi pengalaman." },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: "500+", label: "Spesies Ikan" },
            { num: "10K+", label: "Pengguna Aktif" },
            { num: "5K+", label: "Produk Tersedia" },
            { num: "34", label: "Provinsi" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-blue-700">{s.num}</p>
              <p className="text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Mulai Sekarang</h2>
        <p className="text-gray-600 mb-6">Daftar gratis dan jelajahi dunia perikanan Indonesia</p>
        <Link href="/auth/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
          Daftar Sekarang
        </Link>
      </section>
    </div>
  );
}
