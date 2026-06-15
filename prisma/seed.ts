import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const db = new PrismaClient();

const hashPassword = (pw: string) => createHash('sha256').update(pw).digest('hex');

async function main() {
  console.log('🌱 Seeding database...\n');

  // ============================================
  // 1. CLEAN UP - Hapus semua data lama
  // ============================================
  console.log('🧹 Membersihkan data lama...');
  await db.paymentProof.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.eTransaction.deleteMany();
  await db.serviceApplication.deleteMany();
  await db.chatMessage.deleteMany();
  await db.residentData.deleteMany();
  await db.literacyMaterial.deleteMany();
  await db.course.deleteMany();
  await db.news.deleteMany();
  await db.villageService.deleteMany();
  await db.product.deleteMany();
  await db.setting.deleteMany();
  await db.user.deleteMany();
  await db.admin.deleteMany();
  console.log('✅ Data lama dihapus\n');

  // ============================================
  // 2. ADMIN
  // ============================================
  console.log('👤 Membuat akun admin...');
  const admin = await db.admin.create({
    data: {
      username: 'admindesa',
      email: 'admin@desaairsempiang.id',
      name: 'Admin Desa',
      password: hashPassword('admin123'),
      role: 'ADMIN',
      phone: '085150859735',
    },
  });
  console.log(`✅ Admin: ${admin.username} / admin123\n`);

  // ============================================
  // 3. USER CONTOH
  // ============================================
  console.log('👥 Membuat user contoh...');
  const user1 = await db.user.create({
    data: {
      email: 'lestarimutia613@gmail.com',
      name: 'Mutia Lestari',
      password: hashPassword('user123'),
      role: 'USER',
      phone: '085268596027',
      address: 'Desa Air Sempiang, Kec. Kabawetan, Kab. Kepahiang, Bengkulu',
    },
  });
  const user2 = await db.user.create({
    data: {
      email: 'budi@example.com',
      name: 'Budi Santoso',
      password: hashPassword('user123'),
      role: 'USER',
      phone: '081234567890',
      address: 'Desa Air Sempiang, Kec. Kabawetan',
    },
  });
  console.log(`✅ User: ${user1.email}, ${user2.email}\n`);

  // ============================================
  // 4. PRODUK UMKM & PERTANIAN
  // ============================================
  console.log('🛍️ Membuat produk...');
  const products = await Promise.all([
    db.product.create({
      data: {
        name: 'Kopi Robusta Air Sempiang',
        description: 'Kopi robusta premium dari perkebunan Desa Air Sempiang, dipetik dan diolah secara tradisional oleh petani lokal. Rasa khas dengan aroma kuat dan aftertaste cokelat.',
        price: 75000,
        image: '/products/kopi.jpg',
        category: 'PERTANIAN',
        stock: 50,
        seller: 'UMKM Desa Air Sempiang',
      },
    }),
    db.product.create({
      data: {
        name: 'Beras Organik Desa',
        description: 'Beras organik berkualitas tinggi dari sawah irigasi Desa Air Sempiang, ditanam tanpa pestisida kimia. Pulen dan harum saat dimasak.',
        price: 65000,
        image: '/products/beras.jpg',
        category: 'PERTANIAN',
        stock: 100,
        seller: 'Kelompok Tani Makmur',
      },
    }),
    db.product.create({
      data: {
        name: 'Madu Hutan Bengkulu',
        description: 'Madu murni dari hutan lindung sekitar Desa Air Sempiang, dikumpulkan oleh petani madu tradisional. Kaya antioksidan dan nutrisi alami.',
        price: 120000,
        image: '/products/madu.jpg',
        category: 'UMKM',
        stock: 30,
        seller: 'Kelompok Petani Madu',
      },
    }),
    db.product.create({
      data: {
        name: 'Kain Tenun Tradisional',
        description: 'Kain tenun khas Bengkulu buatan tangan pengrajin lokal Desa Air Sempiang dengan motif tradisional. Cocok untuk busana adat dan souvenir.',
        price: 250000,
        image: '/products/tenun.jpg',
        category: 'UMKM',
        stock: 15,
        seller: 'Sanggar Tenun Sejahtera',
      },
    }),
    db.product.create({
      data: {
        name: 'Dodol Nanas',
        description: 'Dodol nanas lezat dari nanas segar kebun Desa Air Sempiang, camilan khas daerah yang cocok untuk oleh-oleh. Tersedia rasa original dan pandan.',
        price: 35000,
        image: '/products/dodol.jpg',
        category: 'UMKM',
        stock: 80,
        seller: 'UMKM Wanita Desa',
      },
    }),
    db.product.create({
      data: {
        name: 'Cabai Rawit Kering',
        description: 'Cabai rawit kering pilihan dari ladang warga Desa Air Sempiang, pedasnya mantap untuk bumbu masakan. Dijemur alami di bawah sinar matahari.',
        price: 45000,
        image: '/products/cabai.jpg',
        category: 'PERTANIAN',
        stock: 60,
        seller: 'Kelompok Tani Makmur',
      },
    }),
    db.product.create({
      data: {
        name: 'Keripik Pisang',
        description: 'Keripik pisang renyah dari UMKM wanita Desa Air Sempiang, tersedia rasa original dan pedas. Tanpa pengawet dan pewarna buatan.',
        price: 25000,
        image: '/products/keripik.jpg',
        category: 'UMKM',
        stock: 100,
        seller: 'UMKM Wanita Desa',
      },
    }),
    db.product.create({
      data: {
        name: 'Minyak Kemiri',
        description: 'Minyak kemiri murni untuk perawatan rambut, diproduksi oleh kelompok wanita tani Desa Air Sempiang. Membantu menghitamkan dan menyuburkan rambut.',
        price: 55000,
        image: '/products/kemiri.jpg',
        category: 'UMKM',
        stock: 40,
        seller: 'Kelompok Wanita Tani',
      },
    }),
    db.product.create({
      data: {
        name: 'Jahe Merah Bubuk',
        description: 'Jahe merah bubuk premium dari perkebunan Desa Air Sempiang. Berkhasiat untuk menghangatkan tubuh dan menjaga daya tahan imun.',
        price: 40000,
        image: '/products/jahe.jpg',
        category: 'PERTANIAN',
        stock: 45,
        seller: 'Kelompok Tani Makmur',
      },
    }),
    db.product.create({
      data: {
        name: 'Tas Anyaman Bambu',
        description: 'Tas anyaman bambu handmade buatan pengrajin Desa Air Sempiang. Desain modern dengan sentuhan tradisional, ramah lingkungan.',
        price: 85000,
        image: '/products/tas.jpg',
        category: 'UMKM',
        stock: 20,
        seller: 'Sanggar Anyam Desa',
      },
    }),
  ]);
  console.log(`✅ ${products.length} produk dibuat\n`);

  // ============================================
  // 5. LAYANAN DESA
  // ============================================
  console.log('🏛️ Membuat layanan desa...');
  const services = await Promise.all([
    db.villageService.create({
      data: {
        name: 'Pembuatan KTP Elektronik',
        description: 'Layanan pembuatan Kartu Tanda Penduduk Elektronik (e-KTP) untuk warga Desa Air Sempiang. Proses pengurusan memakan waktu 7-14 hari kerja.',
        category: 'KEPENDUDUKAN',
        requirements: 'Fotokopi KK, Surat Pengantar RT/RW, Pas Foto 3x4 (2 lembar)',
      },
    }),
    db.villageService.create({
      data: {
        name: 'Pembuatan Kartu Keluarga',
        description: 'Layanan pembuatan atau perubahan Kartu Keluarga (KK) untuk warga Desa Air Sempiang. Berlaku untuk penambahan, pengurangan, atau perubahan anggota keluarga.',
        category: 'KEPENDUDUKAN',
        requirements: 'KTP asli kepala keluarga, Akta nikah/cerai/kelahiran, Surat pengantar RT/RW',
      },
    }),
    db.villageService.create({
      data: {
        name: 'Surat Keterangan Domisili',
        description: 'Layanan pembuatan surat keterangan domisili untuk keperluan administrasi, pekerjaan, atau pendidikan. Berlaku 6 bulan sejak diterbitkan.',
        category: 'SURAT',
        requirements: 'KTP asli, Fotokopi KTP, Surat pengantar RT/RW',
      },
    }),
    db.villageService.create({
      data: {
        name: 'Surat Keterangan Tidak Mampu',
        description: 'Layanan pembuatan SKTM untuk keperluan bantuan sosial, keringanan biaya pendidikan, atau pengobatan. Memerlukan verifikasi lapangan oleh RT/RW.',
        category: 'SURAT',
        requirements: 'KTP asli, Fotokopi KK, Surat pengantar RT/RW, Surat keterangan penghasilan',
      },
    }),
    db.villageService.create({
      data: {
        name: 'Surat Pengantar SKCK',
        description: 'Layanan pembuatan surat pengantar untuk mengurus Surat Keterangan Catatan Kepolisian (SKCK). Diperlukan untuk melamar pekerjaan formal.',
        category: 'SURAT',
        requirements: 'KTP asli, Fotokopi KTP, Pas Foto 4x6 (4 lembar), Surat pengantar RT/RW',
      },
    }),
    db.villageService.create({
      data: {
        name: 'Izin Usaha Mikro Kecil',
        description: 'Layanan pengurusan izin usaha mikro kecil (IUMK) untuk pelaku UMKM di wilayah Desa Air Sempiang. Gratis dan diproses maksimal 3 hari kerja.',
        category: 'UMKM',
        requirements: 'KTP asli, Fotokopi KK, Pas foto 3x4, Surat pengantar RT/RW, Denah lokasi usaha',
      },
    }),
    db.villageService.create({
      data: {
        name: 'Bantuan Pertanian',
        description: 'Layanan pendampingan dan bantuan alat pertanian untuk petani di Desa Air Sempiang melalui program desa. Meliputi bantuan benih, pupuk, dan alat pertanian.',
        category: 'PERTANIAN',
        requirements: 'KTP asli, Fotokopi KK, Surat keterangan petani dari Pokdarwan',
      },
    }),
    db.villageService.create({
      data: {
        name: 'Konsultasi Pendidikan',
        description: 'Layanan konsultasi pendidikan dan informasi beasiswa untuk anak-anak warga Desa Air Sempiang. Tersedia informasi beasiswa dari pemerintah dan swasta.',
        category: 'PENDIDIKAN',
        requirements: 'Tidak ada persyaratan khusus, cukup datang ke kantor desa',
      },
    }),
    db.villageService.create({
      data: {
        name: 'Pelaporan Online',
        description: 'Layanan pelaporan masalah infrastruktur, keamanan, dan keluhan warga secara online melalui website desa. Terverifikasi dalam 1x24 jam.',
        category: 'LAINNYA',
        requirements: 'Tidak ada persyaratan khusus',
      },
    }),
    db.villageService.create({
      data: {
        name: 'Surat Keterangan Usaha',
        description: 'Layanan pembuatan surat keterangan usaha untuk keperluan pinjaman bank, pendaftaran BPJS, atau keperluan administrasi lainnya.',
        category: 'UMKM',
        requirements: 'KTP asli, Fotokopi KK, Foto lokasi usaha, Surat pengantar RT/RW',
      },
    }),
  ]);
  console.log(`✅ ${services.length} layanan dibuat\n`);

  // ============================================
  // 6. BERITA
  // ============================================
  console.log('📰 Membuat berita...');
  const news = await Promise.all([
    db.news.create({
      data: {
        title: 'Peluncuran Website Desa Digital Terintegrasi',
        content: 'Desa Air Sempiang dengan bangga meluncurkan website desa digital terintegrasi sebagai upaya optimalisasi layanan pendidikan, pemberdayaan UMKM dan pertanian, serta penguatan Program Desa Cantik. Website ini menyediakan berbagai layanan digital untuk memudahkan warga dalam mengakses informasi dan layanan desa secara online.\n\nMelalui platform ini, warga dapat mengakses layanan kependudukan, marketplace produk UMKM lokal, serta berbagai program pemberdayaan masyarakat. Inisiatif ini didukung penuh oleh Pemerintah Kabupaten Kepahiang dan menjadi pilot project untuk desa-dana lain di Provinsi Bengkulu.\n\nKepala Desa Air Sempiang menyampaikan bahwa digitalisasi layanan desa merupakan langkah strategis untuk meningkatkan transparansi, efisiensi, dan aksesibilitas layanan publik bagi seluruh warga desa.',
        author: 'Admin Desa',
      },
    }),
    db.news.create({
      data: {
        title: 'Program Desa Cantik 2024: Peningkatan Infrastruktur Digital',
        content: 'Dalam rangka Program Desa Cantik tahun 2024, Desa Air Sempiang mendapat alokasi dana untuk peningkatan infrastruktur digital. Program ini mencakup pemasangan jaringan internet desa, pembangunan balai desa digital, dan pelatihan literasi digital bagi warga.\n\nKepala Desa menyampaikan bahwa program ini diharapkan dapat meningkatkan kualitas hidup warga dan membuka peluang ekonomi baru melalui pemanfaatan teknologi digital. Selain itu, program ini juga mendukung pengembangan UMKM lokal agar dapat memasarkan produknya secara lebih luas melalui platform digital.\n\nProgram ini ditargetkan selesai dalam waktu 6 bulan dan akan dilakukan secara bertahap mulai dari penyediaan infrastruktur hingga pelatihan penggunaan teknologi bagi warga.',
        author: 'Admin Desa',
      },
    }),
    db.news.create({
      data: {
        title: 'Pelatihan Pertanian Organik untuk Petani Desa',
        content: 'Dinas Pertanian Kabupaten Kepahiang bekerja sama dengan Desa Air Sempiang mengadakan pelatihan pertanian organik bagi para petani lokal. Pelatihan ini bertujuan untuk meningkatkan kualitas dan nilai jual produk pertanian desa.\n\nPeserta akan belajar teknik bertanam organik, pengendalian hama alami, dan sertifikasi produk organik. Hasil panen organik dari desa diharapkan dapat dipasarkan melalui marketplace desa dengan harga yang lebih kompetitif, sehingga dapat meningkatkan pendapatan petani secara signifikan.\n\nPelatihan akan berlangsung selama 3 hari di Balai Desa Air Sempiang dengan narasumber dari Dinas Pertanian dan praktisi pertanian organik berpengalaman.',
        author: 'Admin Desa',
      },
    }),
    db.news.create({
      data: {
        title: 'Festival UMKM Desa Air Sempiang 2024',
        content: 'Desa Air Sempiang akan menggelar Festival UMKM tahunan yang menampilkan berbagai produk unggulan desa seperti kopi robusta, kain tenun, madu hutan, dan aneka olahan makanan tradisional. Festival ini dijadwalkan berlangsung selama tiga hari dan akan dihadiri oleh pembeli dari berbagai daerah di Provinsi Bengkulu.\n\nAcara ini juga akan dimeriahkan dengan pertunjukan seni budaya lokal dan lomba memasak bahan-bahan lokal. Warga yang ingin berpartisipasi sebagai peserta dapat mendaftar di kantor desa atau melalui website desa digital ini.\n\nFestival UMKM ini merupakan agenda tahunan yang bertujuan untuk mempromosikan produk lokal dan meningkatkan ekonomi warga desa melalui pemasaran langsung kepada konsumen.',
        author: 'Admin Desa',
      },
    }),
    db.news.create({
      data: {
        title: 'Bantuan Sosial Tahap III Telah Disalurkan',
        content: 'Pemerintah Desa Air Sempiang telah menyalurkan bantuan sosial tahap III kepada 150 keluarga penerima manfaat. Bantuan ini meliputi sembako, masker, dan obat-obatan dasar.\n\nPenyaluran dilakukan secara bertahap di Balai Desa dengan menerapkan protokol kesehatan yang ketat. Warga penerima diharapkan dapat memanfaatkan bantuan ini dengan baik dan tetap menjaga kesehatan bersama.\n\nKepala Desa mengucapkan terima kasih kepada pemerintah kabupaten dan provinsi yang telah mendukung program bantuan sosial ini.',
        author: 'Admin Desa',
      },
    }),
    db.news.create({
      data: {
        title: 'Pembangunan Jalan Desa Tahap II Dimulai',
        content: 'Pembangunan jalan desa tahap II resmi dimulai pada minggu ini. Proyek ini mencakup perbaikan dan pengerasan jalan sepanjang 2,5 km yang menghubungkan dusun utara dengan dusun selatan.\n\nPembangunan ini dibiayai dari dana desa dan bantuan provinsi dengan total anggaran Rp 850 juta. Diperkirakan akan selesai dalam waktu 4 bulan dan sangat diharapkan dapat memperlancar akses transportasi warga serta distribusi hasil pertanian.\n\nWarga dimohon untuk berhati-hati saat melewati area pembangunan dan menggunakan jalur alternatif yang telah disediakan.',
        author: 'Admin Desa',
      },
    }),
  ]);
  console.log(`✅ ${news.length} berita dibuat\n`);

  // ============================================
  // 7. KURSUS (CORPORATE UNIVERSITY)
  // ============================================
  console.log('🎓 Membuat kursus...');
  const courses = await Promise.all([
    db.course.create({
      data: {
        title: 'Literasi Digital Dasar',
        description: 'Pelatihan dasar penggunaan komputer, internet, dan aplikasi digital untuk warga desa. Materi mencakup pengenalan perangkat, browsing, email, dan media sosial.',
        instructor: 'Tim ICT Desa',
        category: 'TEKNOLOGI',
      },
    }),
    db.course.create({
      data: {
        title: 'Pemasaran Digital UMKM',
        description: 'Pelatihan strategi pemasaran digital untuk pelaku UMKM desa meliputi penggunaan media sosial, marketplace, dan teknik fotografi produk.',
        instructor: 'Dinas Koperasi Kepahiang',
        category: 'UMKM',
      },
    }),
    db.course.create({
      data: {
        title: 'Pertanian Organik Modern',
        description: 'Kursus teknik pertanian organik dengan teknologi modern, termasuk pengomposan, pengendalian hama alami, dan irigasi hemat air.',
        instructor: 'Penyuluh Pertanian Kabupaten',
        category: 'PERTANIAN',
      },
    }),
    db.course.create({
      data: {
        title: 'Keuangan Desa & Pengelolaan Dana',
        description: 'Pelatihan pengelolaan keuangan desa, APBDes, dan transparansi anggaran untuk perangkat desa dan BPD.',
        instructor: 'Inspektorat Kabupaten Kepahiang',
        category: 'PEMERINTAHAN',
      },
    }),
    db.course.create({
      data: {
        title: 'Keterampilan Tenun Tradisional',
        description: 'Pelatihan keterampilan menenun kain tradisional Bengkulu untuk melestarikan budaya dan meningkatkan pendapatan warga.',
        instructor: 'Sanggar Tenun Sejahtera',
        category: 'BUDAYA',
      },
    }),
    db.course.create({
      data: {
        title: 'Bahasa Inggris untuk Pariwisata',
        description: 'Kursus bahasa Inggris dasar untuk warga yang bergerak di sektor pariwisata dan hospitality desa.',
        instructor: 'Relawan Pengajar',
        category: 'BAHASA',
      },
    }),
    db.course.create({
      data: {
        title: 'Akuntansi Dasar untuk UMKM',
        description: 'Pelatihan pencatatan keuangan sederhana untuk pelaku UMKM desa agar dapat mengelola keuangan usaha dengan lebih baik dan transparan.',
        instructor: 'Dinas Koperasi Kepahiang',
        category: 'UMKM',
      },
    }),
    db.course.create({
      data: {
        title: 'Pengolahan Hasil Pertanian',
        description: 'Pelatihan pengolahan produk pertanian menjadi produk olahan bernilai jual tinggi seperti kopi bubuk, dodol, dan keripik.',
        instructor: 'Penyuluh Pertanian Kabupaten',
        category: 'PERTANIAN',
      },
    }),
  ]);
  console.log(`✅ ${courses.length} kursus dibuat\n`);

  // ============================================
  // 8. DATA KEPENDUDUKAN
  // ============================================
  console.log('👥 Membuat data kependudukan...');
  const residents = await Promise.all([
    db.residentData.create({
      data: {
        category: 'Total Penduduk',
        total: 3245,
        male: 1642,
        female: 1603,
        description: 'Jumlah penduduk keseluruhan Desa Air Sempiang berdasarkan data monografi desa terbaru',
        year: 2024,
      },
    }),
    db.residentData.create({
      data: {
        category: 'Kepala Keluarga',
        total: 856,
        male: 0,
        female: 0,
        description: 'Jumlah kepala keluarga yang tercatat di Desa Air Sempiang',
        year: 2024,
      },
    }),
    db.residentData.create({
      data: {
        category: 'Usia Produktif (18-55)',
        total: 1890,
        male: 955,
        female: 935,
        description: 'Penduduk usia produktif yang berpotensi menggerakkan perekonomian desa',
        year: 2024,
      },
    }),
    db.residentData.create({
      data: {
        category: 'Anak-anak (0-17 tahun)',
        total: 895,
        male: 456,
        female: 439,
        description: 'Jumlah penduduk usia anak-anak yang membutuhkan layanan pendidikan dan kesehatan',
        year: 2024,
      },
    }),
    db.residentData.create({
      data: {
        category: 'Lansia (55+ tahun)',
        total: 460,
        male: 231,
        female: 229,
        description: 'Jumlah penduduk lanjut usia yang memerlukan perhatian khusus dalam layanan sosial',
        year: 2024,
      },
    }),
    db.residentData.create({
      data: {
        category: 'Pelajar/Mahasiswa',
        total: 345,
        male: 175,
        female: 170,
        description: 'Jumlah pelajar dan mahasiswa yang aktif menempuh pendidikan',
        year: 2024,
      },
    }),
    db.residentData.create({
      data: {
        category: 'Pelaku UMKM',
        total: 125,
        male: 52,
        female: 73,
        description: 'Jumlah pelaku Usaha Mikro Kecil Menengah yang terdaftar di Desa Air Sempiang',
        year: 2024,
      },
    }),
    db.residentData.create({
      data: {
        category: 'Petani',
        total: 480,
        male: 320,
        female: 160,
        description: 'Jumlah petani aktif yang mengelola lahan pertanian di wilayah desa',
        year: 2024,
      },
    }),
  ]);
  console.log(`✅ ${residents.length} data kependudukan dibuat\n`);

  // ============================================
  // 9. PENGATURAN DESA
  // ============================================
  console.log('⚙️ Membuat pengaturan...');
  const settingsData = [
    { key: 'village_name', value: 'Desa Air Sempiang' },
    { key: 'village_description', value: 'Kecamatan Kabawetan, Kabupaten Kepahiang, Provinsi Bengkulu' },
    { key: 'village_address', value: 'Kec. Kabawetan, Kab. Kepahiang, Prov. Bengkulu' },
    { key: 'village_phone', value: '085150859735' },
    { key: 'village_email', value: 'info@desaairsempiang.id' },
    { key: 'village_whatsapp', value: '085150859735' },
    { key: 'village_coordinates', value: '-3.558,102.602' },
    { key: 'primary_color', value: '#059669' },
    { key: 'accent_color', value: '#d97706' },
    { key: 'bank_bri', value: '0012-01-000456-789' },
    { key: 'bank_mandiri', value: '123-000-456-7890' },
    { key: 'bank_bni', value: '0098-765-4321' },
    { key: 'gopay_number', value: '085150859735' },
    { key: 'ovo_number', value: '085150859735' },
    { key: 'dana_number', value: '085150859735' },
  ];
  for (const s of settingsData) {
    await db.setting.create({ data: s });
  }
  console.log(`✅ ${settingsData.length} pengaturan dibuat\n`);

  // ============================================
  // 10. LITERASI DIGITAL
  // ============================================
  console.log('📚 Membuat materi literasi...');
  const literacy = await Promise.all([
    db.literacyMaterial.create({
      data: {
        title: 'Panduan Menggunakan Website Desa Digital',
        content: 'Pelajari cara mendaftar, login, dan menggunakan berbagai fitur website desa digital Desa Air Sempiang termasuk cara berbelanja di marketplace, mengajukan layanan desa, dan mengakses informasi terkini.',
        category: 'PANDUAN',
        author: 'Tim ICT Desa',
      },
    }),
    db.literacyMaterial.create({
      data: {
        title: 'Keamanan Digital: Melindungi Data Pribadi',
        content: 'Tips dan panduan tentang cara melindungi data pribadi saat bertransaksi online, mengenali penipuan digital, dan menjaga keamanan akun di platform digital. Penting untuk semua warga desa yang menggunakan layanan digital.',
        category: 'KEAMANAN',
        author: 'Tim ICT Desa',
      },
    }),
    db.literacyMaterial.create({
      data: {
        title: 'Cara Berjualan di Marketplace Desa',
        content: 'Panduan lengkap bagi pelaku UMKM desa untuk mulai berjualan di marketplace desa digital. Meliputi cara mendaftar sebagai penjual, mengunggah produk, mengatur harga, dan mengelola pesanan.',
        category: 'UMKM',
        author: 'Dinas Koperasi Kepahiang',
      },
    }),
    db.literacyMaterial.create({
      data: {
        title: 'Internet Sehat untuk Anak dan Remaja',
        content: 'Panduan bagi orang tua dan pendidik tentang cara mendampingi anak menggunakan internet dengan aman dan sehat. Mencakup pengaturan kontrol orang tua, memilih konten yang sesuai usia, dan mendetiksi tanda-tanda cyberbullying.',
        category: 'PENDIDIKAN',
        author: 'Relawan Digital Desa',
      },
    }),
  ]);
  console.log(`✅ ${literacy.length} materi literasi dibuat\n`);

  // ============================================
  // SELESAI
  // ============================================
  console.log('═══════════════════════════════════════════');
  console.log('✅ SEED BERHASIL!');
  console.log('═══════════════════════════════════════════');
  console.log('\n🔑 AKUN YANG TERSEDIA:');
  console.log('┌──────────────┬──────────────────────────────┬────────────┐');
  console.log('│ Role         │ Email/Username               │ Password   │');
  console.log('├──────────────┼──────────────────────────────┼────────────┤');
  console.log('│ Admin        │ admindesa                    │ admin123   │');
  console.log('│ User         │ lestarimutia613@gmail.com    │ user123    │');
  console.log('│ User         │ budi@example.com             │ user123    │');
  console.log('└──────────────┴──────────────────────────────┴────────────┘');
  console.log('\n📊 RINGKASAN DATA:');
  console.log(`  Admin: 1 | User: 2 | Produk: ${products.length} | Layanan: ${services.length}`);
  console.log(`  Berita: ${news.length} | Kursus: ${courses.length} | Kependudukan: ${residents.length}`);
  console.log(`  Literasi: ${literacy.length} | Pengaturan: ${settingsData.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
