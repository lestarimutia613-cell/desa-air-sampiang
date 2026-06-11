'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  ClipboardList,
  Building,
  Tractor,
  GraduationCap,
  MoreHorizontal,
  HeadphonesIcon,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  requirements: string | null;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'KEPENDUDUKAN': <ClipboardList className="h-5 w-5" />,
  'SURAT': <FileText className="h-5 w-5" />,
  'UMKM': <Building className="h-5 w-5" />,
  'PERTANIAN': <Tractor className="h-5 w-5" />,
  'PENDIDIKAN': <GraduationCap className="h-5 w-5" />,
  'LAINNYA': <MoreHorizontal className="h-5 w-5" />,
};

const categoryColors: Record<string, string> = {
  'KEPENDUDUKAN': 'bg-blue-100 text-blue-800',
  'SURAT': 'bg-purple-100 text-purple-800',
  'UMKM': 'bg-orange-100 text-orange-800',
  'PERTANIAN': 'bg-green-100 text-green-800',
  'PENDIDIKAN': 'bg-cyan-100 text-cyan-800',
  'LAINNYA': 'bg-gray-100 text-gray-800',
};

function LayananDesaTab() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => { setServices(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['ALL', ...Array.from(new Set(services.map((s) => s.category)))];
  const filtered = selectedCategory === 'ALL' ? services : services.filter((s) => s.category === selectedCategory);

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            {cat === 'ALL' ? 'Semua' : cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-3" />
                <div className="h-4 bg-gray-100 rounded mb-2" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow border-emerald-100">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryColors[service.category] || 'bg-gray-100 text-gray-800'}`}>
                    {categoryIcons[service.category] || <FileText className="h-5 w-5" />}
                  </div>
                  <Badge className={categoryColors[service.category] || 'bg-gray-100 text-gray-800'}>
                    {service.category}
                  </Badge>
                </div>
                <h3 className="font-bold text-emerald-900 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                {service.requirements && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-amber-800 mb-1">Persyaratan:</p>
                    <p className="text-xs text-amber-700">{service.requirements}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Box */}
      <Card className="mt-12 border-emerald-200 bg-emerald-50">
        <CardContent className="p-6 text-center">
          <h3 className="font-bold text-emerald-800 mb-2">Butuh Bantuan?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Hubungi kami melalui WhatsApp untuk bantuan pengurusan layanan desa
          </p>
          <a
            href="https://wa.me/6285150859735"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Hubungi via WhatsApp
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

function KonsolTab() {
  return (
    <div>
      {/* Contact Methods */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card className="hover:shadow-lg transition-shadow border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <h3 className="font-bold text-green-800 mb-2 text-lg">WhatsApp</h3>
            <p className="text-sm text-gray-600 mb-4">Respon cepat melalui WhatsApp untuk konsultasi dan bantuan</p>
            <a href="https://wa.me/6285150859735" target="_blank" rel="noopener noreferrer">
              <Button className="bg-green-600 hover:bg-green-500">
                <MessageCircle className="mr-2 h-4 w-4" /> Chat WhatsApp
              </Button>
            </a>
            <p className="text-xs text-gray-400 mt-2">085150859735</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-blue-800 mb-2 text-lg">Telepon</h3>
            <p className="text-sm text-gray-600 mb-4">Hubungi kantor desa langsung melalui telepon pada jam kerja</p>
            <a href="tel:085150859735">
              <Button className="bg-blue-600 hover:bg-blue-500">
                <Phone className="mr-2 h-4 w-4" /> Hubungi
              </Button>
            </a>
            <p className="text-xs text-gray-400 mt-2">085150859735</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-purple-800 mb-2 text-lg">Email</h3>
            <p className="text-sm text-gray-600 mb-4">Kirim email untuk pertanyaan atau pengaduan yang memerlukan dokumentasi</p>
            <a href="mailto:info@desaairsempiang.id">
              <Button className="bg-purple-600 hover:bg-purple-500">
                <Mail className="mr-2 h-4 w-4" /> Kirim Email
              </Button>
            </a>
            <p className="text-xs text-gray-400 mt-2">info@desaairsempiang.id</p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-emerald-900 text-center mb-8">Pertanyaan Umum (FAQ)</h2>
        <div className="space-y-4">
          {[
            {
              q: 'Bagaimana cara mengurus KTP di Desa Air Sempiang?',
              a: 'Bawa fotokopi KK, surat pengantar RT/RW, dan pas foto 3x4 (2 lembar) ke kantor desa pada hari kerja Senin-Jumat pukul 08:00-16:00 WIB. Proses pembuatan memakan waktu 7-14 hari kerja.',
            },
            {
              q: 'Bagaimana cara berbelanja di Marketplace Desa?',
              a: 'Daftar atau masuk terlebih dahulu, pilih produk yang diinginkan, tambahkan ke keranjang, lalu checkout dan pilih metode pembayaran (transfer bank atau e-wallet). Setelah pembayaran dikonfirmasi, pesanan akan diproses.',
            },
            {
              q: 'Apakah ada biaya untuk mengakses layanan desa online?',
              a: 'Tidak, semua layanan desa digital dapat diakses secara gratis oleh warga Desa Air Sempiang. Biaya hanya berlaku untuk pembelian produk di marketplace.',
            },
            {
              q: 'Bagaimana cara mengikuti pelatihan di Corporate University?',
              a: 'Pilih kursus yang tersedia di halaman Komunitas, lalu daftar melalui WhatsApp desa atau datang langsung ke kantor desa. Pelatihan biasanya gratis untuk warga desa.',
            },
            {
              q: 'Bagaimana cara melaporkan masalah infrastruktur desa?',
              a: 'Anda dapat menggunakan fitur Pelaporan Online di Layanan Desa atau menghubungi kami melalui WhatsApp di 085150859735. Tim desa akan menindaklanjuti laporan Anda.',
            },
          ].map((faq, i) => (
            <Card key={i} className="border-emerald-100">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-emerald-900 mb-2">{faq.q}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Service Hours */}
      <Card className="mt-12 border-emerald-200 bg-emerald-50">
        <CardContent className="p-6 text-center">
          <Clock className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
          <h3 className="font-bold text-emerald-800 mb-2">Jam Pelayanan</h3>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div>
              <p className="font-medium text-emerald-700">Senin - Jumat</p>
              <p className="text-gray-600">08:00 - 16:00 WIB</p>
            </div>
            <div>
              <p className="font-medium text-emerald-700">Sabtu</p>
              <p className="text-gray-600">08:00 - 12:00 WIB</p>
            </div>
            <div>
              <p className="font-medium text-emerald-700">Minggu & Hari Libur</p>
              <p className="text-gray-600">Tutup (darurat: WhatsApp)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LayananPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge className="bg-emerald-100 text-emerald-800 mb-3">Layanan</Badge>
          <h1 className="text-3xl font-bold text-emerald-900 mb-3">Layanan & Bantuan Desa</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Akses layanan administrasi desa, konsultasi, dan pusat bantuan dalam satu tempat.
          </p>
        </div>

        <Tabs defaultValue="layanan" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="layanan" className="text-sm">
              <FileText className="h-4 w-4 mr-2" />
              Layanan Desa
            </TabsTrigger>
            <TabsTrigger value="konsol" className="text-sm">
              <HeadphonesIcon className="h-4 w-4 mr-2" />
              Pusat Bantuan
            </TabsTrigger>
          </TabsList>
          <TabsContent value="layanan">
            <LayananDesaTab />
          </TabsContent>
          <TabsContent value="konsol">
            <KonsolTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
