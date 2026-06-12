'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppStore, Page } from '@/lib/store';
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
  Bot,
  MessageCircle,
  Tractor,
  ShoppingCartIcon,
  Palette,
  Baby,
  Heart,
  UserCheck,
  Monitor,
  Video,
  Award,
  FileSearch,
  BookOpenCheck,
  Laptop,
  Coins,
  TrendingUp,
  Eye,
  Megaphone,
  Calendar,
  Camera,
  ClipboardList,
  Send,
  Search,
} from 'lucide-react';

interface SubItem {
  label: string;
  page: Page;
  icon: React.ReactNode;
  section?: string;
}

interface NavItem {
  label: string;
  page: Page;
  icon: React.ReactNode;
  emoji: string;
  subItems?: SubItem[];
}

const navItems: NavItem[] = [
  {
    label: 'Beranda',
    page: 'beranda',
    icon: <Home className="h-4 w-4" />,
    emoji: '🏠',
    subItems: [
      { label: 'Profil Desa', page: 'beranda', icon: <Building2 className="h-3.5 w-3.5" />, section: 'profil' },
      { label: 'Visi & Misi', page: 'beranda', icon: <Target className="h-3.5 w-3.5" />, section: 'visi-misi' },
      { label: 'Sejarah Desa', page: 'beranda', icon: <History className="h-3.5 w-3.5" />, section: 'sejarah' },
      { label: 'Struktur Organisasi', page: 'beranda', icon: <Users className="h-3.5 w-3.5" />, section: 'struktur' },
      { label: 'Peta Desa', page: 'beranda', icon: <MapPin className="h-3.5 w-3.5" />, section: 'peta' },
      { label: 'Kontak Desa', page: 'beranda', icon: <Phone className="h-3.5 w-3.5" />, section: 'kontak' },
    ],
  },
  {
    label: 'Layanan Desa',
    page: 'layanan',
    icon: <FileText className="h-4 w-4" />,
    emoji: '🏛️',
    subItems: [
      { label: 'Surat Keterangan Domisili', page: 'layanan', icon: <FileText className="h-3.5 w-3.5" /> },
      { label: 'Surat Pengantar', page: 'layanan', icon: <Send className="h-3.5 w-3.5" /> },
      { label: 'Surat Kelahiran', page: 'layanan', icon: <Baby className="h-3.5 w-3.5" /> },
      { label: 'Surat Kematian', page: 'layanan', icon: <Heart className="h-3.5 w-3.5" /> },
      { label: 'Surat Usaha', page: 'layanan', icon: <ShoppingBag className="h-3.5 w-3.5" /> },
      { label: 'Pengajuan Online', page: 'layanan', icon: <ClipboardList className="h-3.5 w-3.5" /> },
      { label: 'Tracking Pengajuan', page: 'layanan', icon: <Search className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Marketplace',
    page: 'marketplace',
    icon: <ShoppingBag className="h-4 w-4" />,
    emoji: '🛒',
    subItems: [
      { label: 'Produk UMKM', page: 'marketplace', icon: <ShoppingCartIcon className="h-3.5 w-3.5" /> },
      { label: 'Produk Pertanian', page: 'marketplace', icon: <Tractor className="h-3.5 w-3.5" /> },
      { label: 'Kerajinan Desa', page: 'marketplace', icon: <Palette className="h-3.5 w-3.5" /> },
      { label: 'Katalog Produk', page: 'marketplace', icon: <BookOpen className="h-3.5 w-3.5" /> },
      { label: 'Pemesanan Produk', page: 'marketplace', icon: <Package className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Kependudukan',
    page: 'kependudukan',
    icon: <Users className="h-4 w-4" />,
    emoji: '👨‍👩‍👧‍👦',
    subItems: [
      { label: 'Data Penduduk', page: 'kependudukan', icon: <Users className="h-3.5 w-3.5" /> },
      { label: 'Statistik Penduduk', page: 'kependudukan', icon: <BarChart3 className="h-3.5 w-3.5" /> },
      { label: 'Kelahiran', page: 'kependudukan', icon: <Baby className="h-3.5 w-3.5" /> },
      { label: 'Kematian', page: 'kependudukan', icon: <Heart className="h-3.5 w-3.5" /> },
      { label: 'Pendatang', page: 'kependudukan', icon: <UserCheck className="h-3.5 w-3.5" /> },
      { label: 'Migrasi Penduduk', page: 'kependudukan', icon: <TrendingUp className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Corporate University',
    page: 'corporate-university',
    icon: <GraduationCap className="h-4 w-4" />,
    emoji: '🎓',
    subItems: [
      { label: 'Pelatihan Digital', page: 'corporate-university', icon: <Monitor className="h-3.5 w-3.5" /> },
      { label: 'Pelatihan UMKM', page: 'corporate-university', icon: <ShoppingBag className="h-3.5 w-3.5" /> },
      { label: 'Pelatihan Pertanian', page: 'corporate-university', icon: <Tractor className="h-3.5 w-3.5" /> },
      { label: 'Video Pembelajaran', page: 'corporate-university', icon: <Video className="h-3.5 w-3.5" /> },
      { label: 'Sertifikat Pelatihan', page: 'corporate-university', icon: <Award className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Literasi Digital',
    page: 'literasi',
    icon: <BookOpen className="h-4 w-4" />,
    emoji: '📚',
    subItems: [
      { label: 'Artikel Edukasi', page: 'literasi', icon: <FileText className="h-3.5 w-3.5" /> },
      { label: 'E-Book', page: 'literasi', icon: <BookOpenCheck className="h-3.5 w-3.5" /> },
      { label: 'Modul Pembelajaran', page: 'literasi', icon: <Laptop className="h-3.5 w-3.5" /> },
      { label: 'Video Tutorial', page: 'literasi', icon: <Video className="h-3.5 w-3.5" /> },
      { label: 'Literasi Keuangan', page: 'literasi', icon: <Coins className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Console',
    page: 'konsol',
    icon: <BarChart3 className="h-4 w-4" />,
    emoji: '📊',
    subItems: [
      { label: 'Statistik Desa', page: 'konsol', icon: <BarChart3 className="h-3.5 w-3.5" /> },
      { label: 'Monitoring Layanan', page: 'konsol', icon: <Eye className="h-3.5 w-3.5" /> },
      { label: 'Analitik Pengunjung', page: 'konsol', icon: <TrendingUp className="h-3.5 w-3.5" /> },
      { label: 'Grafik Kependudukan', page: 'konsol', icon: <Users className="h-3.5 w-3.5" /> },
      { label: 'Grafik UMKM', page: 'konsol', icon: <ShoppingBag className="h-3.5 w-3.5" /> },
      { label: 'Grafik Pertanian', page: 'konsol', icon: <Tractor className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Berita',
    page: 'berita',
    icon: <Newspaper className="h-4 w-4" />,
    emoji: '📰',
    subItems: [
      { label: 'Berita Desa', page: 'berita', icon: <Newspaper className="h-3.5 w-3.5" /> },
      { label: 'Pengumuman', page: 'berita', icon: <Megaphone className="h-3.5 w-3.5" /> },
      { label: 'Agenda Desa', page: 'berita', icon: <Calendar className="h-3.5 w-3.5" /> },
      { label: 'Kegiatan Masyarakat', page: 'berita', icon: <Users className="h-3.5 w-3.5" /> },
      { label: 'Dokumentasi Kegiatan', page: 'berita', icon: <Camera className="h-3.5 w-3.5" /> },
    ],
  },
];

export default function Navbar() {
  const { currentPage, setCurrentPage, user, setUser, cart, setMobileMenuOpen, mobileMenuOpen, clearCart, setChatOpen } = useAppStore();
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
    setCurrentPage('beranda');
  };

  const handleNav = (page: Page, section?: string) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    window.scrollTo(0, 0);
    // Scroll to section after a small delay for page render
    if (section) {
      setTimeout(() => {
        const el = document.getElementById(`section-${section}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
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
            onClick={() => handleNav('beranda')}
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
                  onClick={() => handleNav(item.page)}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                    currentPage === item.page
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
                    <div className={`px-3 py-2 border-b font-semibold text-xs ${
                      scrolled ? 'border-emerald-100 bg-emerald-50 text-emerald-800' : 'border-emerald-700 bg-emerald-900 text-emerald-100'
                    }`}>
                      {item.emoji} {item.label}
                    </div>
                    <div className="py-1 max-h-80 overflow-y-auto">
                      {item.subItems.map((sub, i) => (
                        <button
                          key={i}
                          onClick={() => handleNav(sub.page, sub.section)}
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

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            {/* AI Chatbot Button */}
            <button
              onClick={() => setChatOpen(true)}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                scrolled ? 'text-purple-600 hover:bg-purple-50' : 'text-purple-300 hover:bg-white/10'
              }`}
              title="AI Chatbot"
            >
              <Bot className="h-4 w-4" />
              <span className="hidden lg:inline">Chatbot</span>
            </button>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/6285150859735"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                scrolled ? 'text-green-600 hover:bg-green-50' : 'text-green-300 hover:bg-white/10'
              }`}
              title="WhatsApp Center"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden lg:inline">WhatsApp</span>
            </a>

            {/* Cart */}
            {user && (
              <button
                onClick={() => handleNav('marketplace')}
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
                onClick={() => handleNav('login')}
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
                        onClick={() => handleNav(item.page)}
                        className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold transition-all ${
                          currentPage === item.page
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'text-gray-800 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-base">{item.emoji}</span>
                        {item.label}
                      </button>
                      {item.subItems && (
                        <div className="pb-1 pl-10">
                          {item.subItems.map((sub, i) => (
                            <button
                              key={i}
                              onClick={() => handleNav(sub.page, sub.section)}
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
                  {/* AI Chatbot & WhatsApp in mobile */}
                  <button
                    onClick={() => { setMobileMenuOpen(false); setChatOpen(true); }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-purple-700 hover:bg-purple-50"
                  >
                    <Bot className="h-4 w-4" /> AI Chatbot
                  </button>
                  <a
                    href="https://wa.me/6285150859735"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-green-700 hover:bg-green-50"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp Center
                  </a>
                  <div className="border-t my-2" />
                  {user ? (
                    <>
                      <button
                        onClick={() => { handleNav('order-history'); }}
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
                      onClick={() => handleNav('login')}
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
