import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // Create admin user with username "admindesa" and password "admin123"
  const adminPassword = 'admin123';
  const hashedAdminPw = createHash('sha256').update(adminPassword).digest('hex');
  
  await prisma.admin.upsert({
    where: { username: 'admindesa' },
    update: {},
    create: {
      username: 'admindesa',
      email: 'admin@desaairsempiang.id',
      name: 'Admin Desa',
      password: hashedAdminPw,
      role: 'ADMIN',
      phone: '085150859735',
    },
  });

  // Create products for marketplace
  const products = [
    { name: 'Kopi Robusta Air Sempiang', description: 'Kopi robusta premium dari perkebunan Desa Air Sempiang, dipetik dan diolah secara tradisional oleh petani lokal.', price: 75000, category: 'PERTANIAN', stock: 50, image: '/products/kopi.jpg' },
    { name: 'Beras Organik Desa', description: 'Beras organik berkualitas tinggi dari sawah irigasi Desa Air Sempiang, ditanam tanpa pestisida kimia.', price: 65000, category: 'PERTANIAN', stock: 100, image: '/products/beras.jpg' },
    { name: 'Madu Hutan Bengkulu', description: 'Madu murni dari hutan lindung sekitar Desa Air Sempiang, dikumpulkan oleh petani madu tradisional.', price: 120000, category: 'UMKM', stock: 30, image: '/products/madu.jpg' },
    { name: 'Kain Tenun Tradisional', description: 'Kain tenun khas Bengkulu buatan tangan pengrajin lokal Desa Air Sempiang dengan motif tradisional.', price: 250000, category: 'UMKM', stock: 15, image: '/products/tenun.jpg' },
    { name: 'Dodol Nanas', description: 'Dodol nanas lezat dari nanas segar kebun Desa Air Sempiang, camilan khas daerah yang cocok untuk oleh-oleh.', price: 35000, category: 'UMKM', stock: 80, image: '/products/dodol.jpg' },
    { name: 'Cabai Rawit Kering', description: 'Cabai rawit kering pilihan dari ladang warga Desa Air Sempiang, pedasnya mantap untuk bumbu masakan.', price: 45000, category: 'PERTANIAN', stock: 60, image: '/products/cabai.jpg' },
    { name: 'Keripik Pisang', description: 'Keripik pisang renyah dari UMKM wanita Desa Air Sempiang, tersedia rasa original dan pedas.', price: 25000, category: 'UMKM', stock: 100, image: '/products/keripik.jpg' },
    { name: 'Minyak Kemiri', description: 'Minyak kemiri murni untuk perawatan rambut, diproduksi oleh kelompok wanita tani Desa Air Sempiang.', price: 55000, category: 'UMKM', stock: 40, image: '/products/kemiri.jpg' },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  // Create news
  const newsItems = [
    {
      title: 'Peluncuran Website Desa Digital Terintegrasi',
      content: 'Desa Air Sempiang dengan bangga meluncurkan website desa digital terintegrasi sebagai upaya optimalisasi layanan pendidikan, pemberdayaan UMKM dan pertanian, serta penguatan Program Desa Cantik. Website ini menyediakan berbagai layanan digital untuk memudahkan warga dalam mengakses informasi dan layanan desa secara online. Melalui platform ini, warga dapat mengakses layanan kependudukan, marketplace produk UMKM lokal, serta berbagai program pemberdayaan masyarakat. Inisiatif ini didukung penuh oleh Pemerintah Kabupaten Kepahiang dan menjadi pilot project untuk desa-dana lain di Provinsi Bengkulu.',
      author: 'Admin Desa',
    },
    {
      title: 'Program Desa Cantik 2024: Peningkatan Infrastruktur Digital',
      content: 'Dalam rangka Program Desa Cantik tahun 2024, Desa Air Sempiang mendapat alokasi dana untuk peningkatan infrastruktur digital. Program ini mencakup pemasangan jaringan internet desa, pembangunan balai desa digital, dan pelatihan literasi digital bagi warga. Kepala Desa menyampaikan bahwa program ini diharapkan dapat meningkatkan kualitas hidup warga dan membuka peluang ekonomi baru melalui pemanfaatan teknologi digital. Selain itu, program ini juga mendukung pengembangan UMKM lokal agar dapat memasarkan produknya secara lebih luas melalui platform digital.',
      author: 'Admin Desa',
    },
    {
      title: 'Pelatihan Pertanian Organik untuk Petani Desa',
      content: 'Dinas Pertanian Kabupaten Kepahiang bekerja sama dengan Desa Air Sempiang mengadakan pelatihan pertanian organik bagi para petani lokal. Pelatihan ini bertujuan untuk meningkatkan kualitas dan nilai jual produk pertanian desa. Peserta akan belajar teknik bertanam organik, pengendalian hama alami, dan sertifikasi produk organik. Hasil panen organik dari desa diharapkan dapat dipasarkan melalui marketplace desa dengan harga yang lebih kompetitif, sehingga dapat meningkatkan pendapatan petani secara signifikan.',
      author: 'Admin Desa',
    },
    {
      title: 'Festival UMKM Desa Air Sempiang 2024',
      content: 'Desa Air Sempiang akan menggelar Festival UMKM tahunan yang menampilkan berbagai produk unggulan desa seperti kopi robusta, kain tenun, madu hutan, dan aneka olahan makanan tradisional. Festival ini dijadwalkan berlangsung selama tiga hari dan akan dihadiri oleh pembeli dari berbagai daerah di Provinsi Bengkulu. Acara ini juga akan dimeriahkan dengan pertunjukan seni budaya lokal dan lomba memasak bahan-bahan lokal. Warga yang ingin berpartisipasi sebagai peserta dapat mendaftar di kantor desa atau melalui website desa digital ini.',
      author: 'Admin Desa',
    },
  ];

  for (const news of newsItems) {
    await prisma.news.create({ data: news });
  }

  // Create village services
  const services = [
    { name: 'Pembuatan KTP Elektronik', description: 'Layanan pembuatan Kartu Tanda Penduduk Elektronik (e-KTP) untuk warga Desa Air Sempiang. Proses pengurusan memakan waktu 7-14 hari kerja.', category: 'KEPENDUDUKAN', requirements: 'Fotokopi KK, Surat Pengantar RT/RW, Pas Foto 3x4 (2 lembar)' },
    { name: 'Pembuatan Kartu Keluarga', description: 'Layanan pembuatan atau perubahan Kartu Keluarga (KK) untuk warga Desa Air Sempiang.', category: 'KEPENDUDUKAN', requirements: 'KTP asli kepala keluarga, Akta nikah/cerai, Surat pengantar RT/RW' },
    { name: 'Surat Keterangan Domisili', description: 'Layanan pembuatan surat keterangan domisili untuk keperluan administrasi, pekerjaan, atau pendidikan.', category: 'SURAT', requirements: 'KTP asli, Fotokopi KTP, Surat pengantar RT/RW' },
    { name: 'Surat Keterangan Tidak Mampu', description: 'Layanan pembuatan SKTM untuk keperluan bantuan sosial, keringanan biaya pendidikan, atau pengobatan.', category: 'SURAT', requirements: 'KTP asli, Fotokopi KK, Surat pengantar RT/RW, Surat keterangan penghasilan' },
    { name: 'Izin Usaha Mikro Kecil', description: 'Layanan pengurusan izin usaha mikro kecil (IUMK) untuk pelaku UMKM di wilayah Desa Air Sempiang.', category: 'UMKM', requirements: 'KTP asli, Fotokopi KK, Pas foto 3x4, Surat pengantar RT/RW, Denah lokasi usaha' },
    { name: 'Bantuan Pertanian', description: 'Layanan pendampingan dan bantuan alat pertanian untuk petani di Desa Air Sempiang melalui program desa.', category: 'PERTANIAN', requirements: 'KTP asli, Fotokopi KK, Surat keterangan petani dari Pokdarwan' },
    { name: 'Konsultasi Pendidikan', description: 'Layanan konsultasi pendidikan dan informasi beasiswa untuk anak-anak warga Desa Air Sempiang.', category: 'PENDIDIKAN', requirements: 'Tidak ada persyaratan khusus, cukup datang ke kantor desa' },
    { name: 'Pelaporan Online', description: 'Layanan pelaporan masalah infrastruktur, keamanan, dan keluhan warga secara online melalui website desa.', category: 'LAINNYA', requirements: 'Tidak ada persyaratan khusus' },
  ];

  for (const service of services) {
    await prisma.villageService.create({ data: service });
  }

  // Create courses (Corporate University)
  const courses = [
    { title: 'Literasi Digital Dasar', description: 'Pelatihan dasar penggunaan komputer, internet, dan aplikasi digital untuk warga desa. Materi mencakup pengenalan perangkat, browsing, email, dan media sosial.', instructor: 'Tim ICT Desa', category: 'TEKNOLOGI' },
    { title: 'Pemasaran Digital UMKM', description: 'Pelatihan strategi pemasaran digital untuk pelaku UMKM desa meliputi penggunaan media sosial, marketplace, dan teknik fotografi produk.', instructor: 'Dinas Koperasi Kepahiang', category: 'UMKM' },
    { title: 'Pertanian Organik Modern', description: 'Kursus teknik pertanian organik dengan teknologi modern, termasuk pengomposan, pengendalian hama alami, dan irigasi hemat air.', instructor: 'Penyuluh Pertanian Kabupaten', category: 'PERTANIAN' },
    { title: 'Keuangan Desa & Pengelolaan Dana', description: 'Pelatihan pengelolaan keuangan desa, APBDes, dan transparansi anggaran untuk perangkat desa dan BPD.', instructor: 'Inspektorat Kabupaten Kepahiang', category: 'PEMERINTAHAN' },
    { title: 'Keterampilan Tenun Tradisional', description: 'Pelatihan keterampilan menenun kain tradisional Bengkulu untuk melestarikan budaya dan meningkatkan pendapatan warga.', instructor: 'Sanggar Tenun Sejahtera', category: 'BUDAYA' },
    { title: 'Bahasa Inggris untuk Pariwisata', description: 'Kursus bahasa Inggris dasar untuk warga yang bergerak di sektor pariwisata dan hospitality desa.', instructor: 'Relawan Pengajar', category: 'BAHASA' },
  ];

  for (const course of courses) {
    await prisma.course.create({ data: course });
  }

  // Create literacy materials
  const literacyMaterials = [
    { title: 'Panduan E-Government untuk Desa', content: 'Dokumen panduan implementasi e-government di tingkat desa, mencakup aspek teknis, kelembagaan, dan sumber daya manusia. Panduan ini disusun berdasarkan pengalaman desa-desa digital yang sudah berhasil menerapkan sistem pemerintahan elektronik di Indonesia.', category: 'E-GOVERNMENT', author: 'Kemendesa PDTT' },
    { title: 'Modul Pelatihan UMKM Go Digital', content: 'Modul lengkap untuk pelatihan UMKM agar dapat memanfaatkan platform digital dalam pemasaran produk. Modul ini mencakup langkah-langkah pembuatan toko online, strategi konten media sosial, dan manajemen pesanan online.', category: 'UMKM', author: 'Tim Desa Digital' },
    { title: 'Buku Saku Pertanian Berkelanjutan', content: 'Buku saku yang berisi tips dan teknik pertanian berkelanjutan yang sesuai dengan kondisi geografis Desa Air Sempiang. Meliputi teknik konservasi tanah, penggunaan pupuk organik, dan diversifikasi tanaman.', category: 'PERTANIAN', author: 'Penyuluh Pertanian' },
    { title: 'Panduan Pendidikan Anak Desa', content: 'Panduan bagi orang tua di desa untuk mendukung pendidikan anak-anak mereka, termasuk tips belajar di rumah, pemanfaatan teknologi untuk pembelajaran, dan informasi beasiswa yang tersedia.', category: 'PENDIDIKAN', author: 'Guru SDN Air Sempiang' },
  ];

  for (const material of literacyMaterials) {
    await prisma.literacyMaterial.create({ data: material });
  }

  // Create resident data
  const residentData = [
    { category: 'Total Penduduk', total: 3245, male: 1642, female: 1603, description: 'Jumlah penduduk keseluruhan Desa Air Sempiang berdasarkan data monografi desa terbaru', year: 2024 },
    { category: 'Kepala Keluarga', total: 856, male: 0, female: 0, description: 'Jumlah kepala keluarga yang tercatat di Desa Air Sempiang', year: 2024 },
    { category: 'Usia Produktif (18-55)', total: 1890, male: 955, female: 935, description: 'Penduduk usia produktif yang berpotensi menggerakkan perekonomian desa', year: 2024 },
    { category: 'Anak-anak (0-17 tahun)', total: 895, male: 456, female: 439, description: 'Jumlah penduduk usia anak-anak yang membutuhkan layanan pendidikan dan kesehatan', year: 2024 },
    { category: 'Lansia (55+ tahun)', total: 460, male: 231, female: 229, description: 'Jumlah penduduk lanjut usia yang memerlukan perhatian khusus dalam layanan sosial', year: 2024 },
    { category: 'Pelajar/Mahasiswa', total: 345, male: 175, female: 170, description: 'Jumlah pelajar dan mahasiswa yang aktif menempuh pendidikan', year: 2024 },
  ];

  for (const data of residentData) {
    await prisma.residentData.create({ data });
  }

  console.log('✅ Seed data inserted successfully!');
  console.log('📋 Admin login: username=admindesa, password=admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
