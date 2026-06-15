-- ============================================================
-- DATABASE SQL LENGKAP - DESA AIR SEMPIANG DIGITAL
-- ============================================================
-- Gunakan SQL ini di Supabase SQL Editor untuk membuat
-- seluruh database dengan tabel, data awal, dan keamanan.
--
-- Supabase URL: https://yugkpgiugudkzwadtmfq.supabase.co
-- ============================================================

-- ============================================
-- 0. EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. ADMINS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'ADMIN',
  phone VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'USER',
  phone VARCHAR(50),
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) DEFAULT 0,
  image VARCHAR(500) DEFAULT '/placeholder-product.jpg',
  category VARCHAR(100),
  stock INT DEFAULT 0,
  seller VARCHAR(255) DEFAULT 'UMKM Desa Air Sempiang',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  total_amount DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'PENDING',
  payment_method VARCHAR(100),
  buyer_phone VARCHAR(50),
  buyer_name VARCHAR(255),
  bank_account VARCHAR(100),
  bank_name VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INT DEFAULT 1,
  price DECIMAL(12,2) DEFAULT 0
);

-- ============================================
-- 6. PAYMENT PROOFS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payment_proofs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50),
  buyer_name VARCHAR(255),
  buyer_phone VARCHAR(50),
  total_amount DECIMAL(12,2) DEFAULT 0,
  payment_method VARCHAR(100),
  items TEXT,
  status VARCHAR(50) DEFAULT 'PENDING',
  sent_to_whatsapp BOOLEAN DEFAULT FALSE,
  printed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. E-TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS e_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  order_id UUID REFERENCES orders(id),
  user_id UUID REFERENCES users(id),
  buyer_name VARCHAR(255) NOT NULL,
  buyer_phone VARCHAR(50) NOT NULL,
  buyer_email VARCHAR(255),
  items TEXT DEFAULT '[]',
  total_amount DECIMAL(12,2) DEFAULT 0,
  payment_method VARCHAR(100) DEFAULT 'QRIS',
  payment_status VARCHAR(50) DEFAULT 'PENDING',
  transaction_status VARCHAR(50) DEFAULT 'PENDING',
  qris_content TEXT,
  wh_sent_count INT DEFAULT 0,
  wh_last_sent_at TIMESTAMPTZ,
  notes TEXT,
  paid_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. NEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  content TEXT,
  image VARCHAR(500),
  author VARCHAR(255) DEFAULT 'Admin Desa',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. VILLAGE SERVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS village_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  requirements TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. CHAT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. COURSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor VARCHAR(255),
  category VARCHAR(100),
  image VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. LITERACY MATERIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS literacy_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  category VARCHAR(100),
  author VARCHAR(255),
  file_url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 13. RESIDENT DATA TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS resident_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(255) NOT NULL,
  total INT DEFAULT 0,
  male INT DEFAULT 0,
  female INT DEFAULT 0,
  description TEXT,
  year INT DEFAULT 2024,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 14. SERVICE APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS service_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_type VARCHAR(255) NOT NULL,
  applicant_name VARCHAR(255) NOT NULL,
  applicant_nik VARCHAR(50),
  form_data TEXT DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'PENDING',
  user_id UUID REFERENCES users(id),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 15. SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT DEFAULT ''
);

-- ============================================
-- 16. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_order_id ON payment_proofs(order_id);
CREATE INDEX IF NOT EXISTS idx_e_transactions_user_id ON e_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_e_transactions_status ON e_transactions(transaction_status);
CREATE INDEX IF NOT EXISTS idx_e_transactions_order_id ON e_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_village_services_category ON village_services(category);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_service_applications_status ON service_applications(status);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- ============================================
-- 17. ROW LEVEL SECURITY (RLS)
-- ============================================
-- Aktifkan RLS untuk semua tabel
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE e_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE village_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE literacy_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE resident_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policy: Service role (backend) bisa akses semua
-- anon key hanya bisa baca data publik
CREATE POLICY "Service role full access admins" ON admins FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access users" ON users FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access products" ON products FOR ALL USING (true) WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role full access orders" ON orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access order_items" ON order_items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access payment_proofs" ON payment_proofs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access e_transactions" ON e_transactions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access news" ON news FOR ALL USING (true) WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role full access village_services" ON village_services FOR ALL USING (true) WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role full access chat_messages" ON chat_messages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access courses" ON courses FOR ALL USING (true) WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role full access literacy_materials" ON literacy_materials FOR ALL USING (true) WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role full access resident_data" ON resident_data FOR ALL USING (true) WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role full access service_applications" ON service_applications FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access settings" ON settings FOR ALL USING (true) WITH CHECK (auth.role() = 'service_role');

-- Policy: Anon (publik) hanya bisa baca data yang boleh publik
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read news" ON news FOR SELECT USING (true);
CREATE POLICY "Public read village_services" ON village_services FOR SELECT USING (true);
CREATE POLICY "Public read courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Public read literacy_materials" ON literacy_materials FOR SELECT USING (true);
CREATE POLICY "Public read resident_data" ON resident_data FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

-- ============================================
-- 18. SEED DATA
-- ============================================

-- ADMIN (password: admin123, hash SHA256)
INSERT INTO admins (username, email, name, password, role, phone) VALUES
  ('admindesa', 'admin@desaairsempiang.id', 'Admin Desa', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'ADMIN', '085150859735');

-- USERS (password: user123, hash SHA256)
INSERT INTO users (email, name, password, role, phone, address) VALUES
  ('lestarimutia613@gmail.com', 'Mutia Lestari', 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f', 'USER', '085268596027', 'Desa Air Sempiang, Kec. Kabawetan, Kab. Kepahiang, Bengkulu'),
  ('budi@example.com', 'Budi Santoso', 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f', 'USER', '081234567890', 'Desa Air Sempiang, Kec. Kabawetan');

-- PRODUCTS
INSERT INTO products (name, description, price, category, stock, seller) VALUES
  ('Kopi Robusta Air Sempiang', 'Kopi robusta premium dari perkebunan Desa Air Sempiang, dipetik dan diolah secara tradisional oleh petani lokal. Rasa khas dengan aroma kuat dan aftertaste cokelat.', 75000, 'PERTANIAN', 50, 'UMKM Desa Air Sempiang'),
  ('Beras Organik Desa', 'Beras organik berkualitas tinggi dari sawah irigasi Desa Air Sempiang, ditanam tanpa pestisida kimia. Pulen dan harum saat dimasak.', 65000, 'PERTANIAN', 100, 'Kelompok Tani Makmur'),
  ('Madu Hutan Bengkulu', 'Madu murni dari hutan lindung sekitar Desa Air Sempiang, dikumpulkan oleh petani madu tradisional. Kaya antioksidan dan nutrisi alami.', 120000, 'UMKM', 30, 'Kelompok Petani Madu'),
  ('Kain Tenun Tradisional', 'Kain tenun khas Bengkulu buatan tangan pengrajin lokal Desa Air Sempiang dengan motif tradisional. Cocok untuk busana adat dan souvenir.', 250000, 'UMKM', 15, 'Sanggar Tenun Sejahtera'),
  ('Dodol Nanas', 'Dodol nanas lezat dari nanas segar kebun Desa Air Sempiang, camilan khas daerah yang cocok untuk oleh-oleh. Tersedia rasa original dan pandan.', 35000, 'UMKM', 80, 'UMKM Wanita Desa'),
  ('Cabai Rawit Kering', 'Cabai rawit kering pilihan dari ladang warga Desa Air Sempiang, pedasnya mantap untuk bumbu masakan. Dijemur alami di bawah sinar matahari.', 45000, 'PERTANIAN', 60, 'Kelompok Tani Makmur'),
  ('Keripik Pisang', 'Keripik pisang renyah dari UMKM wanita Desa Air Sempiang, tersedia rasa original dan pedas. Tanpa pengawet dan pewarna buatan.', 25000, 'UMKM', 100, 'UMKM Wanita Desa'),
  ('Minyak Kemiri', 'Minyak kemiri murni untuk perawatan rambut, diproduksi oleh kelompok wanita tani Desa Air Sempiang. Membantu menghitamkan dan menyuburkan rambut.', 55000, 'UMKM', 40, 'Kelompok Wanita Tani'),
  ('Jahe Merah Bubuk', 'Jahe merah bubuk premium dari perkebunan Desa Air Sempiang. Berkhasiat untuk menghangatkan tubuh dan menjaga daya tahan imun.', 40000, 'PERTANIAN', 45, 'Kelompok Tani Makmur'),
  ('Tas Anyaman Bambu', 'Tas anyaman bambu handmade buatan pengrajin Desa Air Sempiang. Desain modern dengan sentuhan tradisional, ramah lingkungan.', 85000, 'UMKM', 20, 'Sanggar Anyam Desa');

-- VILLAGE SERVICES
INSERT INTO village_services (name, description, category, requirements) VALUES
  ('Pembuatan KTP Elektronik', 'Layanan pembuatan Kartu Tanda Penduduk Elektronik (e-KTP) untuk warga Desa Air Sempiang. Proses pengurusan memakan waktu 7-14 hari kerja.', 'KEPENDUDUKAN', 'Fotokopi KK, Surat Pengantar RT/RW, Pas Foto 3x4 (2 lembar)'),
  ('Pembuatan Kartu Keluarga', 'Layanan pembuatan atau perubahan Kartu Keluarga (KK) untuk warga Desa Air Sempiang. Berlaku untuk penambahan, pengurangan, atau perubahan anggota keluarga.', 'KEPENDUDUKAN', 'KTP asli kepala keluarga, Akta nikah/cerai/kelahiran, Surat pengantar RT/RW'),
  ('Surat Keterangan Domisili', 'Layanan pembuatan surat keterangan domisili untuk keperluan administrasi, pekerjaan, atau pendidikan. Berlaku 6 bulan sejak diterbitkan.', 'SURAT', 'KTP asli, Fotokopi KTP, Surat pengantar RT/RW'),
  ('Surat Keterangan Tidak Mampu', 'Layanan pembuatan SKTM untuk keperluan bantuan sosial, keringanan biaya pendidikan, atau pengobatan. Memerlukan verifikasi lapangan oleh RT/RW.', 'SURAT', 'KTP asli, Fotokopi KK, Surat pengantar RT/RW, Surat keterangan penghasilan'),
  ('Surat Pengantar SKCK', 'Layanan pembuatan surat pengantar untuk mengurus Surat Keterangan Catatan Kepolisian (SKCK). Diperlukan untuk melamar pekerjaan formal.', 'SURAT', 'KTP asli, Fotokopi KTP, Pas Foto 4x6 (4 lembar), Surat pengantar RT/RW'),
  ('Izin Usaha Mikro Kecil', 'Layanan pengurusan izin usaha mikro kecil (IUMK) untuk pelaku UMKM di wilayah Desa Air Sempiang. Gratis dan diproses maksimal 3 hari kerja.', 'UMKM', 'KTP asli, Fotokopi KK, Pas foto 3x4, Surat pengantar RT/RW, Denah lokasi usaha'),
  ('Bantuan Pertanian', 'Layanan pendampingan dan bantuan alat pertanian untuk petani di Desa Air Sempiang melalui program desa. Meliputi bantuan benih, pupuk, dan alat pertanian.', 'PERTANIAN', 'KTP asli, Fotokopi KK, Surat keterangan petani dari Pokdarwan'),
  ('Konsultasi Pendidikan', 'Layanan konsultasi pendidikan dan informasi beasiswa untuk anak-anak warga Desa Air Sempiang. Tersedia informasi beasiswa dari pemerintah dan swasta.', 'PENDIDIKAN', 'Tidak ada persyaratan khusus, cukup datang ke kantor desa'),
  ('Pelaporan Online', 'Layanan pelaporan masalah infrastruktur, keamanan, dan keluhan warga secara online melalui website desa. Terverifikasi dalam 1x24 jam.', 'LAINNYA', 'Tidak ada persyaratan khusus'),
  ('Surat Keterangan Usaha', 'Layanan pembuatan surat keterangan usaha untuk keperluan pinjaman bank, pendaftaran BPJS, atau keperluan administrasi lainnya.', 'UMKM', 'KTP asli, Fotokopi KK, Foto lokasi usaha, Surat pengantar RT/RW');

-- NEWS
INSERT INTO news (title, content, author) VALUES
  ('Peluncuran Website Desa Digital Terintegrasi', 'Desa Air Sempiang dengan bangga meluncurkan website desa digital terintegrasi sebagai upaya optimalisasi layanan pendidikan, pemberdayaan UMKM dan pertanian, serta penguatan Program Desa Cantik. Website ini menyediakan berbagai layanan digital untuk memudahkan warga dalam mengakses informasi dan layanan desa secara online.\n\nMelalui platform ini, warga dapat mengakses layanan kependudukan, marketplace produk UMKM lokal, serta berbagai program pemberdayaan masyarakat. Inisiatif ini didukung penuh oleh Pemerintah Kabupaten Kepahiang dan menjadi pilot project untuk desa-dana lain di Provinsi Bengkulu.\n\nKepala Desa Air Sempiang menyampaikan bahwa digitalisasi layanan desa merupakan langkah strategis untuk meningkatkan transparansi, efisiensi, dan aksesibilitas layanan publik bagi seluruh warga desa.', 'Admin Desa'),
  ('Program Desa Cantik 2024: Peningkatan Infrastruktur Digital', 'Dalam rangka Program Desa Cantik tahun 2024, Desa Air Sempiang mendapat alokasi dana untuk peningkatan infrastruktur digital. Program ini mencakup pemasangan jaringan internet desa, pembangunan balai desa digital, dan pelatihan literasi digital bagi warga.\n\nKepala Desa menyampaikan bahwa program ini diharapkan dapat meningkatkan kualitas hidup warga dan membuka peluang ekonomi baru melalui pemanfaatan teknologi digital. Selain itu, program ini juga mendukung pengembangan UMKM lokal agar dapat memasarkan produknya secara lebih luas melalui platform digital.\n\nProgram ini ditargetkan selesai dalam waktu 6 bulan dan akan dilakukan secara bertahap mulai dari penyediaan infrastruktur hingga pelatihan penggunaan teknologi bagi warga.', 'Admin Desa'),
  ('Pelatihan Pertanian Organik untuk Petani Desa', 'Dinas Pertanian Kabupaten Kepahiang bekerja sama dengan Desa Air Sempiang mengadakan pelatihan pertanian organik bagi para petani lokal. Pelatihan ini bertujuan untuk meningkatkan kualitas dan nilai jual produk pertanian desa.\n\nPeserta akan belajar teknik bertanam organik, pengendalian hama alami, dan sertifikasi produk organik. Hasil panen organik dari desa diharapkan dapat dipasarkan melalui marketplace desa dengan harga yang lebih kompetitif, sehingga dapat meningkatkan pendapatan petani secara signifikan.\n\nPelatihan akan berlangsung selama 3 hari di Balai Desa Air Sempiang dengan narasumber dari Dinas Pertanian dan praktisi pertanian organik berpengalaman.', 'Admin Desa'),
  ('Festival UMKM Desa Air Sempiang 2024', 'Desa Air Sempiang akan menggelar Festival UMKM tahunan yang menampilkan berbagai produk unggulan desa seperti kopi robusta, kain tenun, madu hutan, dan aneka olahan makanan tradisional. Festival ini dijadwalkan berlangsung selama tiga hari dan akan dihadiri oleh pembeli dari berbagai daerah di Provinsi Bengkulu.\n\nAcara ini juga akan dimeriahkan dengan pertunjukan seni budaya lokal dan lomba memasak bahan-bahan lokal. Warga yang ingin berpartisipasi sebagai peserta dapat mendaftar di kantor desa atau melalui website desa digital ini.\n\nFestival UMKM ini merupakan agenda tahunan yang bertujuan untuk mempromosikan produk lokal dan meningkatkan ekonomi warga desa melalui pemasaran langsung kepada konsumen.', 'Admin Desa'),
  ('Bantuan Sosial Tahap III Telah Disalurkan', 'Pemerintah Desa Air Sempiang telah menyalurkan bantuan sosial tahap III kepada 150 keluarga penerima manfaat. Bantuan ini meliputi sembako, masker, dan obat-obatan dasar.\n\nPenyaluran dilakukan secara bertahap di Balai Desa dengan menerapkan protokol kesehatan yang ketat. Warga penerima diharapkan dapat memanfaatkan bantuan ini dengan baik dan tetap menjaga kesehatan bersama.\n\nKepala Desa mengucapkan terima kasih kepada pemerintah kabupaten dan provinsi yang telah mendukung program bantuan sosial ini.', 'Admin Desa'),
  ('Pembangunan Jalan Desa Tahap II Dimulai', 'Pembangunan jalan desa tahap II resmi dimulai pada minggu ini. Proyek ini mencakup perbaikan dan pengerasan jalan sepanjang 2,5 km yang menghubungkan dusun utara dengan dusun selatan.\n\nPembangunan ini dibiayai dari dana desa dan bantuan provinsi dengan total anggaran Rp 850 juta. Diperkirakan akan selesai dalam waktu 4 bulan dan sangat diharapkan dapat memperlancar akses transportasi warga serta distribusi hasil pertanian.\n\nWarga dimohon untuk berhati-hati saat melewati area pembangunan dan menggunakan jalur alternatif yang telah disediakan.', 'Admin Desa');

-- COURSES
INSERT INTO courses (title, description, instructor, category) VALUES
  ('Literasi Digital Dasar', 'Pelatihan dasar penggunaan komputer, internet, dan aplikasi digital untuk warga desa. Materi mencakup pengenalan perangkat, browsing, email, dan media sosial.', 'Tim ICT Desa', 'TEKNOLOGI'),
  ('Pemasaran Digital UMKM', 'Pelatihan strategi pemasaran digital untuk pelaku UMKM desa meliputi penggunaan media sosial, marketplace, dan teknik fotografi produk.', 'Dinas Koperasi Kepahiang', 'UMKM'),
  ('Pertanian Organik Modern', 'Kursus teknik pertanian organik dengan teknologi modern, termasuk pengomposan, pengendalian hama alami, dan irigasi hemat air.', 'Penyuluh Pertanian Kabupaten', 'PERTANIAN'),
  ('Keuangan Desa & Pengelolaan Dana', 'Pelatihan pengelolaan keuangan desa, APBDes, dan transparansi anggaran untuk perangkat desa dan BPD.', 'Inspektorat Kabupaten Kepahiang', 'PEMERINTAHAN'),
  ('Keterampilan Tenun Tradisional', 'Pelatihan keterampilan menenun kain tradisional Bengkulu untuk melestarikan budaya dan meningkatkan pendapatan warga.', 'Sanggar Tenun Sejahtera', 'BUDAYA'),
  ('Bahasa Inggris untuk Pariwisata', 'Kursus bahasa Inggris dasar untuk warga yang bergerak di sektor pariwisata dan hospitality desa.', 'Relawan Pengajar', 'BAHASA'),
  ('Akuntansi Dasar untuk UMKM', 'Pelatihan pencatatan keuangan sederhana untuk pelaku UMKM desa agar dapat mengelola keuangan usaha dengan lebih baik dan transparan.', 'Dinas Koperasi Kepahiang', 'UMKM'),
  ('Pengolahan Hasil Pertanian', 'Pelatihan pengolahan produk pertanian menjadi produk olahan bernilai jual tinggi seperti kopi bubuk, dodol, dan keripik.', 'Penyuluh Pertanian Kabupaten', 'PERTANIAN');

-- RESIDENT DATA
INSERT INTO resident_data (category, total, male, female, description, year) VALUES
  ('Total Penduduk', 3245, 1642, 1603, 'Jumlah penduduk keseluruhan Desa Air Sempiang berdasarkan data monografi desa terbaru', 2024),
  ('Kepala Keluarga', 856, 0, 0, 'Jumlah kepala keluarga yang tercatat di Desa Air Sempiang', 2024),
  ('Usia Produktif (18-55)', 1890, 955, 935, 'Penduduk usia produktif yang berpotensi menggerakkan perekonomian desa', 2024),
  ('Anak-anak (0-17 tahun)', 895, 456, 439, 'Jumlah penduduk usia anak-anak yang membutuhkan layanan pendidikan dan kesehatan', 2024),
  ('Lansia (55+ tahun)', 460, 231, 229, 'Jumlah penduduk lanjut usia yang memerlukan perhatian khusus dalam layanan sosial', 2024),
  ('Pelajar/Mahasiswa', 345, 175, 170, 'Jumlah pelajar dan mahasiswa yang aktif menempuh pendidikan', 2024),
  ('Pelaku UMKM', 125, 52, 73, 'Jumlah pelaku Usaha Mikro Kecil Menengah yang terdaftar di Desa Air Sempiang', 2024),
  ('Petani', 480, 320, 160, 'Jumlah petani aktif yang mengelola lahan pertanian di wilayah desa', 2024);

-- LITERACY MATERIALS
INSERT INTO literacy_materials (title, content, category, author) VALUES
  ('Panduan Menggunakan Website Desa Digital', 'Pelajari cara mendaftar, login, dan menggunakan berbagai fitur website desa digital Desa Air Sempiang termasuk cara berbelanja di marketplace, mengajukan layanan desa, dan mengakses informasi terkini.', 'PANDUAN', 'Tim ICT Desa'),
  ('Keamanan Digital: Melindungi Data Pribadi', 'Tips dan panduan tentang cara melindungi data pribadi saat bertransaksi online, mengenali penipuan digital, dan menjaga keamanan akun di platform digital. Penting untuk semua warga desa yang menggunakan layanan digital.', 'KEAMANAN', 'Tim ICT Desa'),
  ('Cara Berjualan di Marketplace Desa', 'Panduan lengkap bagi pelaku UMKM desa untuk mulai berjualan di marketplace desa digital. Meliputi cara mendaftar sebagai penjual, mengunggah produk, mengatur harga, dan mengelola pesanan.', 'UMKM', 'Dinas Koperasi Kepahiang'),
  ('Internet Sehat untuk Anak dan Remaja', 'Panduan bagi orang tua dan pendidik tentang cara mendampingi anak menggunakan internet dengan aman dan sehat. Mencakup pengaturan kontrol orang tua, memilih konten yang sesuai usia, dan mendetiksi tanda-tanda cyberbullying.', 'PENDIDIKAN', 'Relawan Digital Desa');

-- SETTINGS
INSERT INTO settings (key, value) VALUES
  ('village_name', 'Desa Air Sempiang'),
  ('village_description', 'Kecamatan Kabawetan, Kabupaten Kepahiang, Provinsi Bengkulu'),
  ('village_address', 'Kec. Kabawetan, Kab. Kepahiang, Prov. Bengkulu'),
  ('village_phone', '085150859735'),
  ('village_email', 'info@desaairsempiang.id'),
  ('village_whatsapp', '085150859735'),
  ('village_coordinates', '-3.558,102.602'),
  ('primary_color', '#059669'),
  ('accent_color', '#d97706'),
  ('bank_bri', '0012-01-000456-789'),
  ('bank_mandiri', '123-000-456-7890'),
  ('bank_bni', '0098-765-4321'),
  ('gopay_number', '085150859735'),
  ('ovo_number', '085150859735'),
  ('dana_number', '085150859735');

-- ============================================
-- 19. UPDATED_AT TRIGGER
-- ============================================
-- Fungsi untuk auto-update kolom updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Pasang trigger di semua tabel yang punya updated_at
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_proofs_updated_at BEFORE UPDATE ON payment_proofs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_e_transactions_updated_at BEFORE UPDATE ON e_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_village_services_updated_at BEFORE UPDATE ON village_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_literacy_materials_updated_at BEFORE UPDATE ON literacy_materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resident_data_updated_at BEFORE UPDATE ON resident_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_applications_updated_at BEFORE UPDATE ON service_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SELESAI! Database siap digunakan.
-- ============================================================
-- Akun yang tersedia:
--   Admin:  username = admindesa  | password = admin123
--   User:   email = lestarimutia613@gmail.com | password = user123
--   User:   email = budi@example.com | password = user123
-- ============================================================
