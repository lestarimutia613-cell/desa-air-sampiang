'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Package, ArrowLeft, CheckCircle2, Truck,
  MessageCircle, QrCode, Receipt, ShieldCheck,
  Clock, Download, Search, Filter, Zap,
  ChevronDown, ChevronUp, RefreshCw, CreditCard
} from 'lucide-react';

interface TransactionItem {
  productId?: string;
  name: string;
  quantity: number;
  price: number;
  subtotal?: number;
}

interface ETransaction {
  id: string;
  invoiceNumber: string;
  buyerName: string;
  buyerPhone: string;
  items: TransactionItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionStatus: string;
  qrisContent?: string;
  whSentCount: number;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  'PENDING': 'bg-amber-100 text-amber-800',
  'PAID': 'bg-blue-100 text-blue-800',
  'COMPLETED': 'bg-green-100 text-green-800',
  'CANCELLED': 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  'PENDING': 'Menunggu Pembayaran',
  'PAID': 'Dibayar',
  'COMPLETED': 'Selesai',
  'CANCELLED': 'Dibatalkan',
};

const statusIcons: Record<string, React.ReactNode> = {
  'PENDING': <Clock className="h-3.5 w-3.5" />,
  'PAID': <CheckCircle2 className="h-3.5 w-3.5" />,
  'COMPLETED': <Truck className="h-3.5 w-3.5" />,
  'CANCELLED': <Receipt className="h-3.5 w-3.5" />,
};

export default function OrderHistoryPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [transactions, setTransactions] = useState<ETransaction[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, paid: 0, completed: 0, cancelled: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [expandedTx, setExpandedTx] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/e-transaksi?userId=${user.id}`);
      const data = await res.json();
      if (data.transactions) {
        setTransactions(data.transactions);
        setStats(data.stats);
      }
    } catch {} finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (!user) {
    return (
      <div className="py-12 min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Silakan masuk terlebih dahulu</p>
            <Button onClick={() => router.push('/login')} className="bg-emerald-600 hover:bg-emerald-700">Masuk</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const filteredTx = filterStatus === 'ALL' ? transactions : transactions.filter(t => t.transactionStatus === filterStatus);

  const handleSendETransaksi = async (tx: ETransaction) => {
    const items = tx.items.map((item) => `• ${item.name} x${item.quantity} = ${formatPrice(item.subtotal || item.price * item.quantity)}`).join('\n');
    const date = new Date(tx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = new Date(tx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const message = `🧾 *E-TRANSAKSI DIGITAL*
*Desa Air Sempiang Digital*
━━━━━━━━━━━━━━━━━━

📋 *Detail E-Transaksi:*
No. Invoice: *${tx.invoiceNumber}*
Tanggal: ${date}, ${time} WIB
Pembeli: ${tx.buyerName}

📦 *Item Pesanan:*
${items}

━━━━━━━━━━━━━━━━━━
💰 *Total: ${formatPrice(tx.totalAmount)}*

💳 *Metode: ${tx.paymentMethod}*
📌 *Status: ${statusLabels[tx.transactionStatus] || tx.transactionStatus}*

${tx.transactionStatus === 'PENDING' ? 'Mohon lakukan pembayaran dan kirim bukti ke nomor ini.' : 'Terima kasih atas pembayaran Anda!'}

*E-Transaksi Desa Air Sempiang*
Kec. Kabawetan, Kab. Kepahiang`;

    // Track WA send
    try {
      await fetch('/api/e-transaksi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tx.id, whSent: true }),
      });
    } catch {}

    window.open(`https://wa.me/6285150859735?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleConfirmPayment = async (tx: ETransaction) => {
    try {
      const res = await fetch('/api/e-transaksi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tx.id, transactionStatus: 'PAID', paymentStatus: 'PAID' }),
      });
      if (res.ok) fetchTransactions();
    } catch {}
  };

  const handleMarkCompleted = async (tx: ETransaction) => {
    try {
      const res = await fetch('/api/e-transaksi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tx.id, transactionStatus: 'COMPLETED' }),
      });
      if (res.ok) fetchTransactions();
    } catch {}
  };

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => router.push('/marketplace')} className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 mb-6 text-sm font-medium">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Marketplace
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Receipt className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900">E-Transaksi</h1>
            <p className="text-sm text-gray-500">Riwayat transaksi digital Marketplace Desa</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchTransactions} className="border-emerald-200 text-emerald-700">
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 mb-6">
          {[
            { label: 'Total Transaksi', value: stats.total.toString(), color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { label: 'Menunggu Bayar', value: stats.pending.toString(), color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { label: 'Dibayar', value: stats.paid.toString(), color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { label: 'Selesai', value: stats.completed.toString(), color: 'bg-green-50 text-green-700 border-green-200' },
          ].map((stat, i) => (
            <div key={i} className={`rounded-xl p-3 border text-center ${stat.color}`}>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-[10px] font-medium opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {['ALL', 'PENDING', 'PAID', 'COMPLETED', 'CANCELLED'].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filterStatus === s ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s === 'ALL' ? 'Semua' : statusLabels[s] || s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">{[1, 2, 3].map((i) => (<Card key={i} className="animate-pulse"><CardContent className="p-6"><div className="h-6 bg-gray-200 rounded mb-3" /><div className="h-4 bg-gray-100 rounded" /></CardContent></Card>))}</div>
        ) : filteredTx.length === 0 ? (
          <Card className="border-emerald-100">
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Belum ada e-transaksi</h3>
              <p className="text-gray-600 text-sm mb-4">Mulai berbelanja di marketplace desa</p>
              <Button onClick={() => router.push('/marketplace')} className="bg-emerald-600 hover:bg-emerald-700">Ke Marketplace</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTx.map((tx) => {
              const isExpanded = expandedTx === tx.id;
              return (
                <Card key={tx.id} className="border-emerald-100 hover:shadow-md transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.transactionStatus === 'COMPLETED' ? 'bg-green-100' : tx.transactionStatus === 'PENDING' ? 'bg-amber-100' : 'bg-emerald-100'}`}>
                          {statusIcons[tx.transactionStatus] || <Package className="h-4 w-4 text-emerald-600" />}
                        </div>
                        <div>
                          <span className="font-bold text-emerald-900 text-sm">#{tx.invoiceNumber}</span>
                          <div className="flex items-center gap-1.5">
                            {tx.paymentMethod === 'QRIS' && <QrCode className="h-3 w-3 text-emerald-500" />}
                            <span className="text-[10px] text-gray-500">{tx.paymentMethod}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={`${statusColors[tx.transactionStatus] || 'bg-gray-100'} flex items-center gap-1`}>
                        {statusIcons[tx.transactionStatus]}
                        {statusLabels[tx.transactionStatus] || tx.transactionStatus}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      {tx.items.slice(0, isExpanded ? undefined : 2).map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.name} x{item.quantity}</span>
                          <span className="font-medium">{formatPrice(item.subtotal || item.price * item.quantity)}</span>
                        </div>
                      ))}
                      {!isExpanded && tx.items.length > 2 && (
                        <button onClick={() => setExpandedTx(tx.id)} className="text-xs text-emerald-600 hover:text-emerald-800 flex items-center gap-1">
                          +{tx.items.length - 2} item lainnya <ChevronDown className="h-3 w-3" />
                        </button>
                      )}
                      {isExpanded && tx.items.length > 2 && (
                        <button onClick={() => setExpandedTx(null)} className="text-xs text-emerald-600 hover:text-emerald-800 flex items-center gap-1">
                          Sembunyikan <ChevronUp className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {tx.whSentCount > 0 && <span className="ml-2 text-green-500">WA: {tx.whSentCount}x</span>}
                      </span>
                      <span className="font-bold text-emerald-800">{formatPrice(tx.totalAmount)}</span>
                    </div>

                    <div className="flex gap-2 mt-3">
                      {tx.transactionStatus === 'PENDING' && (
                        <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-xs h-8" onClick={() => handleConfirmPayment(tx)}>
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Sudah Bayar
                        </Button>
                      )}
                      {tx.transactionStatus === 'PAID' && (
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-500 text-xs h-8" onClick={() => handleMarkCompleted(tx)}>
                          <Truck className="mr-1 h-3.5 w-3.5" /> Tandai Selesai
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className={`text-xs h-8 border-emerald-200 text-emerald-700 ${tx.transactionStatus !== 'PENDING' ? 'flex-1' : ''}`} onClick={() => handleSendETransaksi(tx)}>
                        <MessageCircle className="mr-1 h-3.5 w-3.5" /> E-Transaksi ke WA
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Semua e-transaksi aman & terverifikasi
          </p>
        </div>
      </div>
    </div>
  );
}
