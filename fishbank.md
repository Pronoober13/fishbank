🐠 FISHBANK
Business Requirements Document (BRD)
Document Control
Attribute	Details
Document Title	FishBank - Business Requirements Document
Document ID	FB-BRD-001
Version	1.0
Status	Draft
Date	20 Maret 2026
Author	Product Team - FishBank
Approved By	[Pending]
Next Review	30 Maret 2026
________________________________________
📋 Document Revision History
Version	Date	Author	Changes	Approved By
1.0	20/03/2026	Product Team	Initial Draft	-
				
________________________________________
🔐 Confidentiality Notice
Dokumen ini berisi informasi rahasia dan proprietary dari FishBank. Dilarang mendistribusikan, menyalin, atau mengungkapkan isi dokumen ini kepada pihak ketiga tanpa izin tertulis dari manajemen FishBank.
________________________________________
DAFTAR ISI
1.	Executive Summary
2.	Project Overview
3.	Business Objectives
4.	Scope of Work
5.	Stakeholder Analysis
6.	User Personas
7.	Functional Requirements
8.	Non-Functional Requirements
9.	Business Rules & Constraints
10.	Success Criteria & KPIs
11.	Risk Register
12.	Assumptions & Dependencies
13.	Appendices
________________________________________
1. EXECUTIVE SUMMARY
1.1 Latar Belakang
Indonesia merupakan negara dengan keanekaragaman hayati ikan tertinggi di dunia, terletak di jantung Coral Triangle. Namun, informasi mengenai spesies ikan, persebaran, perilaku, dan lingkungan hidupnya masih tersebar dan tidak terstruktur. Di sisi lain, industri perdagangan ikan (hias dan konsumsi) di Indonesia menghadapi tantangan dalam hal transparansi, kepercayaan, dan kepatuhan regulasi.
FishBank hadir sebagai solusi terintegrasi yang menggabungkan:
•	📚 Ensiklopedia Digital: Database komprehensif ikan Indonesia dengan informasi behavior dan environment
•	🛒 Marketplace Terpercaya: Platform e-commerce untuk jual-beli ikan dengan sistem garansi dan verifikasi
•	🤝 Komunitas & Edukasi: Ruang kolaborasi untuk hobiis, pembudidaya, dan pelaku industri
1.2 Value Proposition
Untuk Pengguna	Untuk Bisnis	Untuk Lingkungan
✅ Informasi ikan akurat & lengkap	✅ Akses pasar lebih luas	✅ Edukasi konservasi
✅ Transaksi aman dengan garansi DOA	✅ Verifikasi seller meningkatkan kepercayaan	✅ Pencegahan perdagangan ilegal
✅ Komunitas untuk berbagi pengetahuan	✅ Tools manajemen stok & pesanan	✅ Data untuk riset & kebijakan
1.3 Target Pengguna
🎯 Primary Users:
├─ Hobiis ikan hias (pemula hingga kolektor)
├─ Pembudidaya ikan (skala rumah tangga hingga komersial)
├─ Pedagang ikan & perlengkapan akuarium
├─ Restoran & bisnis kuliner berbasis ikan

🎯 Secondary Users:
├─ Peneliti & akademisi bidang perikanan
├─ Exportir ikan hias Indonesia
├─ Pemerintah & lembaga konservasi
├─ Masyarakat umum yang tertarik edukasi ikan
________________________________________
2. PROJECT OVERVIEW
2.1 Project Vision
"Menjadi platform ekosistem perikanan terlengkap dan terpercaya di Indonesia yang menghubungkan edukasi, konservasi, dan ekonomi berkelanjutan."
2.2 Project Mission
1.	Menyediakan database ikan Indonesia yang akurat, terupdate, dan mudah diakses
2.	Memfasilitasi transaksi jual-beli ikan yang aman, transparan, dan sesuai regulasi
3.	Mengedukasi masyarakat tentang keanekaragaman hayati dan konservasi ikan
4.	Memberdayakan pelaku industri perikanan lokal melalui teknologi digital
2.3 Project Goals (SMART)
Goal	Specific	Measurable	Achievable	Relevant	Time-bound
G1	Launch MVP FishBank dengan 100 spesies ikan & 50 seller terverifikasi	100 spesies, 50 seller, 1.000 user aktif	✅ Dengan tim 6 orang & budget 6 bulan	✅ Fondasi ekosistem	Q3 2026
G2	Mencapai 10.000 transaksi dengan tingkat kepuasan >4.5/5	10.000 transaksi, rating ≥4.5	✅ Dengan fitur garansi & escrow	✅ Trust & growth	Q1 2027
G3	Menjadi referensi utama database ikan Indonesia	1.000 spesies, 50.000 user, partnership BRIN	✅ Dengan crowdsourcing & API integration	✅ Authority & impact	Q4 2027
2.4 Success Definition
Project dianggap sukses jika dalam 12 bulan pertama:
•	Minimal 50.000 user terdaftar, 30% aktif bulanan
•	2.500 seller terverifikasi dengan rating rata-rata ≥4.5
•	GMV mencapai Rp 5 Miliar dengan tingkat komplain <2%
•	Database ikan mencapai 1.000 spesies dengan akurasi ≥95%
•	Zero incident perdagangan spesies dilindungi
________________________________________
3. BUSINESS OBJECTIVES
3.1 Strategic Objectives
┌─────────────────────────────────────────────────────────────┐
│                    FISHBANK OBJECTIVES TREE                  │
└─────────────────────────────────────────────────────────────┘

                          ┌─────────────────┐
                          │   VISI UTAMA    │
                          │ FishBank Ecosystem│
                          └────────┬────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        ▼                          ▼                          ▼
┌───────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   EDUKASI     │    │    EKONOMI      │    │  KONSERVASI    │
│               │    │                 │    │                │
│• Database ikan│    │• Marketplace    │    │• Filter CITES  │
│  terstruktur  │    │  terintegrasi   │    │• Edukasi legal │
│• Info behavior│    │• Payment aman   │    │• Laporan illegal│
│• Peta sebaran │    │• Logistik khusus│    │• Partnership NGO│
│• Tips perawatan│   │• B2B & B2C      │    │• Data untuk riset│
└───────┬───────┘    └────────┬────────┘    └───────┬─────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
              ┌─────────────────────────────┐
              │   OUTCOME: Sustainable      │
              │   Blue Economy Indonesia    │
              └─────────────────────────────┘
3.2 Tactical Objectives (Per Phase)
Phase 1: MVP (Bulan 1-3)
Objective	Key Result	Owner
O1.1: Launch platform dasar	App Web + Mobile live, 100 spesies ikan terinput	Product Lead
O1.2: Onboard early adopters	50 seller terverifikasi, 1.000 user terdaftar	Growth Lead
O1.3: Validasi model transaksi	100 transaksi sukses, CSAT ≥4.0	Ops Lead
O1.4: Pastikan compliance dasar	Sistem filter spesies dilindungi aktif	Legal Lead
Phase 2: Growth (Bulan 4-6)
Objective	Key Result	Owner
O2.1: Skala pengguna	10.000 user, 30% MAU	Growth Lead
O2.2: Tingkatkan kepercayaan	Sistem escrow & garansi DOA live, rating ≥4.5	Product Lead
O2.3: Ekspansi kategori	Tambah ikan laut & payau, total 300 spesies	Content Lead
O2.4: Optimasi konversi	Conversion rate ≥3%, AOV meningkat 20%	Data Lead
Phase 3: Scale (Bulan 7-12)
Objective	Key Result	Owner
O3.1: Dominasi pasar	50.000 user, 2.500 seller, GMV Rp 5M	CEO
O3.2: Fitur premium	AI identification, live auction, loyalty program	Product Lead
O3.3: Partnership strategis	Kolaborasi dengan DIHI, BRIN, KKP	BD Lead
O3.4: Persiapan ekspansi	Multi-language, fitur ekspor, API publik	CTO
________________________________________
4. SCOPE OF WORK
4.1 In-Scope (MVP)
✅ Fitur Utama
📚 ENSIKLOPEDIA
├─ Database 100 spesies ikan populer Indonesia
├─ Informasi: nama ilmiah, habitat, behavior, environment
├─ Peta persebaran berbasis wilayah provinsi
├─ Status konservasi (IUCN) & label "Dilindungi"
├─ Pencarian & filter: nama, habitat, ukuran, daerah

🛒 MARKETPLACE DASAR
├─ Listing produk: ikan hias air tawar (prioritas)
├─ Detail produk: foto, deskripsi, harga, stok, lokasi seller
├─ Chat langsung antara buyer-seller
├─ Sistem rating & review sederhana
├─ Filter produk: harga, lokasi, rating seller

👤 USER MANAGEMENT
├─ Registrasi & login (email, phone, social)
├─ Profil user: buyer/seller switch
├─ Verifikasi seller dasar (KTP + foto kolam)
├─ Dashboard: wishlist, chat, order history

🔧 ADMIN & MODERATION
├─ Dashboard admin: manage user, product, report
├─ Approval flow untuk seller & produk baru
├─ Sistem report & takedown untuk konten ilegal
├─ Basic analytics: user growth, transaction volume
✅ Platform & Integrasi
📱 Aplikasi
├─ Mobile: Flutter (iOS & Android)
├─ Web: Next.js (responsive, SEO-friendly)

🔌 Integrasi Eksternal
├─ Payment: Midtrans (sandbox untuk MVP)
├─ Maps: Mapbox GL JS / Google Maps SDK
├─ Storage: AWS S3 untuk media upload
├─ Notification: Firebase Cloud Messaging

🗄️ Infrastruktur
├─ Backend: Node.js + NestJS (REST API)
├─ Database: PostgreSQL + PostGIS
├─ Cache: Redis untuk session & hot data
├─ Deployment: Docker + VPS cloud (AWS/GCP)
4.2 Out-of-Scope (MVP)
❌ Tidak Termasuk Phase 1
🚫 Fitur Marketplace Lanjutan
├─ Payment gateway live production
├─ Sistem escrow / rekening bersama
├─ Garansi DOA otomatis dengan refund
├─ Integrasi kurir spesialis hewan hidup
├─ Fitur lelang / auction

🚫 Fitur Advanced
├─ AI image recognition untuk identifikasi ikan
├─ Live streaming untuk showcase ikan
├─ Fitur B2B wholesale & bulk order
├─ Dokumen ekspor & integrasi karantina
├─ Multi-language & multi-currency

🚫 Kategori Produk
├─ Ikan konsumsi (bandeng, nila, lele)
├─ Ikan laut & payau (phase 2)
├─ Perlengkapan & jasa (phase 2)
├─ Produk digital / konten premium

🚫 Infrastruktur Enterprise
├─ Kubernetes orchestration
├─ Multi-region deployment
├─ Advanced monitoring & APM
├─ Disaster recovery automation
4.3 Scope Boundary Diagram
┌─────────────────────────────────────────────────────────────┐
│                    FISHBANK SYSTEM BOUNDARY                  │
└─────────────────────────────────────────────────────────────┘

                    ┌─────────────────────┐
                    │   FISHBANK PLATFORM │
                    │   (IN-SCOPE)        │
                    └────────┬────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   USER APPS   │  │   BACKEND     │  │   EXTERNAL    │
│               │  │   SERVICES    │  │   SERVICES    │
│ • Mobile App  │  │ • API Gateway │  │ • Payment GW  │
│ • Web Portal  │  │ • Auth Service│  │ • Maps API    │
│ • Admin Panel │  │ • Product Svc │  │ • Cloud Storage│
└───────┬───────┘  │ • Order Svc   │  │ • Notification│
        │          │ • Search Svc  │  └───────┬───────┘
        │          └───────┬───────┘          │
        │                  │                  │
        │          ┌──────▼───────┐          │
        │          │   DATABASE   │          │
        │          │ • PostgreSQL │          │
        │          │ • Redis      │          │
        │          │ • PostGIS    │          │
        │          └──────────────┘          │
        │                                    │
        └────────────────────────────────────┘
                             │
              ┌──────────────▼──────────────┐
              │   OUT OF SCOPE / FUTURE     │
              │                             │
              │ • IoT Aquarium Devices      │
              │ • Export Documentation Sys  │
              │ • AI/ML Training Pipeline   │
              │ • Blockchain for Traceability│
              │ • AR/VR Fish Showcase       │
              └─────────────────────────────┘
________________________________________
5. STAKEHOLDER ANALYSIS
5.1 Stakeholder Matrix
Stakeholder	Role	Interest	Influence	Engagement Strategy
Founder/CEO	Sponsor	High	High	Weekly steering committee, monthly report
Product Manager	Owner	High	High	Daily standup, sprint planning, backlog grooming
Development Team	Builder	High	Medium	Agile ceremonies, tech reviews, documentation
Early Adopter Sellers	User/Partner	High	Medium	Beta program, feedback loop, incentive scheme
Hobiis/Buyers	End User	High	Low	UX testing, survey, community engagement
DIHI/Asosiasi	Strategic Partner	Medium	High	MoU discussion, co-branding, data sharing
BRIN/KKP	Regulator/Advisor	Medium	High	Compliance review, data validation, policy alignment
Payment Gateway	Vendor	Medium	Medium	SLA agreement, integration testing, support channel
Legal Consultant	Advisor	Medium	Medium	Contract review, compliance audit, risk assessment
Investor	Funder	Medium	High	Quarterly business review, KPI dashboard, roadmap update
5.2 RACI Matrix (Key Deliverables)
Deliverable	Responsible	Accountable	Consulted	Informed
BRD Document	Product Manager	CEO	Legal, Tech Lead	All Stakeholders
UI/UX Design	UI/UX Designer	Product Manager	Dev Team, User Research	CEO, Marketing
API Specification	Backend Lead	CTO	Frontend, QA, Security	Product, DevOps
Database Schema	Database Engineer	CTO	Backend, Product	DevOps, QA
MVP Development	Dev Team	CTO	Product, QA	CEO, Stakeholders
Seller Onboarding	Ops Lead	COO	Legal, Product	Seller, Marketing
Compliance Check	Legal Lead	CEO	Product, Ops	All Teams
Go-to-Market Plan	Marketing Lead	CEO	Product, Sales	All Stakeholders
Post-Launch Review	Product Manager	CEO	All Leads	Board, Investor
________________________________________
6. USER PERSONAS
6.1 Persona 1: Budi - Hobiis Pemula
┌─────────────────────────────────────────────────────────────┐
│  👤 BUDI SANTOSO                                              │
│  🎯 Segment: Hobiis Ikan Hias Pemula                          │
├─────────────────────────────────────────────────────────────┤
│  📊 Demografi                                                │
│  ├─ Usia: 28 tahun                                           │
│  ├─ Lokasi: Jakarta Selatan                                  │
│  ├─ Pekerjaan: Staff Marketing                               │
│  └─ Pendapatan: Rp 8-12 juta/bulan                           │
│                                                              │
│  🎣 Latar Belakang                                           │
│  ├─ Baru tertarik ikan hias 6 bulan terakhir                 │
│  ├─ Punya 1 akuarium 60L di rumah                            │
│  ├─ Sering bingung memilih ikan yang cocok                  │
│  └─ Pernah beli ikan online, 2 dari 5 mati di jalan          │
│                                                              │
│  💭 Goals & Motivasi                                         │
│  ├─ Ingin akuarium indah yang mudah dirawat                  │
│  ├─ Butuh info: ikan apa yang cocok dengan kondisi rumah     │
│  ├─ Ingin beli ikan dari seller terpercaya                   │
│  └─ Ingin belajar dari komunitas hobiis lain                 │
│                                                              │
│  😤 Pain Points                                              │
│  ├─ Informasi ikan tersebar di Google, YouTube, forum        │
│  ├─ Sulit verifikasi kualitas ikan sebelum beli online       │
│  ├─ Takut beli ikan dilindungi tanpa sadar                   │
│  └─ Tidak ada garansi jika ikan mati saat pengiriman         │
│                                                              │
│  📱 Tech Behavior                                            │
│  ├─ Aktif di Instagram & TikTok                              │
│  ├─ Terbiasa belanja di Shopee/Tokopedia                     │
│  ├─ Menggunakan GoPay/OVO untuk transaksi                    │
│  └─ Suka konten visual (foto/video)                          │
│                                                              │
│  ✅ FishBank Solutions for Budi                              │
│  ├─ 🎓 "Panduan Pemula": rekomendasi ikan berdasarkan        │
│  │   budget, ruang, dan pengalaman                           │
│  ├─ 🔍 Filter "Ramah Pemula" pada produk                     │
│  ├─ 🛡️ Badge "Verified Seller" & "Garansi DOA"              │
│  ├─ 💬 Chat langsung dengan seller untuk tanya kondisi ikan  │
│  └─ 📚 Artikel & video tips perawatan dalam aplikasi         │
└─────────────────────────────────────────────────────────────┘
6.2 Persona 2: Sari - Breeder Profesional
┌─────────────────────────────────────────────────────────────┐
│  👤 SARI DEWI                                                 │
│  🎯 Segment: Pembudidaya Ikan Hias (Seller)                   │
├─────────────────────────────────────────────────────────────┤
│  📊 Demografi                                                │
│  ├─ Usia: 35 tahun                                           │
│  ├─ Lokasi: Yogyakarta                                       │
│  ├─ Pekerjaan: Full-time Breeder Cupang & Channa            │
│  └─ Omzet: Rp 30-50 juta/bulan                               │
│                                                              │
│  🎣 Latar Belakang                                           │
│  ├─ 8 tahun pengalaman breeding ikan hias                    │
│  ├─ Punya 20 kolam terkontrol di halaman rumah               │
│  ├─ Jual via Instagram, WhatsApp, & marketplace umum         │
│  └─ Sering kendala: admin ribet, komplain pengiriman, scam   │
│                                                              │
│  💭 Goals & Motivasi                                         │
│  ├─ Ingin fokus breeding, tidak habis waktu untuk admin      │
│  ├─ Ingin jangkauan pasar lebih luas (nasional)              │
│  ├─ Ingin sistem pembayaran yang aman & terstruktur          │
│  └─ Ingin branding sebagai breeder terpercaya                │
│                                                              │
│  😤 Pain Points                                              │
│  ├─ Harus jawab chat yang sama berulang di banyak platform   │
│  ├─ Pembeli sering menawar tidak wajar atau ghosting         │
│  ├─ Risiko penipuan: transfer palsu, claim DOA fiktif        │
│  └─ Sulit bedakan buyer serius vs iseng                      │
│                                                              │
│  📱 Tech Behavior                                            │
│  ├─ Aktif di Facebook Group & WhatsApp Business              │
│  ├─ Terbiasa pakai Google Sheets untuk stok & order          │
│  ├─ Mulai gunakan Canva untuk konten promosi                 │
│  └─ Tertentu tools yang menghemat waktu                      │
│                                                              │
│  ✅ FishBank Solutions for Sari                              │
│  ├─ 📦 Dashboard seller: kelola stok, order, chat dalam 1 tempat │
│  ├─ 🏆 Program "Verified Breeder": badge & exposure khusus   │
│  ├─ 💰 Escrow system: uang aman sampai buyer konfirmasi      │
│  ├─ 📊 Analytics: insight produk terlaris, peak season       │
│  └─ 🤝 Komunitas seller: sharing tips, bulk shipping discount│
└─────────────────────────────────────────────────────────────┘
6.3 Persona 3: Pak Hendra - Restoran Seafood
┌─────────────────────────────────────────────────────────────┐
│  👤 HENDRA WIJAYA                                             │
│  🎯 Segment: Bisnis Kuliner (B2B Buyer)                       │
├─────────────────────────────────────────────────────────────┤
│  📊 Demografi                                                │
│  ├─ Usia: 45 tahun                                           │
│  ├─ Lokasi: Surabaya                                         │
│  ├─ Pekerjaan: Owner "Seafood Nusantara" (3 cabang)         │
│  └─ Kebutuhan: 200-500 kg ikan segar/minggu                  │
│                                                              │
│  🎣 Latar Belakang                                           │
│  ├─ 15 tahun bisnis restoran seafood                         │
│  ├─ Saat ini beli dari pasar induk & supplier lokal          │
│  ├─ Sering kendala: stok tidak konsisten, kualitas bervariasi│
│  └─ Ingin efisiensi procurement tanpa kompromi kualitas      │
│                                                              │
│  💭 Goals & Motivasi                                         │
│  ├─ Pasokan ikan segar konsisten dengan kualitas terjamin    │
│  ├─ Harga kompetitif dengan transparansi                     │
│  ├─ Kemudahan pemesanan & tracking pengiriman                │
│  └─ Dokumentasi lengkap untuk audit & sertifikasi halal      │
│                                                              │
│  😤 Pain Points                                              │
│  ├─ Harus nego harga setiap kali order                       │
│  ├─ Tidak ada jaminan kualitas sebelum barang tiba           │
│  ├─ Sulit lacak asal-usul ikan (traceability)                │
│  └─ Administrasi pembelian manual, rawan error               │
│                                                              │
│  📱 Tech Behavior                                            │
│  ├─ Menggunakan WhatsApp untuk koordinasi dengan supplier    │
│  ├─ Terbiasa dengan aplikasi POS & inventory restoran        │
│  ├─ Tertentu sistem yang terintegrasi dengan operasional     │
│  └─ Lebih suka komunikasi telepon untuk deal besar           │
│                                                              │
│  ✅ FishBank Solutions for Pak Hendra                        │
│  ├─ 🏢 Portal B2B: harga grosir, minimum order, kontrak      │
│  ├─ 📋 Purchase Order digital dengan approval workflow       │
│  ├─ 🚚 Integrasi logistik dingin & tracking real-time        │
│  ├─ 📄 Digital certificate: kesehatan ikan, asal tangkap     │
│  └─ 📈 Forecasting tool: prediksi stok berdasarkan historis  │
└─────────────────────────────────────────────────────────────┘
________________________________________
7. FUNCTIONAL REQUIREMENTS
7.1 Requirement Prioritization (MoSCoW)
ID	Requirement	MoSCoW	Phase	Epic
FR-001	User dapat registrasi & login dengan email/phone	Must	1	Auth
FR-002	User dapat switch role: buyer ↔ seller	Must	1	User Mgmt
FR-003	Seller dapat verifikasi identitas dasar (KTP + foto)	Must	1	Seller Onboarding
FR-004	Sistem dapat menampilkan 100 spesies ikan dengan detail lengkap	Must	1	Encyclopedia
FR-005	User dapat mencari ikan berdasarkan nama, habitat, atau wilayah	Must	1	Search
FR-006	Sistem menampilkan label "Dilindungi" untuk spesies CITES	Must	1	Compliance
FR-007	Seller dapat membuat listing produk ikan (foto, deskripsi, harga)	Must	1	Product Mgmt
FR-008	Buyer dapat melihat detail produk & kontak seller via chat	Must	1	Marketplace
FR-009	Sistem dapat mencatat transaksi & history order	Must	1	Order Mgmt
FR-010	User dapat memberikan rating & review setelah transaksi	Should	1	Trust System
FR-011	Admin dapat approve/reject seller & produk baru	Must	1	Moderation
FR-012	Sistem dapat memblokir listing spesies dilindungi secara otomatis	Must	1	Compliance
FR-013	Integrasi payment gateway (sandbox) untuk simulasi transaksi	Should	1	Payment
FR-014	User dapat menyimpan ikan/produk favorit (wishlist)	Could	1	Engagement
FR-015	Sistem mengirim notifikasi untuk status order & chat baru	Should	1	Notification
FR-016	Dashboard admin dengan basic analytics (user, product, order)	Should	1	Admin
FR-017	Fitur "Laporkan Konten" untuk user report produk/user ilegal	Must	1	Safety
FR-018	Export data user & transaksi untuk compliance audit	Could	1	Compliance
FR-019	Multi-language support (ID & EN)	Won't	2	Localization
FR-020	AI image recognition untuk identifikasi ikan dari foto	Won't	3	AI Feature
7.2 Detailed Functional Specifications
FR-004: Display Fish Encyclopedia
Requirement: Sistem dapat menampilkan 100 spesies ikan dengan detail lengkap

Acceptance Criteria:
  - [ ] Halaman detail ikan menampilkan:
    * Nama umum (ID) & nama ilmiah
    * Foto utama + gallery (min. 3 foto)
    * Habitat: freshwater/marine/brackish
    * Distribusi: daftar provinsi + peta interaktif
    * Environment: suhu, pH, ukuran tank minimal
    * Behavior: pola makan, agresivitas, tips perawatan
    * Status konservasi: IUCN status + label "Dilindungi" jika applicable
    * Link ke produk terkait (jika ada)
  
  - [ ] Data dapat di-update oleh admin via CMS
  - [ ] Loading halaman < 3 detik pada koneksi 4G
  - [ ] Konten responsif untuk mobile & web

Technical Notes:
  - Source data: FishBase API + manual curation oleh content team
  - Image optimization: WebP format, lazy loading
  - Caching: Redis cache untuk query fish detail (TTL 24 jam)
FR-007: Seller Product Listing
Requirement: Seller dapat membuat listing produk ikan

Acceptance Criteria:
  - [ ] Form listing mencakup:
    * Pilih spesies ikan (autocomplete dari database)
    * Judul produk (max 100 karakter)
    * Deskripsi (rich text, max 1000 karakter)
    * Harga (IDR) & satuan (pcs/kg/pair)
    * Ukuran/umur ikan (dropdown + custom input)
    * Stok tersedia
    * Upload foto (min. 3, max 10, max 5MB/file)
    * Upload video opsional (max 30 detik, 50MB)
    * Lokasi pengambilan/pickup
    * Metode pengiriman yang tersedia
  
  - [ ] Validasi real-time:
    * Foto wajib min. 3 dengan kualitas jelas
    * Harga harus > 0 dan format angka valid
    * Spesies dilindungi tidak dapat dipilih (auto-block)
  
  - [ ] Setelah submit:
    * Status produk: "Pending Review"
    * Notifikasi ke admin untuk approval
    * Seller dapat edit listing selama status pending
  
  - [ ] Setelah approved:
    * Produk muncul di marketplace
    * Seller dapat manage: edit, pause, delete

Technical Notes:
  - Image processing: resize, compress, watermark opsional
  - Moderation: auto-scan image untuk konten tidak pantas
  - Rate limit: max 10 listing baru/hari per seller (anti-spam)
FR-012: Auto-block Protected Species
Requirement: Sistem memblokir listing spesies dilindungi secara otomatis

Acceptance Criteria:
  - [ ] Database fish_species memiliki field:
    * is_protected: boolean
    * cites_appendix: enum(I, II, III, null)
    * protection_note: text (regulasi terkait)
  
  - [ ] Saat seller membuat listing:
    * Jika fish_species.is_protected = true:
      - Tampilkan warning modal: "Ikan ini dilindungi UU No. 31/2004"
      - Tombol "Lanjut" disabled
      - Tampilkan alternatif: ikan serupa yang tidak dilindungi
  
  - [ ] Admin dapat override (dengan justifikasi) untuk:
    * Penjualan dengan izin khusus (upload dokumen)
    * Edukasi/konservasi (non-komersial)
  
  - [ ] Audit log: setiap attempt listing spesies dilindungi dicatat

Technical Notes:
  - Sync data konservasi: cron job harian dari IUCN/BRIN API
  - Cache: in-memory cache untuk quick lookup protected species
  - Fallback: jika API down, gunakan local snapshot terakhir
________________________________________
8. NON-FUNCTIONAL REQUIREMENTS
8.1 Performance Requirements
Metric	Target	Measurement Method
Response Time		
├─ API endpoint (p95)	< 500 ms	Prometheus + Grafana
├─ Page load (mobile, 4G)	< 3 detik	Lighthouse CI
├─ Search autocomplete	< 200 ms	Custom logging
Throughput		
├─ Concurrent users (MVP)	500	Load testing (k6)
├─ API requests/second	100	Monitoring dashboard
Scalability		
├─ Horizontal scaling	Auto-scale based on CPU >70%	Kubernetes HPA
├─ Database read replica	1 replica untuk MVP	PostgreSQL config
8.2 Reliability & Availability
Requirement	Target	Strategy
Uptime	99.5% (MVP)	Multi-AZ deployment, health checks
Data Durability	99.999999999%	AWS S3 versioning + cross-region backup
Recovery Time (RTO)	< 1 jam	Automated backup + restore runbook
Recovery Point (RPO)	< 15 menit	Point-in-time recovery PostgreSQL
Error Rate	< 0.1% of requests	Circuit breaker, retry logic, monitoring
8.3 Security Requirements
Authentication & Authorization:
  - JWT dengan refresh token (expiry: access 15m, refresh 7d)
  - Password hashing: bcrypt dengan cost factor ≥ 12
  - Role-based access control (RBAC): buyer, seller, admin, moderator
  - Session management: logout semua device, device fingerprinting

Data Protection:
  - Enkripsi data sensitif di database: AES-256 (PII, payment info)
  - TLS 1.3 untuk semua komunikasi eksternal
  - Masking data pribadi di log & analytics
  - Right to delete: user dapat request hapus akun & data (UU PDP)

Application Security:
  - Input validation: whitelist + schema validation (Zod/Joi)
  - Output encoding: prevent XSS pada semua user-generated content
  - Rate limiting: 100 req/menit per IP untuk public API
  - Security headers: CSP, HSTS, X-Frame-Options

Compliance:
  - Audit log: semua aksi admin & perubahan data kritis
  - Data residency: semua data user Indonesia disimpan di region Asia
  - Third-party assessment: penetration test sebelum production launch
8.4 Usability & Accessibility
Requirement	Standard	Implementation
Mobile-First	Responsive design	Flutter adaptive layout, Next.js responsive
Loading States	Skeleton screen	Placeholder UI saat fetch data
Error Handling	User-friendly messages	Bahasa Indonesia, actionable next steps
Accessibility	WCAG 2.1 AA	Semantic HTML, ARIA labels, contrast ratio ≥ 4.5:1
Offline Support	Basic caching	Service worker untuk halaman encyclopedia (PWA)
Localization	Bahasa Indonesia (prioritas)	i18n framework, string externalization
8.5 Maintainability & Extensibility
Code Quality:
  - Static analysis: ESLint + Prettier (frontend), ESLint + TypeScript (backend)
  - Test coverage: ≥ 80% untuk critical paths (Jest + Supertest)
  - Documentation: OpenAPI 3.0 spec untuk semua endpoint
  - Code review: minimal 1 approver untuk semua PR

Architecture:
  - Modular monolith (MVP) → microservices ready
  - Database migration: versioned scripts (Flyway)
  - Feature flags: untuk rollout bertahap (Unleash)
  - Configuration: environment-based, no hardcoded secrets

Observability:
  - Logging: structured JSON log dengan correlation ID
  - Metrics: business KPI + technical metrics (Prometheus)
  - Tracing: distributed tracing untuk critical flows (Jaeger)
  - Alerting: Slack/PagerDuty integration untuk critical errors________________________________________
9. BUSINESS RULES & CONSTRAINTS
9.1 Business Rules
BR-001: Spesies Dilindungi
IF fish_species.is_protected = true 
AND fish_species.cites_appendix IS NOT NULL
THEN:
  - Listing produk TIDAK DIPERBOLEHKAN untuk tujuan komersial
  - Tampilkan pesan: "Ikan ini dilindungi oleh UU No. 31/2004 tentang Perikanan. 
    Perdagangan memerlukan izin khusus dari Kementerian Kelautan dan Perikanan."
  - Berikan opsi: "Lihat ikan serupa yang dapat diperdagangkan"
BR-002: Verifikasi Seller
SELLER dapat listing produk JIKA DAN HANYA JIKA:
  - status_verifikasi = "approved"
  - dokumen_lengkap = true (KTP + foto lokasi breeding)
  - rating_rata_rata ≥ 3.0 (setelah 5 transaksi pertama)
  - tidak dalam masa suspend/banned
BR-003: Garansi DOA (Dead on Arrival) - Phase 2
BUYER dapat klaim garansi DOA JIKA:
  - Produk memiliki badge "Garansi DOA"
  - Klaim diajukan dalam 24 jam setelah status "Delivered"
  - Dilengkapi bukti: video unboxing + foto kondisi ikan
  - Tidak ada indikasi kesalahan penanganan oleh buyer

PROSES:
  1. Buyer submit klaim → status order: "Under Review"
  2. Admin verifikasi bukti (max 48 jam)
  3. Jika valid: 
     - Refund 100% ke buyer
     - Seller dapat appeal dengan bukti tambahan
  4. Jika tidak valid: 
     - Klaim ditolak, status order: "Completed"
     - Buyer dapat escalate ke dispute resolution
BR-004: Komisi & Fee
TRANSACTION FEE STRUCTURE (MVP):
  - Seller baru (bulan 1-3): 0% komisi (promosi)
  - Seller regular: 5% dari nilai transaksi
  - Seller premium (verified + rating ≥4.8): 3% dari nilai transaksi
  - Payment gateway fee: dibebankan ke buyer (ditampilkan saat checkout)

PAYOUT SCHEDULE:
  - Dana ditahan di escrow hingga buyer konfirmasi "Barang Diterima"
  - Jika tidak ada komplain dalam 3x24 jam: auto-release ke seller
  - Penarikan dana: min. Rp 50.000, proses 1-3 hari kerja9.2 Technical Constraints
Constraint	Impact	Mitigation
Budget MVP	Max Rp 500 juta untuk 6 bulan pertama	Prioritase fitur Must-have, gunakan open-source, cloud cost optimization
Timeline	MVP launch dalam 3 bulan	Agile sprint 2 minggu, MVP scope ketat, parallel development
Team Size	Max 8 orang full-time	Hire generalist, gunakan freelance untuk spesialis (UI/UX, legal)
Regulatory Uncertainty	Aturan perdagangan ikan online masih berkembang	Konsultasi legal sejak awal, desain sistem flexible untuk compliance update
Internet Quality	Koneksi tidak stabil di beberapa daerah Indonesia	Optimasi untuk low-bandwidth: lazy loading, image compression, offline cache
9.3 Legal & Compliance Constraints
Regulatory Framework:
  - UU No. 31/2004 jo. UU No. 45/2009 tentang Perikanan
  - Peraturan Menteri KP No. 59/2020 tentang Ikan Hias
  - UU No. 27/2022 tentang Pelindungan Data Pribadi (UU PDP)
  - Peraturan Kominfo No. 5/2020 tentang PSE (Penyelenggara Sistem Elektronik)

Mandatory Requirements:
  - [ ] Registrasi PSE Lingkup Privat di Kominfo
  - [ ] Kebijakan Privasi & Syarat Ketentuan dalam Bahasa Indonesia
  - [ ] Mekanisme pengaduan user (minimal email + form)
  - [ ] Penyimpanan data user di wilayah Indonesia (data residency)
  - [ ] Laporan berkala ke KKP untuk transaksi spesies tertentu

Prohibited Activities:
  - ❌ Perdagangan spesies Appendix I CITES tanpa izin khusus
  - ❌ Iklan/promosi yang menyesatkan tentang status konservasi
  - ❌ Pengumpulan data pribadi melebihi keperluan transaksi
  - ❌ Transfer data user ke pihak ketiga tanpa consent eksplisit________________________________________
10. SUCCESS CRITERIA & KPIs
10.1 Business KPIs
KPI	Definition	Target (MVP)	Target (12 Bulan)	Measurement
User Growth				
├─ Registered Users	Total akun terverifikasi	1.000	50.000	Database count
├─ MAU (Monthly Active Users)	User dengan ≥1 session/bulan	300 (30%)	15.000 (30%)	Analytics event
├─ User Retention (D30)	% user aktif di hari ke-30	25%	40%	Cohort analysis
Marketplace Health				
├─ Active Sellers	Seller dengan ≥1 listing aktif	50	2.500	Seller dashboard
├─ Product Listings	Total produk aktif	500	25.000	Product DB count
├─ Conversion Rate	% visitor → transaksi	1.5%	3.5%	Funnel analytics
├─ Average Order Value (AOV)	Rata-rata nilai transaksi	Rp 250.000	Rp 400.000	Order analytics
├─ GMV (Gross Merchandise Value)	Total nilai transaksi	Rp 125 juta	Rp 5 Miliar	Payment report
Trust & Quality				
├─ Seller Rating (avg)	Rata-rata rating seller	≥4.0	≥4.5	Review system
├─ DOA Claim Rate	% order dengan klaim DOA	<5%	<2%	Order dispute log
├─ Dispute Resolution Time	Rata-rata waktu selesaikan komplain	<72 jam	<24 jam	Support ticketing
Content & Engagement				
├─ Fish Database Entries	Spesies dengan konten lengkap	100	1.000	CMS dashboard
├─ Content Accuracy Score	% data divalidasi oleh expert	≥90%	≥95%	Quality audit
├─ Community Posts	Post/user-generated content	100	5.000	Forum analytics
10.2 Technical KPIs
KPI	Target	Tool	Alert Threshold
API Uptime	≥99.5%	Prometheus	<99% dalam 1 jam
P95 Response Time	<500 ms	Grafana	>1000 ms selama 15 menit
Error Rate (5xx)	<0.1%	ELK Stack	>0.5% dalam 5 menit
Database CPU	<70% average	CloudWatch	>90% selama 10 menit
Failed Login Attempts	<10/user/hari	Auth logs	>50/user/hari (brute force)
Backup Success Rate	100%	Backup monitoring	1 failure = critical alert
10.3 Definition of Done (DoD) - MVP Launch
✅ PRODUCT
  - [ ] Semua fitur "Must-have" (MoSCoW) telah diimplementasi & tested
  - [ ] UI/UX sesuai design system, responsif mobile & web
  - [ ] Konten encyclopedia: 100 spesies lengkap dengan validasi expert

✅ TECHNICAL
  - [ ] Code coverage ≥80% untuk critical paths
  - [ ] Security audit: zero critical/high vulnerability
  - [ ] Load test: handle 500 concurrent users dengan response <1s
  - [ ] Monitoring & alerting terpasang untuk semua critical services

✅ COMPLIANCE
  - [ ] Registrasi PSE Kominfo telah diajukan
  - [ ] Kebijakan Privasi & Terms of Service disetujui legal
  - [ ] Sistem filter spesies dilindungi telah diuji end-to-end
  - [ ] Data user disimpan di region Asia (compliance UU PDP)

✅ OPERATIONAL
  - [ ] Runbook untuk deploy, rollback, dan incident response
  - [ ] Tim support siap (minimal 2 orang) dengan SLA response <4 jam
  - [ ] 50 seller founding telah onboarded & trained
  - [ ] Customer feedback channel aktif (in-app + email)

✅ BUSINESS
  - [ ] Payment gateway sandbox terintegrasi & tested
  - [ ] Escrow logic untuk transaksi simulasi berfungsi
  - [ ] Dashboard analytics untuk tracking KPI utama tersedia
  - [ ] Go-to-market plan disetujui & siap eksekusi________________________________________
11. RISK REGISTER
11.1 Risk Assessment Matrix
Risk ID	Risk Description	Category	Impact (1-5)	Probability (1-5)	Risk Score	Owner	Mitigation Strategy	Contingency Plan
RISK-001	Ikan mati saat pengiriman (DOA) tinggi	Operational	5	4	20	Ops Lead	- Edukasi packing standar SNI
- Partner dengan kurir spesialis
- Garansi DOA dengan verifikasi video	- Dana cadangan untuk refund
- Review & suspend seller dengan DOA rate tinggi
RISK-002	Perdagangan spesies dilindungi ilegal	Compliance	5	3	15	Legal Lead	- Auto-block CITES species di sistem
- Moderasi manual untuk listing baru
- Audit berkala oleh tim compliance	- Takedown instan + suspend akun
- Laporan ke pihak berwajib jika diperlukan
- Public statement transparan
RISK-003	Penipuan transaksi (fake payment, scam seller)	Security	4	3	12	CTO	- Escrow system (uang ditahan hingga konfirmasi)
- Verifikasi seller bertahap
- Rate limit & fraud detection	- Freeze akun & dana terkait
- Tim dispute resolution 24/7
- Asuransi fraud untuk user
RISK-004	Adopsi seller rendah di awal	Business	4	4	16	Growth Lead	- Program "Founding Seller": 0% komisi 3 bulan
- Onboarding assistance (video call)
- Insentif referral seller	- Ekspansi ke komunitas offline (pasar ikan, event)
- Partnership dengan asosiasi breeder
- Adjust value proposition berdasarkan feedback
RISK-005	Perubahan regulasi perdagangan ikan online	Regulatory	3	2	6	CEO	- Monitor kebijakan KKP & Kominfo bulanan
- Desain sistem modular untuk compliance update
- Konsultasi legal proaktif	- Rapid feature update untuk compliance baru
- Komunikasi transparan ke user tentang perubahan
- Diversifikasi ke fitur non-transaksi jika diperlukan
RISK-006	Skalabilitas teknis saat traffic spike	Technical	3	3	9	CTO	- Arsitektur cloud-native dengan auto-scaling
- Load testing sebelum launch
- Caching strategy untuk read-heavy operation	- Emergency scale-up playbook
- Fallback ke read-only mode jika database overload
- CDN untuk offload static assets
RISK-007	Reputasi negatif akibat pengalaman user buruk	Brand	4	2	8	Marketing Lead	- Proactive customer support
- Program "Happy Buyer Guarantee"
- Monitoring social media & review platform	- Crisis communication plan
- Kompensasi untuk user terdampak
- Public improvement roadmap
11.2 Risk Monitoring & Review
FREQUENCY:
  - High Risk (Score ≥15): Review mingguan oleh Steering Committee
  - Medium Risk (Score 10-14): Review bulanan oleh Product & Tech Lead
  - Low Risk (Score <10): Review kuartalan dalam retrospective

TRIGGERS FOR ESCALATION:
  - Risk score meningkat ≥2 poin dalam 1 bulan
  - Incident nyata terjadi (misal: 5+ komplain DOA dalam 1 minggu)
  - Perubahan regulasi yang berdampak pada fitur inti

REPORTING:
  - Dashboard risiko real-time di internal wiki
  - Summary risiko dalam weekly sprint report
  - Deep-dive risk review dalam quarterly business review________________________________________
12. ASSUMPTIONS & DEPENDENCIES
12.1 Key Assumptions
ID	Assumption	Rationale	Validation Method
ASM-001	Minimal 50 breeder/seller bersedia join sebagai founding partner	Berdasarkan diskusi awal dengan komunitas ikan hias Jakarta & Yogyakarta	MoU atau letter of intent dari 10+ seller sebelum development dimulai
ASM-002	User Indonesia terbiasa dengan model escrow/rekening bersama	Keberhasilan Tokopedia/Shopee dengan sistem serupa	Survey 100 target user tentang kepercayaan terhadap payment model
ASM-003	Data ikan dari FishBase & BRIN dapat diakses secara legal untuk MVP	FishBase menyediakan API publik, BRIN memiliki data open access	Legal review & trial API integration sebelum finalisasi scope
ASM-004	Infrastruktur cloud (AWS/GCP) tersedia dengan latency <100ms untuk user Indonesia	Provider cloud memiliki region Asia Tenggara (Singapore/Jakarta)	Load test dari berbagai lokasi di Indonesia selama UAT
ASM-005	Tidak ada perubahan regulasi besar yang membatasi e-commerce ikan selama 12 bulan pertama	Stabilitas kebijakan KKP dalam 3 tahun terakhir	Monitoring regulasi bulanan oleh legal consultant
12.2 External Dependencies
Dependency	Provider	Criticality	SLA/Requirement	Contingency
Payment Gateway	Midtrans / Xendit	High	- Uptime ≥99.9%
- Settlement T+1
- Support 24/7	Fallback ke transfer manual + verifikasi admin
Maps & Geolocation	Mapbox / Google Maps	Medium	- Geocoding accuracy ≥95%
- Rate limit cukup untuk MVP	Fallback ke input manual provinsi/kota
Cloud Infrastructure	AWS (ap-southeast-1)	High	- Multi-AZ deployment
- Backup otomatis harian
- Support response <1 jam untuk critical	Multi-cloud ready architecture (GCP as backup)
Fish Data Source	FishBase API + BRIN	Medium	- Data update bulanan
- License untuk komersial usage	Local snapshot + manual curation jika API down
SMS/Email Service	Twilio / SendGrid	Low	- Delivery rate ≥98%
- Compliance dengan regulasi spam	Fallback ke WhatsApp Business API
Legal Compliance Advisor	External Law Firm	High	- Review dokumen sebelum launch
- Update regulasi bulanan	Internal legal checklist + konsultasi ad-hoc
12.3 Internal Dependencies
DEPENDENCY GRAPH - MVP CRITICAL PATH

Week 1-2: [BRD Final] → [UI/UX Wireframe] → [Tech Spec Sign-off]
                              │
                              ▼
Week 3-4: [Database Schema] → [API Contract] → [Frontend Scaffold]
                              │
                              ▼
Week 5-8: [Core Features Dev] ←→ [Content Curation: 100 Fish]
                              │
                              ▼
Week 9-10: [Integration Testing] → [Security Audit] → [UAT with Beta Users]
                              │
                              ▼
Week 11-12: [Compliance Check] → [Go-to-Market Prep] → [MVP LAUNCH 🚀]

BLOCKERS:
  ❗ Tech Spec tidak disetujui → delay seluruh development
  ❗ Content 100 fish tidak lengkap → encyclopedia tidak layak launch
  ❗ Security audit menemukan critical vulnerability → harus fix sebelum launch
  ❗ Legal tidak approve Terms of Service → tidak bisa registrasi PSE________________________________________
13. APPENDICES
Appendix A: Glossary
Term	Definition
DOA	Dead on Arrival: kondisi ikan mati saat diterima buyer
CITES	Convention on International Trade in Endangered Species: perjanjian internasional perdagangan spesies terancam
Escrow	Rekening bersama: dana ditahan pihak ketiga hingga transaksi selesai
PSE	Penyelenggara Sistem Elektronik: registrasi wajib platform digital di Indonesia
MAU	Monthly Active Users: user unik dengan ≥1 session dalam 30 hari
GMV	Gross Merchandise Value: total nilai transaksi sebelum potongan fee
PostGIS	Ekstensi PostgreSQL untuk data geografis/spasial
RBAC	Role-Based Access Control: sistem izin berbasis peran user
Appendix B: Reference Documents
1.	UU No. 31/2004 tentang Perikanan
2.	Permen KP No. 59/2020 tentang Ikan Hias
3.	FishBase API Documentation
4.	IUCN Red List Categories & Criteria
5.	Midtrans API Documentation
6.	Flutter Best Practices
7.	OWASP API Security Top 10
Appendix C: Approval Sign-off
BRD Version 1.0 - Approval

Nama                    | Jabatan               | Tanda Tangan | Tanggal
------------------------|-----------------------|--------------|----------
[Nama CEO]              | Chief Executive Officer| ___________  | ___/___/___
[Nama CTO]              | Chief Technology Officer| ___________ | ___/___/___
[Nama Product Lead]     | Head of Product       | ___________  | ___/___/___
[Nama Legal Counsel]    | Legal & Compliance    | ___________  | ___/___/___

Catatan Revisi:
___________________________________________________________________________
___________________________________________________________________________

Disetujui pada: ___/___/_______
Tempat: _______________________