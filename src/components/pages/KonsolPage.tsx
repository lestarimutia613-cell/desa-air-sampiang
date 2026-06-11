'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HeadphonesIcon, Phone, MessageCircle, Mail, Clock, HelpCircle, FileText, ShieldCheck } from 'lucide-react';

export default function KonsolPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge className="bg-emerald-100 text-emerald-800 mb-3">Konsol</Badge>
          <h1 className="text-3xl font-bold text-emerald-900 mb-3">Pusat Bantuan & Konsultasi</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Butuh bantuan atau konsultasi? Hubungi kami melalui berbagai saluran yang tersedia. 
            Tim pelayanan desa siap membantu Anda.
          </p>
        </div>

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
                a: 'Pilih kursus yang tersedia di halaman Corporate University, lalu daftar melalui WhatsApp desa atau datang langsung ke kantor desa. Pelatihan biasanya gratis untuk warga desa.',
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
    </div>
  );
}
