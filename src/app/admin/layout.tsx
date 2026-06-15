'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Users,
  Newspaper,
  GraduationCap,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Package,
  ClipboardList,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: string;
}

const sidebarItems = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'E-Transaksi', href: '/admin/e-transaksi', icon: <Zap className="h-5 w-5" /> },
  { label: 'Pesanan', href: '/admin/orders', icon: <Package className="h-5 w-5" /> },
  { label: 'Produk', href: '/admin/products', icon: <ShoppingBag className="h-5 w-5" /> },
  { label: 'Layanan', href: '/admin/services', icon: <FileText className="h-5 w-5" /> },
  { label: 'Pengajuan Surat', href: '/admin/service-applications', icon: <ClipboardList className="h-5 w-5" /> },
  { label: 'Berita', href: '/admin/news', icon: <Newspaper className="h-5 w-5" /> },
  { label: 'Kursus', href: '/admin/courses', icon: <GraduationCap className="h-5 w-5" /> },
  { label: 'Literasi', href: '/admin/literacy', icon: <BookOpen className="h-5 w-5" /> },
  { label: 'Pengguna', href: '/admin/users', icon: <Users className="h-5 w-5" /> },
  { label: 'Pengaturan', href: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    if (typeof window !== 'undefined') {
      const savedAdmin = localStorage.getItem('desa_admin');
      if (savedAdmin) {
        try {
          return JSON.parse(savedAdmin);
        } catch {
          localStorage.removeItem('desa_admin');
        }
      }
    }
    return null;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (mounted && !admin && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [admin, mounted, pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('desa_admin');
    setAdmin(null);
    router.replace('/admin/login');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }

  // Login page doesn't need sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-gray-900 text-white min-h-screen fixed inset-y-0 left-0 z-40">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
          <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">
            AD
          </div>
          <div>
            <h2 className="text-sm font-bold">Admin Desa</h2>
            <p className="text-[10px] text-gray-400">Air Sempiang</p>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 text-xs font-bold">
              {admin.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{admin.name}</p>
              <p className="text-[10px] text-gray-400 truncate">@{admin.username}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full text-red-400 hover:bg-red-900/30 hover:text-red-300 justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" /> Keluar
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">
              AD
            </div>
            <div>
              <h2 className="text-sm font-bold">Admin Desa</h2>
              <p className="text-[10px] text-gray-400">Air Sempiang</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="py-4 px-3 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <button
                key={item.href}
                onClick={() => { router.push(item.href); setSidebarOpen(false); }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full text-red-400 hover:bg-red-900/30 hover:text-red-300 justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" /> Keluar
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Panel Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block">
              Desa Air Sempiang
            </span>
            <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">
              {admin.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
