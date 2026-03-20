import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FishSpecies } from './entities/fish-species.entity';
import { User } from './entities/user.entity';
import { FishHabitat, CitesAppendix, UserRole } from './common/enums';
import * as bcrypt from 'bcrypt';

const fishData = [
  {
    commonName: 'Cupang (Betta)', scientificName: 'Betta splendens', localName: 'Ikan Cupang',
    habitat: FishHabitat.FRESHWATER, description: 'Ikan hias populer dengan sirip indah dan warna cerah.',
    distributionProvinces: ['Sumatera Selatan', 'Kalimantan', 'Jawa Barat'],
    tempMin: 24, tempMax: 30, phMin: 6.0, phMax: 7.5, minTankSizeLiters: 10, maxSizeCm: 7,
    dietDescription: 'Karnivora - pelet, cacing beku, artemia', aggressiveness: 'aggressive',
    careTips: 'Jangan campur jantan dalam satu wadah. Ganti air 25% setiap minggu.',
    difficultyLevel: 'beginner', isProtected: false, iucnStatus: 'VU',
  },
  {
    commonName: 'Arwana Super Red', scientificName: 'Scleropages formosus', localName: 'Arwana Merah',
    habitat: FishHabitat.FRESHWATER, description: 'Ikan hias premium asal Kalimantan dengan warna merah menyala.',
    distributionProvinces: ['Kalimantan Barat', 'Kalimantan Tengah'],
    tempMin: 26, tempMax: 30, phMin: 6.0, phMax: 7.0, minTankSizeLiters: 600, maxSizeCm: 90,
    dietDescription: 'Karnivora - ikan kecil, udang, jangkrik', aggressiveness: 'aggressive',
    careTips: 'Butuh akuarium besar. Sensitif terhadap kualitas air.',
    difficultyLevel: 'advanced', isProtected: true, citesAppendix: CitesAppendix.I, iucnStatus: 'EN',
    protectionNote: 'Dilindungi CITES Appendix I. Perdagangan memerlukan izin khusus dari BKSDA.',
  },
  {
    commonName: 'Guppy', scientificName: 'Poecilia reticulata', localName: 'Ikan Gapi',
    habitat: FishHabitat.FRESHWATER, description: 'Ikan hias kecil berwarna-warni, mudah berkembang biak.',
    distributionProvinces: ['Jawa Barat', 'Jawa Timur', 'Bali', 'DKI Jakarta'],
    tempMin: 22, tempMax: 28, phMin: 6.8, phMax: 7.8, minTankSizeLiters: 20, maxSizeCm: 6,
    dietDescription: 'Omnivora - pelet, cacing sutera, sayuran halus', aggressiveness: 'peaceful',
    careTips: 'Cocok untuk pemula. Berkembang biak dengan cepat.',
    difficultyLevel: 'beginner', isProtected: false, iucnStatus: 'LC',
  },
  {
    commonName: 'Channa Maru', scientificName: 'Channa marulioides', localName: 'Gabus Hias',
    habitat: FishHabitat.FRESHWATER, description: 'Ikan predator hias dengan corak unik asal Sumatera.',
    distributionProvinces: ['Sumatera Selatan', 'Jambi', 'Riau'],
    tempMin: 24, tempMax: 28, phMin: 5.5, phMax: 7.0, minTankSizeLiters: 200, maxSizeCm: 60,
    dietDescription: 'Karnivora - ikan kecil, udang, cacing', aggressiveness: 'aggressive',
    careTips: 'Harus dipelihara sendiri. Butuh tutup akuarium yang rapat.',
    difficultyLevel: 'intermediate', isProtected: false, iucnStatus: 'LC',
  },
  {
    commonName: 'Ikan Neon Tetra', scientificName: 'Paracheirodon innesi', localName: 'Neon Tetra',
    habitat: FishHabitat.FRESHWATER, description: 'Ikan kecil berkelap-kelip, populer untuk aquascape.',
    distributionProvinces: ['DKI Jakarta', 'Jawa Barat'],
    tempMin: 20, tempMax: 26, phMin: 6.0, phMax: 7.0, minTankSizeLiters: 40, maxSizeCm: 3.5,
    dietDescription: 'Omnivora - pelet micro, artemia', aggressiveness: 'peaceful',
    careTips: 'Pelihara dalam kelompok minimal 6 ekor. Cocok untuk aquascape.',
    difficultyLevel: 'beginner', isProtected: false, iucnStatus: 'LC',
  },
  {
    commonName: 'Louhan', scientificName: 'Cichlasoma trimaculatum hybrid', localName: 'Lohan',
    habitat: FishHabitat.FRESHWATER, description: 'Ikan hias dengan jenong khas dan warna cerah.',
    distributionProvinces: ['DKI Jakarta', 'Jawa Timur', 'Sumatera Utara'],
    tempMin: 26, tempMax: 30, phMin: 6.5, phMax: 7.8, minTankSizeLiters: 200, maxSizeCm: 30,
    dietDescription: 'Omnivora - pelet, udang, cacing', aggressiveness: 'aggressive',
    careTips: 'Dipelihara sendiri. Butuh filtrasi kuat.',
    difficultyLevel: 'intermediate', isProtected: false, iucnStatus: 'NE',
  },
  {
    commonName: 'Koi', scientificName: 'Cyprinus rubrofuscus', localName: 'Ikan Koi',
    habitat: FishHabitat.FRESHWATER, description: 'Ikan kolam hias populer dengan corak warna beragam.',
    distributionProvinces: ['Jawa Barat', 'Jawa Timur', 'Bali'],
    tempMin: 15, tempMax: 25, phMin: 7.0, phMax: 8.0, minTankSizeLiters: 1000, maxSizeCm: 100,
    dietDescription: 'Omnivora - pelet koi, sayuran, buah', aggressiveness: 'peaceful',
    careTips: 'Butuh kolam outdoor. Kualitas air harus dijaga.',
    difficultyLevel: 'intermediate', isProtected: false, iucnStatus: 'LC',
  },
  {
    commonName: 'Discus', scientificName: 'Symphysodon discus', localName: 'Ikan Discus',
    habitat: FishHabitat.FRESHWATER, description: 'Ikan hias premium berbentuk pipih dengan warna memukau.',
    distributionProvinces: ['DKI Jakarta', 'Jawa Barat'],
    tempMin: 28, tempMax: 30, phMin: 5.5, phMax: 6.5, minTankSizeLiters: 200, maxSizeCm: 20,
    dietDescription: 'Omnivora - cacing beku, pelet khusus discus', aggressiveness: 'peaceful',
    careTips: 'Sangat sensitif terhadap kualitas air. Butuh perawatan intensif.',
    difficultyLevel: 'advanced', isProtected: false, iucnStatus: 'LC',
  },
  {
    commonName: 'Clownfish', scientificName: 'Amphiprion ocellaris', localName: 'Ikan Badut',
    habitat: FishHabitat.MARINE, description: 'Ikan laut kecil berwarna oranye-putih, hidup bersimbiosis dengan anemon.',
    distributionProvinces: ['Sulawesi Utara', 'Bali', 'NTT', 'Maluku'],
    tempMin: 24, tempMax: 28, phMin: 7.8, phMax: 8.4, minTankSizeLiters: 100, maxSizeCm: 11,
    dietDescription: 'Omnivora - pelet marine, artemia, mysis', aggressiveness: 'semi-aggressive',
    careTips: 'Butuh tank air laut dengan anemon. Relatif mudah untuk ikan laut.',
    difficultyLevel: 'intermediate', isProtected: false, iucnStatus: 'LC',
  },
  {
    commonName: 'Napoleon Wrasse', scientificName: 'Cheilinus undulatus', localName: 'Ikan Napoleon',
    habitat: FishHabitat.MARINE, description: 'Ikan karang besar dengan tonjolan khas di kepala.',
    distributionProvinces: ['Raja Ampat', 'Sulawesi Utara', 'NTT'],
    tempMin: 24, tempMax: 28, phMin: 8.0, phMax: 8.4, minTankSizeLiters: 5000, maxSizeCm: 200,
    dietDescription: 'Karnivora - moluska, krustasea, ikan kecil', aggressiveness: 'peaceful',
    careTips: 'TIDAK COCOK dipelihara di akuarium rumah.',
    difficultyLevel: 'advanced', isProtected: true, citesAppendix: CitesAppendix.II, iucnStatus: 'EN',
    protectionNote: 'Dilindungi CITES Appendix II. Dilarang ditangkap dan diperdagangkan.',
  },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const fishRepo = app.get<Repository<FishSpecies>>(getRepositoryToken(FishSpecies));
  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));

  // Seed admin user
  const existingAdmin = await userRepo.findOne({ where: { email: 'admin@fishbank.id' } });
  if (!existingAdmin) {
    const adminPassword = await bcrypt.hash('Admin123!', 12);
    await userRepo.save(userRepo.create({
      email: 'admin@fishbank.id', password: adminPassword, fullName: 'FishBank Admin',
      role: UserRole.ADMIN, phone: '08001234567',
    }));
    console.log('✅ Admin user created: admin@fishbank.id / Admin123!');
  }

  // Seed fish data
  for (const fish of fishData) {
    const exists = await fishRepo.findOne({ where: { scientificName: fish.scientificName } });
    if (!exists) {
      await fishRepo.save(fishRepo.create(fish));
      console.log(`🐟 Added: ${fish.commonName}`);
    }
  }

  console.log('🌱 Seed complete!');
  await app.close();
}

seed().catch(console.error);

