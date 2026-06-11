'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Phone,
  Users,
  Target,
  Eye,
  Leaf,
  GraduationCap,
  ShoppingBag,
  MessageCircle,
  ArrowRight,
  Landmark,
  Mountain,
  Droplets,
} from 'lucide-react';

export default function BerandaPage() {
  const { setCurrentPage, setChatOpen } = useAppStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: 'Desa Air Sempiang',
      subtitle: 'Kecamatan Kabawetan, Kabupaten Kepahiang, Provinsi Bengkulu',
      description: 'Website Desa Digital Terintegrasi sebagai Upaya Optimalisasi Layanan Pendidikan, Pemberdayaan UMKM dan Pertanian, serta Penguatan Program Desa Cantik',
      gradient: 'from-emerald-700 via-emerald-800 to-teal-900',
    },
    {
      title: 'Program Desa Cantik',
      subtitle: 'Mewujudkan Desa yang Cantik, Sehat, dan Sejahtera',
      description: 'Penguatan program desa cantik melalui digitalisasi layanan, pemberdayaan masyarakat, dan pembangunan berkelanjutan',
      gradient: 'from-teal-700 via-emerald-800 to-emerald-900',
    },
    {
      title: 'UMKM & Pertanian Digital',
      subtitle: 'Membangun Ekonomi Desa Melalui Teknologi',
      description: 'Pemberdayaan UMKM dan pertanian melalui marketplace digital, pelatihan, dan akses pasar yang lebih luas',
      gradient: 'from-emerald-800 via-green-800 to-teal-900',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const features = [
    { icon: <GraduationCap className="h-8 w-8" />, title: 'Pendidikan', desc: 'Corporate University dan program literasi digital untuk warga desa', page: 'corporate-university' as const },
    { icon: <ShoppingBag className="h-8 w-8" />, title: 'Marketplace', desc: 'Platform jual beli produk UMKM dan pertanian lokal desa', page: 'marketplace' as const },
    { icon: <Leaf className="h-8 w-8" />, title: 'Pertanian', desc: 'Pemberdayaan petani dengan teknologi dan akses pasar digital', page: 'layanan' as const },
    { icon: <Users className="h-8 w-8" />, title: 'Kependudukan', desc: 'Layanan administrasi kependudukan dan data monografi desa', page: 'kependudukan' as const },
    { icon: <MessageCircle className="h-8 w-8" />, title: 'AI Chatbot', desc: 'Asisten virtual untuk membantu pertanyaan seputar desa', action: 'chat' },
    { icon: <Landmark className="h-8 w-8" />, title: 'Layanan Desa', desc: 'Akses layanan surat, izin, dan administrasi desa online', page: 'layanan' as const },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className={`bg-gradient-to-br ${heroSlides[currentSlide].gradient} transition-all duration-700`}>
          <div className="absolute inset-0 bg-[url('/placeholder')] bg-cover bg-center opacity-10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
            <div className="max-w-3xl">
              <Badge className="bg-white/20 text-white border-0 mb-4">
                Program Desa Cantik 2024
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-emerald-200 text-lg mb-2">
                {heroSlides[currentSlide].subtitle}
              </p>
              <p className="text-emerald-100/80 text-base mb-8 max-w-2xl">
                {heroSlides[currentSlide].description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-white text-emerald-800 hover:bg-emerald-50"
                  onClick={() => setCurrentPage('marketplace')}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Marketplace Desa
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => setChatOpen(true)}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat AI
                </Button>
              </div>
              {/* Slide indicators */}
              <div className="flex gap-2 mt-8">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-emerald-900 mb-3">Layanan Desa Digital</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Akses berbagai layanan desa secara digital untuk kemudahan dan kenyamanan warga Desa Air Sempiang</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Card
                key={i}
                className="group cursor-pointer hover:shadow-lg transition-all border-emerald-100 hover:border-emerald-300"
                onClick={() => f.action === 'chat' ? setChatOpen(true) : setCurrentPage(f.page)}
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-emerald-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Profil Desa */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-emerald-100 text-emerald-800 mb-4">Profil Desa</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-900 mb-6">
                Desa Air Sempiang
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Desa Air Sempiang terletak di Kecamatan Kabawetan, Kabupaten Kepahiang, Provinsi Bengkulu. 
                  Desa ini berada di koordinat astronomis 3°33&apos;28.8&quot; Lintang Selatan dan 102°36&apos;7.2&quot; Bujur Timur, 
                  menjadikannya sebagai salah satu desa strategis di wilayah Kepahiang yang memiliki potensi alam dan 
                  sumber daya manusia yang melimpah.
                </p>
                <p>
                  Dengan jumlah penduduk sekitar 3.245 jiwa, Desa Air Sempiang terus berupaya meningkatkan 
                  kualitas pelayanan publik melalui digitalisasi dan pemberdayaan masyarakat. Program Desa Cantik 
                  menjadi landasan utama dalam pembangunan desa yang berkelanjutan, mencakup aspek kesehatan, 
                  pendidikan, ekonomi, dan lingkungan.
                </p>
                <p>
                  Wilayah desa yang dikelilingi perbukitan dan pertanian hijau menjadikan Air Sempiang kaya akan 
                  produk pertanian seperti kopi robusta, beras organik, dan rempah-rempah. Potensi ini didukung 
                  dengan semangat gotong royong warga yang terus dijaga dari generasi ke generasi.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardContent className="p-6">
                  <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5" /> Batas Wilayah
                  </h3>
                  <div className="space-y-3">
                    {[
                      { dir: 'Utara', border: 'Kabupaten Rejang Lebong', icon: <Mountain className="h-4 w-4" /> },
                      { dir: 'Selatan', border: 'Kecamatan Tebat Karai', icon: <Mountain className="h-4 w-4" /> },
                      { dir: 'Barat', border: 'Kecamatan Ujan Mas', icon: <Droplets className="h-4 w-4" /> },
                      { dir: 'Timur', border: 'Kecamatan Muara Kemumu', icon: <Mountain className="h-4 w-4" /> },
                    ].map((b, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600">{b.icon}</span>
                          <span className="font-medium text-sm">{b.dir}</span>
                        </div>
                        <span className="text-sm text-gray-600">{b.border}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-emerald-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-emerald-800 mb-3">Koordinat</h3>
                  <p className="text-sm text-gray-700 font-mono">3°33&apos;28.8&quot; LS, 102°36&apos;7.2&quot; BT</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-200 text-emerald-900 mb-4">Visi & Misi</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-emerald-900">Visi dan Misi Desa Air Sempiang</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-emerald-200 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-800">
                  <Eye className="h-6 w-6" /> Visi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed italic text-lg">
                  &quot;Mewujudkan Desa Air Sempiang yang Maju, Mandiri, dan Sejahtera melalui 
                  Pemanfaatan Teknologi Digital, Pemberdayaan Masyarakat, dan Pembangunan Berkelanjutan 
                  dalam Rangka Program Desa Cantik&quot;
                </p>
              </CardContent>
            </Card>
            <Card className="border-emerald-200 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-800">
                  <Target className="h-6 w-6" /> Misi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-gray-700">
                  {[
                    'Meningkatkan kualitas pelayanan publik melalui digitalisasi administrasi dan sistem informasi desa terintegrasi.',
                    'Memberdayakan UMKM dan sektor pertanian melalui akses teknologi, permodalan, dan pemasaran digital.',
                    'Mengembangkan sumber daya manusia melalui program pendidikan, pelatihan, dan literasi digital.',
                    'Melestarikan lingkungan dan kearifan lokal melalui program penghijauan dan pengelolaan sampah berbasis masyarakat.',
                    'Membangun infrastruktur desa yang berkualitas dan ramah lingkungan untuk mendukung aktivitas ekonomi dan sosial.',
                    'Meningkatkan partisipasi masyarakat dalam perencanaan dan pengawasan pembangunan desa yang transparan dan akuntabel.',
                  ].map((m, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="shrink-0 w-7 h-7 bg-emerald-200 text-emerald-800 rounded-full flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{m}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Kontak Desa */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-100 text-emerald-800 mb-4">Kontak</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-emerald-900">Hubungi Kami</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow border-emerald-100">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-emerald-900 mb-2">Telepon</h3>
                <p className="text-gray-600">085150859735</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow border-emerald-100">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-emerald-900 mb-2">Alamat</h3>
                <p className="text-gray-600">Kantor Desa Air Sempiang, Kec. Kabawetan, Kab. Kepahiang</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow border-emerald-100">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-emerald-900 mb-2">WhatsApp</h3>
                <a
                  href="https://wa.me/6285150859735"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  Chat Sekarang
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
