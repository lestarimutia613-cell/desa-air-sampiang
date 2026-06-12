'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  Users,
  ShoppingBag,
  Tractor,
  Eye,
  TrendingUp,
  Package,
  FileText,
  Clock,
  DollarSign,
  Phone,
  MessageCircle,
  Mail,
  HelpCircle,
  ShieldCheck,
  HeadphonesIcon,
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalNews: number;
  totalServices: number;
  pendingOrders: number;
  totalRevenue: { _sum: { totalAmount: number | null } };
}

export default function KonsolPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin')
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge className="bg-emerald-100 text-emerald-800 mb-3"><BarChart3 className="h-3 w-3 mr-1 inline" /> Console / Dashboard</Badge>
          <h1 className="text-3xl font-bold text-emerald-900 mb-3">Statistik & Monitoring Desa</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pusat monitoring dan analitik desa. Pantau perkembangan layanan, kependudukan, UMKM, dan pertanian secara real-time.
          </p>
        </div>

        <Tabs defaultValue="statistik" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-1 h-auto p-1">
            <TabsTrigger value="statistik" className="text-xs py-2">
              <BarChart3 className="h-3.5 w-3.5 mr-1" /> Statistik
            </TabsTrigger>
            <TabsTrigger value="layanan" className="text-xs py-2">
              <Eye className="h-3.5 w-3.5 mr-1" /> Layanan
            </TabsTrigger>
            <TabsTrigger value="pengunjung" className="text-xs py-2">
              <TrendingUp className="h-3.5 w-3.5 mr-1" /> Analitik
            </TabsTrigger>
            <TabsTrigger value="kependudukan" className="text-xs py-2">
              <Users className="h-3.5 w-3.5 mr-1" /> Penduduk
            </TabsTrigger>
            <TabsTrigger value="umkm" className="text-xs py-2">
              <ShoppingBag className="h-3.5 w-3.5 mr-1" /> UMKM
            </TabsTrigger>
            <TabsTrigger value="pertanian" className="text-xs py-2">
              <Tractor className="h-3.5 w-3.5 mr-1" /> Pertanian
            </TabsTrigger>
          </TabsList>

          {/* Tab: Statistik Desa */}
          <TabsContent value="statistik">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Memuat statistik...</div>
            ) : stats ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Pengguna', value: stats.totalUsers, icon: <Users className="h-6 w-6" />, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 text-blue-700' },
                    { label: 'Total Produk', value: stats.totalProducts, icon: <ShoppingBag className="h-6 w-6" />, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50 text-emerald-700' },
                    { label: 'Total Pesanan', value: stats.totalOrders, icon: <Package className="h-6 w-6" />, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 text-purple-700' },
                    { label: 'Pesanan Pending', value: stats.pendingOrders, icon: <Clock className="h-6 w-6" />, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50 text-amber-700' },
                    { label: 'Total Berita', value: stats.totalNews, icon: <FileText className="h-6 w-6" />, color: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-50 text-cyan-700' },
                    { label: 'Total Layanan', value: stats.totalServices, icon: <ShieldCheck className="h-6 w-6" />, color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50 text-pink-700' },
                    { label: 'Pendapatan', value: formatPrice(stats.totalRevenue._sum.totalAmount || 0), icon: <DollarSign className="h-6 w-6" />, color: 'from-green-500 to-green-600', bg: 'bg-green-50 text-green-700' },
                    { label: 'Online', value: 'Aktif', icon: <Eye className="h-6 w-6" />, color: 'from-teal-500 to-teal-600', bg: 'bg-teal-50 text-teal-700' },
                  ].map((stat, i) => (
                    <Card key={i} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-5">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${stat.bg}`}>
                          {stat.icon}
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Summary Cards */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="border-emerald-200">
                    <CardHeader>
                      <CardTitle className="text-emerald-800 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" /> Ringkasan Layanan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { label: 'Kependudukan', progress: 85, color: 'bg-blue-500' },
                          { label: 'Surat-Menyurat', progress: 72, color: 'bg-emerald-500' },
                          { label: 'UMKM & Pertanian', progress: 68, color: 'bg-orange-500' },
                          { label: 'Pendidikan', progress: 54, color: 'bg-purple-500' },
                          { label: 'Lainnya', progress: 40, color: 'bg-gray-400' },
                        ].map((item, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-700">{item.label}</span>
                              <span className="text-gray-500">{item.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div className={`${item.color} h-2 rounded-full transition-all`} style={{ width: `${item.progress}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-emerald-200">
                    <CardHeader>
                      <CardTitle className="text-emerald-800 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" /> Pertumbuhan Desa
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { label: 'Pengguna Terdaftar', value: '+12%', desc: 'dari bulan lalu', up: true },
                          { label: 'Transaksi Marketplace', value: '+24%', desc: 'dari bulan lalu', up: true },
                          { label: 'Layanan Selesai', value: '+8%', desc: 'dari bulan lalu', up: true },
                          { label: 'Kursus Diikuti', value: '+15%', desc: 'dari bulan lalu', up: true },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm text-gray-800">{item.label}</p>
                              <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">{item.value}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">Gagal memuat statistik</div>
            )}
          </TabsContent>

          {/* Tab: Monitoring Layanan */}
          <TabsContent value="layanan">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Pembuatan KTP', status: 'Aktif', processed: 24, pending: 3, avg: '3 hari' },
                { name: 'Pembuatan KK', status: 'Aktif', processed: 18, pending: 2, avg: '5 hari' },
                { name: 'Surat Domisili', status: 'Aktif', processed: 42, pending: 5, avg: '1 hari' },
                { name: 'SKTM', status: 'Aktif', processed: 15, pending: 1, avg: '2 hari' },
                { name: 'Izin Usaha', status: 'Aktif', processed: 8, pending: 2, avg: '7 hari' },
                { name: 'Bantuan Pertanian', status: 'Aktif', processed: 12, pending: 4, avg: '14 hari' },
              ].map((svc, i) => (
                <Card key={i} className="border-emerald-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-sm">{svc.name}</h3>
                      <Badge className="bg-green-100 text-green-800 text-[10px]">{svc.status}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-blue-50 rounded-lg p-2">
                        <p className="text-lg font-bold text-blue-800">{svc.processed}</p>
                        <p className="text-[10px] text-blue-600">Diproses</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-2">
                        <p className="text-lg font-bold text-amber-800">{svc.pending}</p>
                        <p className="text-[10px] text-amber-600">Pending</p>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-2">
                        <p className="text-lg font-bold text-emerald-800">{svc.avg}</p>
                        <p className="text-[10px] text-emerald-600">Rata-rata</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab: Analitik Pengunjung */}
          <TabsContent value="pengunjung">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-800 text-base">Kunjungan Website</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day, i) => {
                      const visits = [45, 62, 58, 71, 84, 95, 53];
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-16">{day}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full transition-all"
                              style={{ width: `${(visits[i] / 100) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700 w-8">{visits[i]}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 p-3 bg-emerald-50 rounded-lg flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">+18% kunjungan</p>
                      <p className="text-xs text-emerald-600">dibanding minggu lalu</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-800 text-base">Sumber Kunjungan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { source: 'Langsung', pct: 35, color: 'bg-emerald-500' },
                      { source: 'WhatsApp', pct: 28, color: 'bg-green-500' },
                      { source: 'Media Sosial', pct: 22, color: 'bg-blue-500' },
                      { source: 'Pencarian Google', pct: 10, color: 'bg-purple-500' },
                      { source: 'Lainnya', pct: 5, color: 'bg-gray-400' },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{item.source}</span>
                          <span className="font-medium text-gray-900">{item.pct}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div className={`${item.color} h-3 rounded-full`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Grafik Kependudukan */}
          <TabsContent value="kependudukan">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Total Penduduk', value: '3.245', male: '1.642', female: '1.603', icon: <Users className="h-6 w-6" />, color: 'bg-blue-50 text-blue-700' },
                { label: 'Kepala Keluarga', value: '856', male: '-', female: '-', icon: <Users className="h-6 w-6" />, color: 'bg-emerald-50 text-emerald-700' },
                { label: 'Usia Produktif', value: '1.890', male: '955', female: '935', icon: <TrendingUp className="h-6 w-6" />, color: 'bg-orange-50 text-orange-700' },
                { label: 'Anak-anak (0-17)', value: '895', male: '456', female: '439', icon: <Users className="h-6 w-6" />, color: 'bg-pink-50 text-pink-700' },
                { label: 'Lansia (55+)', value: '460', male: '231', female: '229', icon: <Users className="h-6 w-6" />, color: 'bg-purple-50 text-purple-700' },
                { label: 'Pelajar/Mahasiswa', value: '345', male: '175', female: '170', icon: <Users className="h-6 w-6" />, color: 'bg-cyan-50 text-cyan-700' },
              ].map((item, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${item.color}`}>
                      {item.icon}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                    <p className="text-sm text-gray-500 mb-2">{item.label}</p>
                    {(item.male !== '-' || item.female !== '-') && (
                      <div className="flex gap-2">
                        {item.male !== '-' && <Badge variant="outline" className="text-[10px]">L: {item.male}</Badge>}
                        {item.female !== '-' && <Badge variant="outline" className="text-[10px]">P: {item.female}</Badge>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Population Distribution */}
            <Card className="mt-6 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-800 text-base">Distribusi Usia Penduduk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { group: '0-14 tahun', pct: 27.6, color: 'bg-pink-400' },
                    { group: '15-24 tahun', pct: 17.3, color: 'bg-blue-400' },
                    { group: '25-34 tahun', pct: 18.5, color: 'bg-emerald-400' },
                    { group: '35-44 tahun', pct: 16.2, color: 'bg-orange-400' },
                    { group: '45-54 tahun', pct: 10.5, color: 'bg-purple-400' },
                    { group: '55-64 tahun', pct: 5.8, color: 'bg-cyan-400' },
                    { group: '65+ tahun', pct: 4.1, color: 'bg-gray-400' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-24">{item.group}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                        <div className={`${item.color} h-full rounded-full flex items-center justify-end pr-2`}
                          style={{ width: `${item.pct * 3}%` }}>
                          <span className="text-[10px] font-bold text-white">{item.pct}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Grafik UMKM */}
          <TabsContent value="umkm">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-800 text-base">Kategori UMKM</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Makanan & Minuman', count: 15, pct: 36, color: 'bg-orange-400' },
                      { name: 'Kerajinan Tangan', count: 10, pct: 24, color: 'bg-pink-400' },
                      { name: 'Pertanian', count: 8, pct: 19, color: 'bg-green-400' },
                      { name: 'Jasa', count: 5, pct: 12, color: 'bg-blue-400' },
                      { name: 'Lainnya', count: 4, pct: 9, color: 'bg-gray-400' },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{item.name}</span>
                          <span className="font-medium">{item.count} usaha ({item.pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div className={`${item.color} h-3 rounded-full`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-800 text-base">Performa Marketplace</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'Produk Terjual Bulan Ini', value: '156', change: '+23%', up: true },
                      { label: 'Total Transaksi', value: 'Rp 12.4 Jt', change: '+18%', up: true },
                      { label: 'Rata-rata Nilai Pesanan', value: 'Rp 79.500', change: '+5%', up: true },
                      { label: 'Produk Aktif', value: '8', change: '0%', up: false },
                      { label: 'Penjual Aktif', value: '5', change: '+2', up: true },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{item.value}</span>
                          <Badge className={item.up ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                            {item.change}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Grafik Pertanian */}
          <TabsContent value="pertanian">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-800 text-base">Komoditas Pertanian</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Kopi Robusta', area: '120 Ha', yield: '8.4 ton', pct: 35 },
                      { name: 'Padi Organik', area: '85 Ha', yield: '12.6 ton', pct: 25 },
                      { name: 'Cabai', area: '25 Ha', yield: '3.2 ton', pct: 15 },
                      { name: 'Nanas', area: '20 Ha', yield: '5.1 ton', pct: 12 },
                      { name: 'Lainnya', area: '50 Ha', yield: '4.8 ton', pct: 13 },
                    ].map((item, i) => (
                      <div key={i} className="p-3 bg-green-50 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm text-green-900">{item.name}</span>
                          <Badge className="bg-green-200 text-green-800 text-[10px]">{item.pct}%</Badge>
                        </div>
                        <div className="flex gap-4 text-xs text-green-700">
                          <span>Luas: {item.area}</span>
                          <span>Hasil: {item.yield}</span>
                        </div>
                        <div className="w-full bg-green-100 rounded-full h-2 mt-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-800 text-base">Statistik Pertanian</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'Total Lahan Pertanian', value: '300 Ha', icon: <Tractor className="h-4 w-4" /> },
                      { label: 'Petani Terdaftar', value: '285', icon: <Users className="h-4 w-4" /> },
                      { label: 'Kelompok Tani', value: '12', icon: <Users className="h-4 w-4" /> },
                      { label: 'Produksi Tahun Ini', value: '34.1 ton', icon: <TrendingUp className="h-4 w-4" /> },
                      { label: 'Pertanian Organik', value: '45%', icon: <Eye className="h-4 w-4" /> },
                      { label: 'Bantuan Terdistribusi', value: 'Rp 85 Jt', icon: <DollarSign className="h-4 w-4" /> },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="text-green-600">{item.icon}</div>
                          <span className="text-sm text-gray-700">{item.label}</span>
                        </div>
                        <span className="font-bold text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Contact Section */}
        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <HeadphonesIcon className="h-5 w-5" /> Butuh Bantuan?
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <a href="https://wa.me/6285150859735" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-green-50 hover:bg-green-100 border border-green-200 transition-colors">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-800 text-sm">WhatsApp</p>
                <p className="text-xs text-green-600">085150859735</p>
              </div>
            </a>
            <a href="mailto:admin@desaairsempiang.id"
              className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-blue-800 text-sm">Email</p>
                <p className="text-xs text-blue-600">admin@desaairsempiang.id</p>
              </div>
            </a>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-emerald-800 text-sm">FAQ</p>
                <p className="text-xs text-emerald-600">Pertanyaan umum</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
