'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, User, UserCheck, Baby, Heart, GraduationCap } from 'lucide-react';

interface ResidentData {
  id: string;
  category: string;
  total: number;
  male: number;
  female: number;
  description: string | null;
  year: number;
}

export default function KependudukanPage() {
  const [data, setData] = useState<ResidentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/residents')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const icons: Record<string, React.ReactNode> = {
    'Total Penduduk': <Users className="h-6 w-6" />,
    'Kepala Keluarga': <UserCheck className="h-6 w-6" />,
    'Usia Produktif (18-55)': <User className="h-6 w-6" />,
    'Anak-anak (0-17 tahun)': <Baby className="h-6 w-6" />,
    'Lansia (55+ tahun)': <Heart className="h-6 w-6" />,
    'Pelajar/Mahasiswa': <GraduationCap className="h-6 w-6" />,
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge className="bg-emerald-100 text-emerald-800 mb-3">Kependudukan</Badge>
          <h1 className="text-3xl font-bold text-emerald-900 mb-3">Data Kependudukan Desa Air Sempiang</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Data monografi kependudukan Desa Air Sempiang berdasarkan catatan administrasi desa terbaru tahun 2024.
          </p>
        </div>

        {/* Summary Cards */}
        {!loading && data.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {data.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow border-emerald-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                      {icons[item.category] || <Users className="h-6 w-6" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-emerald-900">{item.category}</h3>
                      <p className="text-2xl font-bold text-emerald-700">
                        {item.total.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                  {item.male > 0 || item.female > 0 ? (
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-600 flex items-center gap-1">
                          <User className="h-3 w-3" /> Laki-laki
                        </span>
                        <span className="font-medium">{item.male.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(item.male / item.total) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-pink-600 flex items-center gap-1">
                          <User className="h-3 w-3" /> Perempuan
                        </span>
                        <span className="font-medium">{item.female.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-pink-500 h-2 rounded-full"
                          style={{ width: `${(item.female / item.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ) : null}
                  {item.description && (
                    <p className="text-xs text-gray-500 mt-4 leading-relaxed">{item.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Population Overview */}
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardHeader>
            <CardTitle className="text-emerald-800">Ringkasan Data Kependudukan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-emerald-700">3.245</p>
                <p className="text-sm text-gray-600">Total Penduduk</p>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-blue-600">1.642</p>
                <p className="text-sm text-gray-600">Laki-laki</p>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-pink-600">1.603</p>
                <p className="text-sm text-gray-600">Perempuan</p>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-amber-600">856</p>
                <p className="text-sm text-gray-600">Kepala Keluarga</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg">
              <h4 className="font-bold text-emerald-800 mb-2">Komposisi Usia</h4>
              <div className="space-y-3">
                {[
                  { label: 'Anak-anak (0-17)', value: 895, color: 'bg-cyan-500', pct: 27.6 },
                  { label: 'Usia Produktif (18-55)', value: 1890, color: 'bg-emerald-500', pct: 58.2 },
                  { label: 'Lansia (55+)', value: 460, color: 'bg-amber-500', pct: 14.2 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{item.label}</span>
                      <span className="font-medium">{item.value.toLocaleString('id-ID')} ({item.pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div className={`${item.color} h-3 rounded-full transition-all`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
