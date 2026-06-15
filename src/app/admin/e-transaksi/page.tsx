'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Zap,
  QrCode,
  CreditCard,
  CheckCircle2,
  Search,
  RefreshCw,
  Eye,
  MessageCircle,
  Package,
  XCircle,
} from 'lucide-react';

interface ETransaction {
  id: string;
  invoice_number: string;
  buyer_name: string;
  buyer_phone: string;
  items: { name: string; quantity: number; price: number; subtotal: number }[];
  total_amount: number;
  payment_method: string;
  payment_status: string;
  transaction_status: string;
  created_at: string;
  user_id?: string;
  order_id?: string;
}

const statusLabels: Record<string, string> = {
  'PENDING': 'Menunggu',
  'PAID': 'Dibayar',
  'COMPLETED': 'Selesai',
  'CANCELLED': 'Dibatalkan',
};

const statusColors: Record<string, string> = {
  'PENDING': 'bg-amber-100 text-amber-800',
  'PAID': 'bg-blue-100 text-blue-800',
  'COMPLETED': 'bg-green-100 text-green-800',
  'CANCELLED': 'bg-red-100 text-red-800',
};

export default function AdminETransaksiPage() {
  const [transactions, setTransactions] = useState<ETransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTx, setSelectedTx] = useState<ETransaction | null>(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, paid: 0, completed: 0, cancelled: 0, totalRevenue: 0 });

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/e-transaksi');
      const data = await res.json();
      if (data.transactions) {
        setTransactions(data.transactions);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/e-transaksi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, transactionStatus: newStatus, paymentStatus: newStatus === 'PAID' ? 'PAID' : undefined }),
      });
      if (res.ok) {
        fetchTransactions();
        if (selectedTx?.id === id) {
          setSelectedTx({ ...selectedTx, transaction_status: newStatus, payment_status: newStatus === 'PAID' ? 'PAID' : selectedTx.payment_status });
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const filtered = transactions.filter((tx) => {
    const matchesSearch = tx.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.buyer_phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'ALL' || tx.transaction_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="h-6 w-6 text-orange-500" /> E-Transaksi
          </h2>
          <p className="text-sm text-gray-500">Kelola transaksi digital marketplace desa</p>
        </div>
        <Button variant="outline" onClick={fetchTransactions} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'bg-gray-50 text-gray-700 border-gray-200' },
          { label: 'Pending', value: stats.pending, color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { label: 'Dibayar', value: stats.paid, color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'Selesai', value: stats.completed, color: 'bg-green-50 text-green-700 border-green-200' },
          { label: 'Pendapatan', value: formatPrice(stats.totalRevenue), color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        ].map((s, i) => (
          <Card key={i} className={`border ${s.color}`}>
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-[10px] opacity-70">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari invoice, nama, atau telepon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {['ALL', 'PENDING', 'PAID', 'COMPLETED', 'CANCELLED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'ALL' ? 'Semua' : statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3" />
          Memuat data transaksi...
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-gray-200">
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-bold text-gray-600 mb-2">Tidak Ada Transaksi</h3>
            <p className="text-sm text-gray-500">Belum ada e-transaksi yang sesuai filter</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((tx) => (
            <Card key={tx.id} className={`border hover:shadow-md transition-shadow ${selectedTx?.id === tx.id ? 'ring-2 ring-orange-300 border-orange-200' : 'border-gray-200'}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      tx.payment_method === 'QRIS' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {tx.payment_method === 'QRIS' ? <QrCode className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-gray-900">#{tx.invoice_number}</span>
                        <Badge className={`${statusColors[tx.transaction_status] || 'bg-gray-100'} text-[10px]`}>
                          {statusLabels[tx.transaction_status] || tx.transaction_status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{tx.buyer_name} &middot; {tx.buyer_phone}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {tx.items?.length || 0} item &middot; {new Date(tx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-emerald-800">{formatPrice(tx.total_amount)}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{tx.payment_method}</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setSelectedTx(selectedTx?.id === tx.id ? null : tx)}>
                    <Eye className="h-3 w-3 mr-1" /> Detail
                  </Button>
                  {tx.transaction_status === 'PENDING' && (
                    <>
                      <Button size="sm" className="text-xs h-7 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => updateStatus(tx.id, 'PAID')}>
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Konfirmasi Bayar
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50" onClick={() => updateStatus(tx.id, 'CANCELLED')}>
                        <XCircle className="h-3 w-3 mr-1" /> Batalkan
                      </Button>
                    </>
                  )}
                  {tx.transaction_status === 'PAID' && (
                    <Button size="sm" className="text-xs h-7 bg-green-600 hover:bg-green-700 text-white" onClick={() => updateStatus(tx.id, 'COMPLETED')}>
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Selesai
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="text-xs h-7 border-green-200 text-green-700" onClick={() => {
                    const message = `E-Transaksi #${tx.invoice_number}\nTotal: ${formatPrice(tx.total_amount)}\nStatus: ${statusLabels[tx.transaction_status]}\nPembeli: ${tx.buyer_name}`;
                    window.open(`https://wa.me/6285150859735?text=${encodeURIComponent(message)}`, '_blank');
                  }}>
                    <MessageCircle className="h-3 w-3 mr-1" /> WA
                  </Button>
                </div>

                {/* Detail panel */}
                {selectedTx?.id === tx.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 bg-gray-50 rounded-lg p-3">
                    <h4 className="font-semibold text-sm mb-2">Detail Item:</h4>
                    <div className="space-y-1.5">
                      {tx.items?.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-gray-700">{item.name} x{item.quantity}</span>
                          <span className="font-medium text-gray-900">{formatPrice(item.subtotal || item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                      <span className="text-sm font-bold">Total</span>
                      <span className="text-sm font-bold text-emerald-700">{formatPrice(tx.total_amount)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
