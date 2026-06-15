'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, User, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Username atau password admin salah');
        return;
      }

      localStorage.setItem('desa_admin', JSON.stringify(data));
      router.replace('/admin');
    } catch {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to website */}
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Website Desa
        </button>

        <Card className="border-gray-700 shadow-2xl bg-gray-800/50 backdrop-blur-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-8 py-8 text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white mb-1">Panel Admin</CardTitle>
            <p className="text-orange-100 text-sm">
              Desa Air Sempiang Digital
            </p>
          </div>

          <CardContent className="p-6">
            {/* Info banner */}
            <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-3 mb-6 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300">
                Halaman ini hanya untuk administrator desa. Jika Anda warga desa, silakan masuk melalui website utama.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-username" className="text-gray-300 text-sm">Username Admin</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="admin-username"
                    type="text"
                    placeholder="Masukkan username admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-gray-300 text-sm">Password Admin</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password admin"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-700/50 text-red-400 p-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg shadow-orange-900/30 h-11"
                disabled={loading}
              >
                <Shield className="mr-2 h-4 w-4" />
                {loading ? 'Memverifikasi...' : 'Masuk sebagai Admin'}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                &copy; 2024 Desa Air Sempiang &mdash; Panel Administrasi Digital
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
