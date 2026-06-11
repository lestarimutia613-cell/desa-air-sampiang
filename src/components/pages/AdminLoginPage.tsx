'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const { setCurrentPage, setAdmin } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'admin-login',
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Email atau password admin salah');
        return;
      }

      setAdmin(data);
      setCurrentPage('admin');
    } catch {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <button
          onClick={() => setCurrentPage('beranda')}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 mb-6 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
        </button>

        <Card className="border-orange-200 shadow-xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-orange-600 to-amber-600 text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="h-8 w-8" />
            </div>
            <CardTitle className="text-xl">Panel Admin Desa</CardTitle>
            <p className="text-orange-200 text-sm">
              Halaman khusus administrator Desa Air Sempiang
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Halaman ini hanya untuk administrator desa. Jika Anda warga desa, silakan masuk melalui halaman &quot;Masuk&quot; biasa.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email Admin</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@desaairsempiang.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password Admin</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Masukkan password admin"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={loading}
              >
                <Shield className="mr-2 h-4 w-4" />
                {loading ? 'Memverifikasi...' : 'Masuk sebagai Admin'}
              </Button>
            </form>

            <div className="mt-4 p-3 bg-orange-50 rounded-lg">
              <p className="text-xs text-gray-500 text-center mb-2">Akun Admin Demo:</p>
              <div className="bg-white p-2 rounded text-xs text-center">
                <p className="font-medium text-orange-800">Admin Desa</p>
                <p className="text-gray-500">admin@desaairsempiang.id</p>
                <p className="text-gray-500">admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
