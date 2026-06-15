-- Supabase Schema for Desa Air Sempiang Digital Village
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ADMINS TABLE
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
-- USERS TABLE
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
-- PRODUCTS TABLE
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
-- ORDERS TABLE
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
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INT DEFAULT 1,
  price DECIMAL(12,2) DEFAULT 0
);

-- ============================================
-- PAYMENT PROOFS TABLE
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
-- NEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  content TEXT,
  image VARCHAR(500),
  author VARCHAR(255) DEFAULT 'Admin Desa',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VILLAGE SERVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS village_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  requirements TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CHAT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255),
  role VARCHAR(50),
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COURSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor VARCHAR(255),
  category VARCHAR(100),
  image VARCHAR(500),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LITERACY MATERIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS literacy_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  category VARCHAR(100),
  author VARCHAR(255),
  file_url VARCHAR(500),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RESIDENT DATA TABLE
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
-- SERVICE APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS service_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_type VARCHAR(255) NOT NULL,
  applicant_name VARCHAR(255) NOT NULL,
  applicant_nik VARCHAR(16),
  form_data JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'PENDING',
  user_id UUID REFERENCES users(id),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- E-TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS e_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  order_id UUID REFERENCES orders(id),
  user_id UUID REFERENCES users(id),
  buyer_name VARCHAR(255) NOT NULL,
  buyer_phone VARCHAR(50) NOT NULL,
  buyer_email VARCHAR(255),
  items JSONB NOT NULL DEFAULT '[]',
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
-- SETTINGS TABLE (Key-Value)
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_order_id ON payment_proofs(order_id);
CREATE INDEX IF NOT EXISTS idx_news_sort_order ON news(sort_order);
CREATE INDEX IF NOT EXISTS idx_village_services_category ON village_services(category);
CREATE INDEX IF NOT EXISTS idx_village_services_sort_order ON village_services(sort_order);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_sort_order ON courses(sort_order);
CREATE INDEX IF NOT EXISTS idx_literacy_materials_category ON literacy_materials(category);
CREATE INDEX IF NOT EXISTS idx_literacy_materials_sort_order ON literacy_materials(sort_order);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_e_transactions_user_id ON e_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_e_transactions_status ON e_transactions(transaction_status);
CREATE INDEX IF NOT EXISTS idx_e_transactions_invoice ON e_transactions(invoice_number);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'admins', 'users', 'products', 'orders', 'payment_proofs',
    'news', 'village_services', 'courses', 'literacy_materials',
    'resident_data', 'settings'
  ]
  LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
      t
    );
  END LOOP;
END;
$$;

-- ============================================
-- SEED DATA: Default Admin
-- ============================================
-- Password: admin123 (SHA-256 hashed)
INSERT INTO admins (username, name, password, role) VALUES
  ('admindesa', 'Admin Desa', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'ADMIN')
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- SEED DATA: Default Settings
-- ============================================
INSERT INTO settings (key, value) VALUES
  ('village_name', 'Desa Air Sempiang'),
  ('village_description', 'Kecamatan Kabawetan, Kabupaten Kepahiang, Provinsi Bengkulu. Website Desa Digital Terintegrasi sebagai Upaya Optimalisasi Layanan Pendidikan, Pemberdayaan UMKM dan Pertanian, serta Penguatan Program Desa Cantik'),
  ('village_address', 'Kec. Kabawetan, Kab. Kepahiang, Prov. Bengkulu'),
  ('village_phone', '085150859735'),
  ('village_email', 'info@desaairsempiang.id'),
  ('village_whatsapp', '085150859735'),
  ('village_coordinates', '-3.558,102.602'),
  ('primary_color', '#059669'),
  ('accent_color', '#d97706'),
  ('facebook_url', ''),
  ('instagram_url', ''),
  ('youtube_url', ''),
  ('bank_bri', '0012-01-000456-789'),
  ('bank_mandiri', '123-000-456-7890'),
  ('bank_bni', '0098-765-4321'),
  ('gopay_number', '085150859735'),
  ('ovo_number', '085150859735'),
  ('dana_number', '085150859735')
ON CONFLICT (key) DO NOTHING;
