'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  ChevronDown,
  MapPin,
  Landmark,
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
  LayoutGrid,
  ChevronRight,
  X,
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
  subItems?: SubItem[];
}

const navItems: NavItem[] = [
  {
    label: 'Beranda',
    path: '/',
    icon: <Home className="h-4 w-4" />,
    subItems: [
      { label: 'Layanan Desa Digital', path: '/', icon: <Landmark className="h-3.5 w-3.5" />, section: 'layanan' },
      { label: 'Peta Wilayah', path: '/', icon: <MapPin className="h-3.5 w-3.5" />, section: 'peta' },
      { label: 'Profil Desa', path: '/', icon: <Users className="h-3.5 w-3.5" />, section: 'profil' },
      { label: 'Kontak Desa', path: '/', icon: <MapPin className="h-3.5 w-3.5" />, section: 'kontak' },
    ],
  },
  {
    label: 'Layanan',
    path: '/layanan',
    icon: <Landmark className="h-4 w-4" />,
  },
  {
    label: 'Marketplace',
    path: '/marketplace',
    icon: <ShoppingBag className="h-4 w-4" />,
  },
  {
    label: 'Informasi',
    path: '#',
    icon: <LayoutGrid className="h-4 w-4" />,
    subItems: [
      { label: 'Kependudukan', path: '/kependudukan', icon: <Users className="h-3.5 w-3.5" /> },
      { label: 'Corporate University', path: '/corporate-university', icon: <GraduationCap className="h-3.5 w-3.5" /> },
      { label: 'Literasi Digital', path: '/literasi', icon: <BookOpen className="h-3.5 w-3.5" /> },
      { label: 'Konsol Desa', path: '/konsol', icon: <BarChart3 className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Berita',
    path: '/berita',
    icon: <Newspaper className="h-4 w-4" />,
  },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, cart, setMobileMenuOpen, mobileMenuOpen, clearCart } = useAppStore();
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
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

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  const handleLogout = () => {
    setUser(null);
    clearCart();
    localStorage.removeItem('desa_user');
    router.push('/');
  };

  const scrollToSection = useCallback((section: string) => {
    const el = document.getElementById(`section-${section}`);
    if (el) {
      const headerOffset = 72;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }, []);

  const handleNav = useCallback((path: string, section?: string) => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);

    if (section) {
      // If we're already on the target page, just scroll
      if (pathname === path) {
        scrollToSection(section);
      } else {
        // Navigate first, then scroll after page loads
        router.push(path);
        // Wait for page to render, then scroll
        const tryScroll = () => {
          const el = document.getElementById(`section-${section}`);
          if (el) {
            scrollToSection(section);
          } else {
            requestAnimationFrame(tryScroll);
          }
        };
        setTimeout(() => requestAnimationFrame(tryScroll), 200);
      }
    } else {
      router.push(path);
      if (pathname === path) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [pathname, router, scrollToSection, setMobileMenuOpen]);

  const isActive = (itemPath: string) => {
    if (itemPath === '/' || itemPath === '#') return false;
    return pathname === itemPath || pathname.startsWith(itemPath + '/');
  };

  const isHomeActive = () => {
    return pathname === '/';
  };

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100'
          : 'bg-white/60 backdrop-blur-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity shrink-0 group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-md shadow-emerald-200 group-hover:shadow-lg group-hover:shadow-emerald-300 transition-shadow">
              DS
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-gray-900 leading-tight">
                Desa Air Sempiang
              </h1>
              <p className="text-[10px] text-gray-500 leading-tight">
                Kepahiang, Bengkulu
              </p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.subItems ? handleMouseEnter(item.label) : undefined}
                onMouseLeave={() => item.subItems ? handleMouseLeave() : undefined}
              >
                <button
                  onClick={() => {
                    if (item.path !== '#') handleNav(item.path);
                    else if (item.subItems) setOpenDropdown(openDropdown === item.label ? null : item.label);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                    (item.path === '/' ? isHomeActive() : isActive(item.path))
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.subItems && (
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {/* Dropdown */}
                {item.subItems && openDropdown === item.label && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 rounded-2xl shadow-xl border border-gray-100 bg-white/95 backdrop-blur-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1.5 duration-150">
                    <div className="px-3 py-2.5 border-b border-gray-50">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.label}</p>
                    </div>
                    <div className="py-1.5">
                      {item.subItems.map((sub, i) => (
                        <button
                          key={i}
                          onClick={() => handleNav(sub.path, sub.section)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <span className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                            {sub.icon}
                          </span>
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
          <div className="flex items-center gap-2">
            {/* Cart */}
            {user && (
              <button
                onClick={() => handleNav('/marketplace')}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
              >
                <ShoppingCart className="h-4.5 w-4.5" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 p-0 flex items-center justify-center bg-emerald-500 text-white text-[9px] border-2 border-white">
                    {cart.length}
                  </Badge>
                )}
              </button>
            )}

            {/* User */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center">
                    <span className="text-xs font-bold text-emerald-700">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                  </div>
                  <span className="text-xs font-medium max-w-[80px] truncate">{user.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full h-8 w-8 p-0"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => handleNav('/login')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4 h-9 text-sm font-medium shadow-sm shadow-emerald-200"
              >
                <LogIn className="h-3.5 w-3.5 mr-1.5" />
                Masuk
              </Button>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 rounded-full text-gray-600 hover:bg-gray-50">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0 border-l-0">
                {/* Mobile header */}
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-5 text-white relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
                  </div>
                  <div className="relative flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center font-bold text-sm">
                      DS
                    </div>
                    <div>
                      <h2 className="font-bold text-base">Desa Air Sempiang</h2>
                      <p className="text-emerald-200 text-xs">Kec. Kabawetan, Kab. Kepahiang</p>
                    </div>
                  </div>
                  {user && (
                    <div className="relative mt-3 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2">
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-xs font-bold">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                      </div>
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                  )}
                </div>

                {/* Mobile nav items */}
                <nav className="overflow-y-auto max-h-[calc(100vh-140px)] py-2">
                  {navItems.map((item) => (
                    <div key={item.label}>
                      <button
                        onClick={() => {
                          if (item.subItems) {
                            setMobileExpanded(mobileExpanded === item.label ? null : item.label);
                          } else if (item.path !== '#') {
                            handleNav(item.path);
                          }
                        }}
                        className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium transition-colors ${
                          (item.path === '/' ? isHomeActive() : isActive(item.path))
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            (item.path === '/' ? isHomeActive() : isActive(item.path))
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {item.icon}
                          </span>
                          {item.label}
                        </div>
                        {item.subItems && (
                          <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${mobileExpanded === item.label ? 'rotate-90' : ''}`} />
                        )}
                      </button>
                      {item.subItems && mobileExpanded === item.label && (
                        <div className="pb-2 pl-14 pr-4 space-y-0.5 animate-in slide-in-from-top-1 duration-150">
                          {item.subItems.map((sub, i) => (
                            <button
                              key={i}
                              onClick={() => handleNav(sub.path, sub.section)}
                              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                              {sub.icon}
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="border-t border-gray-100 my-2 mx-4" />

                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <span className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                        <LogOut className="h-4 w-4" />
                      </span>
                      Keluar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNav('/login')}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                    >
                      <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <LogIn className="h-4 w-4" />
                      </span>
                      Masuk / Daftar
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
