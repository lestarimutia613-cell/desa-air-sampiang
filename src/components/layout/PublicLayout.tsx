'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AiChatBot from '@/components/chat/AiChatBot';
import FloatingActionBar from '@/components/layout/FloatingActionBar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { setUser } = useAppStore();

  // Restore user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('desa_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('desa_user');
      }
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pb-16">
        {children}
      </main>
      <Footer />
      <AiChatBot />
      <FloatingActionBar />
    </div>
  );
}
