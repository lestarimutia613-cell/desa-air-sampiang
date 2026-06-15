'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, User, UserCheck, Baby, Heart, GraduationCap, 
  HandHeart, Search, Filter, ChevronDown, ChevronUp,
  ShieldCheck, AlertCircle, CheckCircle2, Clock, Package
} from 'lucide-react';

interface ResidentData {
  id: string;
  category: string;
  total: number;
  male: number;
  female: number;
  description: string | null;
  year: number;
}

interface BansosRecipient {
  id: string;
  name: string;
  nik: string;
  program: string;
  amount: string;
  period: string;
  status: 'diterima' | 'diproses' | 'menunggu';
  address: string;
  familyMembers: number;
}

const bansosData: BansosRecipient[] = [
  { id: '1', name: 'Siti Aminah', nik: '1706056801980001', program: 'PKH', amount: 'Rp 2.400.000', period: 'Januari - Juni 2025', status: 'diterima', address: 'RT 01 / RW 02', familyMembers: 5 },
  { id: '2', name: 'Ahmad Fauzi', nik: '1706056503920002', program: 'BPNT', amount: 'Rp 300.000', period: 'Maret 2025', status: 'diterima', address: 'RT 02 / RW 01', familyMembers: 4 },
  { id: '3', name: 'Dewi Lestari', nik: '1706057008050003', program: 'PKH', amount: 'Rp 2.400.000', period: 'Januari - Juni 2025', status: 'diterima', address: 'RT 03 / RW 02', familyMembers: 6 },
  { id: '4', name: 'Budi Santoso', nik: '1706055511890004', program: 'BLT-DD', amount: 'Rp 1.200.000', period: 'Februari 2025', status: 'diproses', address: 'RT 01 / RW 03', familyMembers: 3 },
  { id: '5', name: 'Rina Wati', nik: '1706054305930005', program: 'BPNT', amount: 'Rp 300.000', period: 'Maret 2025', status: 'diterima', address: 'RT 04 / RW 01', familyMembers: 4 },
  { id: '6', name: 'Hendra Gunawan', nik: '1706056707850006', program: 'BLT-DD', amount: 'Rp 1.200.000', period: 'Februari 2025', status: 'menunggu', address: 'RT 02 / RW 03', familyMembers: 5 },
  { id: '7', name: 'Nurul Hidayah', nik: '1706057005010007', program: 'PKH', amount: 'Rp 2.400.000', period: 'Januari - Juni 2025', status: 'diterima', address: 'RT 03 / RW 01', familyMembers: 4 },
  { id: '8', name: 'Joko Purnomo', nik: '1706055508900008', program: 'BST', amount: 'Rp 600.000', period: 'Maret 2025', status: 'diproses', address: 'RT 01 / RW 02', familyMembers: 3 },
  { id: '9', name: 'Sri Mulyani', nik: '1706054310920009', program: 'BPNT', amount: 'Rp 300.000', period: 'April 2025', status: 'menunggu', address: 'RT 04 / RW 02', familyMembers: 5 },
  { id: '10', name: 'Darmawan', nik: '1706056702880010', program: 'BLT-DD', amount: 'Rp 1.200.000', period: 'Maret 2025', status: 'diterima', address: 'RT 02 / RW 02', familyMembers: 4 },
  { id: '11', name: 'Rosmawati', nik: '1706057008950011', program: 'PKH', amount: 'Rp 2.400.000', period: 'Januari - Juni 2025', status: 'diterima', address: 'RT 03 / RW 03', familyMembers: 6 },
  { id: '12', name: 'Agus Riyanto', nik: '1706055505910012', program: 'BST', amount: 'Rp 600.000', period: 'April 2025', status: 'diproses', address: 'RT 01 / RW 01', familyMembers: 3 },
];

const programInfo: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactNode; desc: string }> = {
  'PKH': { label: 'PKH', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200', icon: <HandHeart className="h-4 w-4" />, desc: 'Program Keluarga Harapan' },
  'BPNT': { label: 'BPNT', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200', icon: <Package className="h-4 w-4" />, desc: 'Bantuan Pangan Non Tunai' },
  'BLT-DD': { label: 'BLT-DD', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200', icon: <ShieldCheck className="h-4 w-4" />, desc: 'Bantuan Langsung Tunai Dana Desa' },
  'BST': { label: 'BST', color: 'text-purple-700', bgColor: 'bg-purple-50 border-purple-200', icon: <HandHeart className="h-4 w-4" />, desc: 'Bantuan Sosial Tunai' },
};

const statusInfo: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  'diterima': { label: 'Diterima', color: 'text-green-700 bg-green-50 border-green-200', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  'diproses': { label: 'Diproses', color: 'text-amber-700 bg-amber-50 border-amber-200', icon: <Clock className="h-3.5 w-3.5" /> },
  'menunggu': { label: 'Menunggu', color: 'text-gray-700 bg-gray-50 border-gray-200', icon: <AlertCircle className="h-3.5 w-3.5" /> },
};

export default function KependudukanPage() {
  const [data, setData] = useState<ResidentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProgram, setFilterProgram] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showBansos, setShowBansos] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

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

  const filteredRecipients = bansosData.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        r.nik.includes(searchQuery) || 
                        r.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProgram = filterProgram === 'ALL' || r.program === filterProgram;
    const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
    return matchSearch && matchProgram && matchStatus;
  });

  // Bansos summary stats
  const totalBansos = bansosData.length;
  const diterima = bansosData.filter(r => r.status === 'diterima').length;
  const diproses = bansosData.filter(r => r.status === 'diproses').length;
  const menunggu = bansosData.filter(r => r.status === 'menunggu').length;

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
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 mb-12">
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

        {/* ============================================
            PENERIMA BANSOS - Social Assistance Section
            ============================================ */}
        <div className="mb-4">
          <button
            onClick={() => setShowBansos(!showBansos)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <HandHeart className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-emerald-900">Data Penerima Bantuan Sosial (Bansos)</h2>
                <p className="text-sm text-gray-500">Informasi penerima bantuan sosial dari pemerintah pusat dan daerah</p>
              </div>
            </div>
            {showBansos ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
          </button>
        </div>

        {showBansos && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Bansos Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-orange-700">{totalBansos}</p>
                <p className="text-xs text-orange-600 font-medium">Total Penerima</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-700">{diterima}</p>
                <p className="text-xs text-green-600 font-medium">Sudah Diterima</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-700">{diproses}</p>
                <p className="text-xs text-amber-600 font-medium">Sedang Diproses</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-700">{menunggu}</p>
                <p className="text-xs text-gray-600 font-medium">Menunggu Verifikasi</p>
              </div>
            </div>

            {/* Program Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(programInfo).map(([key, info]) => {
                const count = bansosData.filter(r => r.program === key).length;
                return (
                  <div key={key} className={`${info.bgColor} border rounded-xl p-4 flex items-center gap-3`}>
                    <div className={`${info.color}`}>{info.icon}</div>
                    <div>
                      <p className={`font-bold text-sm ${info.color}`}>{info.label}</p>
                      <p className="text-xs text-gray-500">{info.desc}</p>
                      <p className={`text-lg font-bold mt-0.5 ${info.color}`}>{count} Penerima</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Search & Filter */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari nama, NIK, atau alamat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterProgram}
                    onChange={(e) => setFilterProgram(e.target.value)}
                    className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-400 bg-white"
                  >
                    <option value="ALL">Semua Program</option>
                    {Object.entries(programInfo).map(([key, info]) => (
                      <option key={key} value={key}>{info.label} - {info.desc}</option>
                    ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-400 bg-white"
                  >
                    <option value="ALL">Semua Status</option>
                    {Object.entries(statusInfo).map(([key, info]) => (
                      <option key={key} value={key}>{info.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Recipients Table/Cards */}
            <div className="space-y-3">
              {filteredRecipients.slice(0, visibleCount).map((recipient) => {
                const prog = programInfo[recipient.program];
                const stat = statusInfo[recipient.status];
                return (
                  <div key={recipient.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${prog.bgColor} border rounded-lg flex items-center justify-center ${prog.color}`}>
                          {prog.icon}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{recipient.name}</p>
                          <p className="text-xs text-gray-500">NIK: {recipient.nik}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${prog.bgColor} ${prog.color}`}>
                          {prog.icon} {prog.label}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${stat.color}`}>
                          {stat.icon} {stat.label}
                        </span>
                        <span className="text-sm font-bold text-emerald-700">{recipient.amount}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-50 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <UserCheck className="h-3 w-3" /> {recipient.familyMembers} Anggota Keluarga
                      </span>
                      <span>Alamat: {recipient.address}</span>
                      <span>Periode: {recipient.period}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load more */}
            {filteredRecipients.length > visibleCount && (
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setVisibleCount(prev => prev + 6)}
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  Lihat Lebih Banyak ({filteredRecipients.length - visibleCount} lagi)
                </Button>
              </div>
            )}

            {filteredRecipients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="font-medium">Tidak ada data ditemukan</p>
                <p className="text-sm">Coba ubah kata kunci atau filter pencarian</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
