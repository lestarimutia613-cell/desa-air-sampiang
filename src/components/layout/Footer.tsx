'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-emerald-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Desa Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Desa Air Sempiang</h3>
            <p className="text-emerald-200 text-sm leading-relaxed mb-4">
              Kecamatan Kabawetan, Kabupaten Kepahiang, Provinsi Bengkulu.
              Website desa digital terintegrasi untuk optimalisasi layanan pendidikan,
              pemberdayaan UMKM dan pertanian, serta penguatan Program Desa Cantik.
            </p>
            <div className="space-y-2 text-sm text-emerald-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>3°33&apos;28.8&quot; LS, 102°36&apos;7.2&quot; BT</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>085150859735</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@desaairsempiang.id</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Tautan Cepat</h3>
            <nav className="space-y-2 text-sm text-emerald-300">
              {[
                { label: 'Beranda', href: '/' },
                { label: 'Layanan Desa', href: '/layanan' },
                { label: 'Marketplace', href: '/marketplace' },
                { label: 'Kependudukan', href: '/kependudukan' },
                { label: 'Corporate University', href: '/corporate-university' },
                { label: 'Literasi Digital', href: '/literasi' },
                { label: 'Console', href: '/konsol' },
                { label: 'Berita', href: '/berita' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* WhatsApp CTA */}
          <div>
            <h3 className="text-lg font-bold mb-4">Hubungi Kami</h3>
            <p className="text-emerald-200 text-sm mb-4">
              Butuh bantuan? Hubungi kami melalui WhatsApp untuk respon cepat dari pelayanan desa.
            </p>
            <a
              href="https://wa.me/6285150859735"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat via WhatsApp
            </a>
            <div className="mt-4 p-3 bg-emerald-800 rounded-lg">
              <p className="text-xs text-emerald-300">
                Jam Pelayanan: Senin - Jumat, 08:00 - 16:00 WIB
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-emerald-800 mt-8 pt-6 text-center text-sm text-emerald-400">
          <p>&copy; 2024 Desa Air Sempiang - Kec. Kabawetan, Kab. Kepahiang, Prov. Bengkulu</p>
          <p className="text-xs mt-1">Website Desa Digital Terintegrasi - Program Desa Cantik</p>
        </div>
      </div>
    </footer>
  );
}
