'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
  Menu,
  Home,
  ShoppingBag,
  Newspaper,
  LogIn,
  LogOut,
  ShoppingCart,
  Package,
  FileText,
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
  ChevronDown,
  MapPin,
  Target,
  History,
  Building2,
  Phone,
  ClipboardList,
  Send,
  Search,
  ScrollText,
  Baby,
  Heart,
  UserCheck,
  Monitor,
  Video,
  Award,
  BookOpenCheck,
  Laptop,
  Coins,
  TrendingUp,
  Eye,
  Megaphone,
  Calendar,
  Camera,
  Sprout,
  Palette,
  ShoppingCartIcon,
  Landmark,
  Stethoscope,
  Scale,
  Truck,
  Wrench,
  ShieldCheck,
} from 'lucide-react';

interface SubItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  section?: string;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  iconBg: string;
  subItems?: SubItem[];
}

const navItems: NavItem[] = [
  {
    label: 'Beranda',
    path: '/',
    icon: <Home className="h-4 w-4" />,
    iconBg: 'bg-emerald-100 text-emerald-700',
    subItems: [
      { label: 'Profil Desa', path: '/', icon: <Building2 className="h-3.5 w-3.5" />, section: 'profil' },
      { label: 'Visi & Misi', path: '/', icon: <Target className="h-3.5 w-3.5" />, section: 'visi-misi' },
      { label: 'Sejarah Desa', path: '/', icon: <History className="h-3.5 w-3.5" />, section: 'sejarah' },
      { label: 'Struktur Organisasi', path: '/', icon: <Users className="h-3.5 w-3.5" />, section: 'struktur' },
      { label: 'Peta Desa', path: '/', icon: <MapPin className="h-3.5 w-3.5" />, section: 'peta' },
      { label: 'Kontak Desa', path: '/', icon: <Phone className="h-3.5 w-3.5" />, section: 'kontak' },
    ],
  },
  {
    label: 'Layanan Desa',
    path: '/layanan',
    icon: <Landmark className="h-4 w-4" />,
    iconBg: 'bg-purple-100 text-purple-700',
    subItems: [
      { label: 'Surat Keterangan Domisili', path: '/layanan', icon: <ScrollText className="h-3.5 w-3.5" /> },
      { label: 'Surat Pengantar', path: '/layanan', icon: <Send className="h-3.5 w-3.5" /> },
      { label: 'Surat Kelahiran', path: '/layanan', icon: <Baby className="h-3.5 w-3.5" /> },
      { label: 'Surat Kematian', path: '/layanan', icon: <Heart className="h-3.5 w-3.5" /> },
      { label: 'Surat Keterangan Usaha', path: '/layanan', icon: <ShoppingBag className="h-3.5 w-3.5" /> },
      { label: 'Surat Keterangan Tidak Mampu', path: '/layanan', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
      { label: 'Surat Keterangan Sehat', path: '/layanan', icon: <Stethoscope className="h-3.5 w-3.5" /> },
      { label: 'Surat Pengantar SKCK', path: '/layanan', icon: <Scale className="h-3.5 w-3.5" /> },
      { label: 'Surat Pindah Domisili', path: '/layanan', icon: <Truck className="h-3.5 w-3.5" /> },
      { label: 'Surat Keterangan Lainnya', path: '/layanan', icon: <FileText className="h-3.5 w-3.5" /> },
      { label: 'Pengajuan Online', path: '/layanan', icon: <ClipboardList className="h-3.5 w-3.5" /> },
      { label: 'Tracking Pengajuan', path: '/layanan', icon: <Search className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Marketplace',
    path: '/marketplace',
    icon: <ShoppingBag className="h-4 w-4" />,
    iconBg: 'bg-orange-100 text-orange-700',
    subItems: [
      { label: 'Produk UMKM', path: '/marketplace', icon: <ShoppingCartIcon className="h-3.5 w-3.5" /> },
      { label: 'E-Transaksi', path: '/order-history', icon: <FileText className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Kependudukan',
    path: '/kependudukan',
    icon: <Users className="h-4 w-4" />,
    iconBg: 'bg-blue-100 text-blue-700',
    subItems: [
      { label: 'Data Penduduk', path: '/kependudukan', icon: <Users className="h-3.5 w-3.5" /> },
      { label: 'Statistik Penduduk', path: '/kependudukan', icon: <BarChart3 className="h-3.5 w-3.5" /> },
      { label: 'Kelahiran', path: '/kependudukan', icon: <Baby className="h-3.5 w-3.5" /> },
      { label: 'Kematian', path: '/kependudukan', icon: <Heart className="h-3.5 w-3.5" /> },
      { label: 'Pendatang', path: '/kependudukan', icon: <UserCheck className="h-3.5 w-3.5" /> },
      { label: 'Migrasi Penduduk', path: '/kependudukan', icon: <TrendingUp className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Corporate University',
    path: '/corporate-university',
    icon: <GraduationCap className="h-4 w-4" />,
    iconBg: 'bg-cyan-100 text-cyan-700',
    subItems: [
      { label: 'Pelatihan Digital', path: '/corporate-university', icon: <Monitor className="h-3.5 w-3.5" /> },
      { label: 'Pelatihan UMKM', path: '/corporate-university', icon: <ShoppingBag className="h-3.5 w-3.5" /> },
      { label: 'Pelatihan Pertanian', path: '/corporate-university', icon: <Sprout className="h-3.5 w-3.5" /> },
      { label: 'Video Pembelajaran', path: '/corporate-university', icon: <Video className="h-3.5 w-3.5" /> },
      { label: 'Sertifikat Pelatihan', path: '/corporate-university', icon: <Award className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Literasi Digital',
    path: '/literasi',
    icon: <BookOpen className="h-4 w-4" />,
    iconBg: 'bg-indigo-100 text-indigo-700',
    subItems: [
      { label: 'Artikel Edukasi', path: '/literasi', icon: <FileText className="h-3.5 w-3.5" /> },
      { label: 'E-Book', path: '/literasi', icon: <BookOpenCheck className="h-3.5 w-3.5" /> },
      { label: 'Modul Pembelajaran', path: '/literasi', icon: <Laptop className="h-3.5 w-3.5" /> },
      { label: 'Video Tutorial', path: '/literasi', icon: <Video className="h-3.5 w-3.5" /> },
      { label: 'Literasi Keuangan', path: '/literasi', icon: <Coins className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Console',
    path: '/konsol',
    icon: <BarChart3 className="h-4 w-4" />,
    iconBg: 'bg-teal-100 text-teal-700',
    subItems: [
      { label: 'Statistik Desa', path: '/konsol', icon: <BarChart3 className="h-3.5 w-3.5" /> },
      { label: 'Monitoring Layanan', path: '/konsol', icon: <Eye className="h-3.5 w-3.5" /> },
      { label: 'Analitik Pengunjung', path: '/konsol', icon: <TrendingUp className="h-3.5 w-3.5" /> },
      { label: 'Grafik Kependudukan', path: '/konsol', icon: <Users className="h-3.5 w-3.5" /> },
      { label: 'Grafik UMKM', path: '/konsol', icon: <ShoppingBag className="h-3.5 w-3.5" /> },
      { label: 'Grafik Pertanian', path: '/konsol', icon: <Sprout className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Berita',
    path: '/berita',
    icon: <Newspaper className="h-4 w-4" />,
    iconBg: 'bg-rose-100 text-rose-700',
    subItems: [
      { label: 'Berita Desa', path: '/berita', icon: <Newspaper className="h-3.5 w-3.5" /> },
      { label: 'Pengumuman', path: '/berita', icon: <Megaphone className="h-3.5 w-3.5" /> },
      { label: 'Agenda Desa', path: '/berita', icon: <Calendar className="h-3.5 w-3.5" /> },
      { label: 'Kegiatan Masyarakat', path: '/berita', icon: <Users className="h-3.5 w-3.5" /> },
      { label: 'Dokumentasi Kegiatan', path: '/berita', icon: <Camera className="h-3.5 w-3.5" /> },
    ],
  },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, cart, setMobileMenuOpen, mobileMenuOpen, clearCart } = useAppStore();
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUser(null);
    clearCart();
    router.push('/');
  };

  const handleNav = (path: string, section?: string) => {
    router.push(path);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    window.scrollTo(0, 0);
    if (section) {
      setTimeout(() => {
        const el = document.getElementById(`section-${section}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  };

  // Helper to determine if a nav item is active based on the current pathname
  const isActive = (itemPath: string) => {
    if (itemPath === '/') return pathname === '/';
    return pathname === itemPath || pathname.startsWith(itemPath + '/');
  };

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 200);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-emerald-100'
          : 'bg-gradient-to-r from-emerald-700 to-emerald-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
              scrolled ? 'bg-emerald-600 text-white' : 'bg-white/20 text-white'
            }`}>
              DS
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-xs font-bold leading-tight ${scrolled ? 'text-emerald-800' : 'text-white'}`}>
                Desa Air Sempiang
              </h1>
              <p className={`text-[9px] leading-tight ${scrolled ? 'text-emerald-600' : 'text-emerald-200'}`}>
                Kepahiang, Bengkulu
              </p>
            </div>
          </button>

          {/* Desktop Nav with Dropdowns */}
          <nav className="hidden xl:flex items-center gap-0.5" ref={dropdownRef}>
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => handleNav(item.path)}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                    isActive(item.path)
                      ? scrolled
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-white/20 text-white'
                      : scrolled
                      ? 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                      : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="max-w-[80px] truncate">{item.label}</span>
                  {item.subItems && <ChevronDown className={`h-3 w-3 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />}
                </button>

                {/* Dropdown Menu */}
                {item.subItems && openDropdown === item.label && (
                  <div className={`absolute top-full left-0 mt-1 w-56 rounded-xl shadow-xl border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
                    scrolled ? 'bg-white border-emerald-100' : 'bg-emerald-800 border-emerald-700'
                  }`}>
                    <div className={`px-3 py-2 border-b font-semibold text-xs flex items-center gap-2 ${
                      scrolled ? 'border-emerald-100 bg-emerald-50 text-emerald-800' : 'border-emerald-700 bg-emerald-900 text-emerald-100'
                    }`}>
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center ${item.iconBg}`}>
                        {item.icon}
                      </span>
                      {item.label}
                    </div>
                    <div className="py-1 max-h-80 overflow-y-auto">
                      {item.subItems.map((sub, i) => (
                        <button
                          key={i}
                          onClick={() => handleNav(sub.path, sub.section)}
                          className={`flex items-center gap-2.5 w-full px-3 py-2 text-xs transition-colors ${
                            scrolled
                              ? 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-800'
                              : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                          }`}
                        >
                          {sub.icon}
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side - No chatbot/WhatsApp here */}
          <div className="flex items-center gap-1.5">
            {/* Cart */}
            {user && (
              <button
                onClick={() => handleNav('/marketplace')}
                className={`relative flex items-center px-2 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                  scrolled ? 'text-emerald-700 hover:bg-emerald-50' : 'text-emerald-100 hover:bg-white/10'
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-[9px]">
                    {cart.length}
                  </Badge>
                )}
              </button>
            )}

            {/* User Menu */}
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className={`text-[11px] h-8 px-2 ${scrolled ? 'text-red-600' : 'text-red-300 hover:bg-white/10'}`}
              >
                <LogOut className="h-3.5 w-3.5 mr-1" />
                <span className="hidden md:inline">Keluar</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNav('/login')}
                className={`text-[11px] h-8 px-2 ${scrolled ? 'text-emerald-700 hover:bg-emerald-50' : 'text-white hover:bg-white/10'}`}
              >
                <LogIn className="h-3.5 w-3.5 mr-1" />
                <span className="hidden md:inline">Masuk</span>
              </Button>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={`xl:hidden h-8 w-8 ${scrolled ? 'text-emerald-700' : 'text-white'}`}>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="bg-emerald-800 p-4 text-white">
                  <h2 className="font-bold text-lg">Desa Air Sempiang</h2>
                  <p className="text-emerald-200 text-xs">Kec. Kabawetan, Kab. Kepahiang</p>
                </div>
                <nav className="overflow-y-auto max-h-[calc(100vh-80px)]">
                  {navItems.map((item) => (
                    <div key={item.label}>
                      <button
                        onClick={() => handleNav(item.path)}
                        className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold transition-all ${
                          isActive(item.path)
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'text-gray-800 hover:bg-gray-50'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${item.iconBg}`}>
                          {item.icon}
                        </span>
                        {item.label}
                      </button>
                      {item.subItems && (
                        <div className="pb-1 pl-10">
                          {item.subItems.map((sub, i) => (
                            <button
                              key={i}
                              onClick={() => handleNav(sub.path, sub.section)}
                              className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                            >
                              {sub.icon}
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="border-t my-2" />
                  {user ? (
                    <>
                      <button
                        onClick={() => { handleNav('/order-history'); }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                      >
                        <Package className="h-4 w-4" /> Riwayat Pesanan
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" /> Keluar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleNav('/login')}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                    >
                      <LogIn className="h-4 w-4" /> Masuk / Daftar
                    </button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
