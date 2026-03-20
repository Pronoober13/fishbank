import Link from "next/link";

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-ocean-gradient text-white pt-20 pb-32 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-ocean-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ocean-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-sm text-ocean-100">Platform Perikanan #1 Indonesia</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Jelajahi Dunia
            <br />
            <span className="bg-gradient-to-r from-teal-300 to-ocean-300 bg-clip-text text-transparent">
              Perikanan Indonesia
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-10 text-ocean-200 max-w-2xl mx-auto leading-relaxed">
            Ensiklopedia ikan terlengkap dan marketplace terpercaya untuk para pecinta ikan hias di seluruh Nusantara
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/fish" className="group inline-flex items-center justify-center gap-2 bg-white text-ocean-800 px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-ocean-50 transition-all shadow-lg shadow-black/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
              Jelajahi Ensiklopedia
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
            <Link href="/marketplace" className="group inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
              Buka Marketplace
            </Link>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
            <path d="M0 100V60C180 80 360 20 540 30C720 40 900 80 1080 60C1260 40 1350 20 1440 40V100H0Z" fill="#f0f7ff"/>
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="inline-block bg-ocean-100 text-ocean-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">Fitur Utama</span>
          <h2 className="text-3xl md:text-4xl font-bold text-ocean-950">
            Semua yang Anda Butuhkan
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">Dari ensiklopedia hingga marketplace, FishBank menyediakan platform lengkap untuk komunitas perikanan</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: (<svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>),
              title: "Ensiklopedia Ikan",
              desc: "Database lengkap 500+ spesies ikan Indonesia dengan informasi habitat, perawatan, dan status konservasi.",
              color: "from-ocean-500 to-ocean-600",
              bg: "bg-ocean-50",
            },
            {
              icon: (<svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0a2.99 2.99 0 00.621-1.842L4.25 3.5h15.5l.629 4.007A3 3 0 0021 9.349" /></svg>),
              title: "Marketplace Terpercaya",
              desc: "Jual-beli ikan hias dengan sistem transaksi yang aman. Panduan pengiriman ikan hidup tersedia.",
              color: "from-teal-500 to-teal-600",
              bg: "bg-teal-50",
            },
            {
              icon: (<svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>),
              title: "Chat & Komunitas",
              desc: "Komunikasi langsung antara buyer dan seller. Diskusi dan berbagi pengalaman sesama pecinta ikan.",
              color: "from-coral-500 to-coral-600",
              bg: "bg-coral-50",
            },
          ].map((f) => (
            <div key={f.title} className="group bg-white rounded-2xl p-7 border border-slate-100 card-hover cursor-default">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.color} text-white flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-ocean-950 mb-2">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-ocean-gradient opacity-95" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-ocean-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">FishBank dalam Angka</h2>
            <p className="text-ocean-200 mt-2">Pertumbuhan yang terus meningkat setiap harinya</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: "500+", label: "Spesies Ikan", icon: "🐠" },
              { num: "10K+", label: "Pengguna Aktif", icon: "👥" },
              { num: "5K+", label: "Produk Tersedia", icon: "📦" },
              { num: "34", label: "Provinsi", icon: "🗺️" },
            ].map((s) => (
              <div key={s.label} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="text-3xl md:text-4xl font-extrabold text-white">{s.num}</p>
                <p className="text-ocean-200 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-10 md:p-14 shadow-xl shadow-ocean-200/50 border border-ocean-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-ocean-100 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-50 to-transparent rounded-tr-full" />

            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-ocean-950 mb-4">
                Siap Bergabung?
              </h2>
              <p className="text-slate-500 mb-8 max-w-lg mx-auto text-lg">
                Daftar gratis dan mulai jelajahi ensiklopedia ikan terlengkap serta marketplace terpercaya di Indonesia
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-ocean-600 to-teal-500 text-white px-8 py-3.5 rounded-xl text-lg font-semibold hover:from-ocean-500 hover:to-teal-400 transition-all shadow-lg shadow-ocean-500/25">
                  Daftar Gratis
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </Link>
                <Link href="/fish" className="inline-flex items-center justify-center gap-2 bg-ocean-50 text-ocean-700 px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-ocean-100 transition-all">
                  Lihat Ensiklopedia
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
