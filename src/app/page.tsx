'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AiChatBot from '@/components/chat/AiChatBot';
import FloatingActionBar from '@/components/layout/FloatingActionBar';
import BerandaPage from '@/components/pages/BerandaPage';
import LayananPage from '@/components/pages/LayananPage';
import MarketplacePage from '@/components/pages/MarketplacePage';
import KependudukanPage from '@/components/pages/KependudukanPage';
import CorporateUniversityPage from '@/components/pages/CorporateUniversityPage';
import LiterasiPage from '@/components/pages/LiterasiPage';
import KonsolPage from '@/components/pages/KonsolPage';
import BeritaPage from '@/components/pages/BeritaPage';
import LoginPage from '@/components/pages/LoginPage';
import PaymentPage from '@/components/pages/PaymentPage';
import OrderHistoryPage from '@/components/pages/OrderHistoryPage';

const pageMap: Record<string, React.ComponentType> = {
  'beranda': BerandaPage,
  'layanan': LayananPage,
  'marketplace': MarketplacePage,
  'kependudukan': KependudukanPage,
  'corporate-university': CorporateUniversityPage,
  'literasi': LiterasiPage,
  'konsol': KonsolPage,
  'berita': BeritaPage,
  'login': LoginPage,
  'register': LoginPage,
  'payment': PaymentPage,
  'order-history': OrderHistoryPage,
};

export default function Home() {
  const { currentPage, setUser } = useAppStore();

  // Restore user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('desa_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {}
    }
  }, [setUser]);

  // Save user to localStorage on change
  useEffect(() => {
    const user = useAppStore.getState().user;
    if (user) {
      localStorage.setItem('desa_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('desa_user');
    }
  });

  const PageComponent = pageMap[currentPage] || BerandaPage;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pb-16">
        <PageComponent />
      </main>
      <Footer />
      <AiChatBot />
      <FloatingActionBar />
    </div>
  );
}
