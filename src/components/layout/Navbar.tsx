'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';

const navItems: { label: string; page: Page; icon: React.ReactNode }[] = [
  { label: 'Beranda', page: 'beranda', icon: <Home className="h-4 w-4" /> },
  { label: 'Layanan', page: 'layanan', icon: <FileText className="h-4 w-4" /> },
  { label: 'Marketplace', page: 'marketplace', icon: <ShoppingBag className="h-4 w-4" /> },
  { label: 'Komunitas', page: 'komunitas', icon: <Users className="h-4 w-4" /> },
  { label: 'Berita', page: 'berita', icon: <Newspaper className="h-4 w-4" /> },
];

export default function Navbar() {
  const { currentPage, setCurrentPage, user, setUser, cart, setMobileMenuOpen, mobileMenuOpen, clearCart } = useAppStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    setUser(null);
    clearCart();
    setCurrentPage('beranda');
  };

  const handleNav = (page: Page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-emerald-100'
          : 'bg-gradient-to-r from-emerald-700 to-emerald-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNav('beranda')}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
              scrolled ? 'bg-emerald-600 text-white' : 'bg-white/20 text-white'
            }`}>
              DS
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-sm font-bold leading-tight ${scrolled ? 'text-emerald-800' : 'text-white'}`}>
                Desa Air Sempiang
              </h1>
              <p className={`text-[10px] leading-tight ${scrolled ? 'text-emerald-600' : 'text-emerald-200'}`}>
                Kepahiang, Bengkulu
              </p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
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
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            {user && (
              <button
                onClick={() => handleNav('marketplace')}
                className={`relative flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  scrolled ? 'text-emerald-700 hover:bg-emerald-50' : 'text-emerald-100 hover:bg-white/10'
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-[10px]">
                    {cart.length}
                  </Badge>
                )}
              </button>
            )}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className={`text-xs ${scrolled ? 'text-red-600' : 'text-red-300 hover:bg-white/10'}`}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Keluar</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNav('login')}
                className={`text-xs ${scrolled ? 'text-emerald-700 hover:bg-emerald-50' : 'text-white hover:bg-white/10'}`}
              >
                <LogIn className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">Masuk</span>
              </Button>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={`lg:hidden ${scrolled ? 'text-emerald-700' : 'text-white'}`}>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <div className="bg-emerald-800 p-4 text-white">
                  <h2 className="font-bold text-lg">Desa Air Sempiang</h2>
                  <p className="text-emerald-200 text-xs">Kec. Kabawetan, Kab. Kepahiang</p>
                </div>
                <nav className="p-2">
                  {navItems.map((item) => (
                    <button
                      key={item.page}
                      onClick={() => handleNav(item.page)}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        currentPage === item.page
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                  <div className="border-t my-2" />
                  {user ? (
                    <>
                      <button
                        onClick={() => { handleNav('order-history'); }}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                      >
                        <Package className="h-4 w-4" />
                        Riwayat Pesanan
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Keluar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleNav('login')}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                    >
                      <LogIn className="h-4 w-4" />
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
