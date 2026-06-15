'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, ArrowLeft, CheckCircle2, Truck, 
  MessageCircle, QrCode, Receipt, ShieldCheck, 
  Clock, Download, Search, Filter, Zap,
  ChevronDown, ChevronUp
} from 'lucide-react';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: { name: string };
}

interface Order {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  buyerName: string;
  buyerPhone: string;
  createdAt: string;
  items: OrderItem[];
}

const statusColors: Record<string, string> = {
  'PENDING': 'bg-amber-100 text-amber-800',
  'PAID': 'bg-blue-100 text-blue-800',
  'PROCESSING': 'bg-purple-100 text-purple-800',
  'DELIVERED': 'bg-green-100 text-green-800',
  'CANCELLED': 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  'PENDING': 'Menunggu Pembayaran',
  'PAID': 'Dibayar',
  'PROCESSING': 'Sedang Diproses',
  'DELIVERED': 'Terkirim',
  'CANCELLED': 'Dibatalkan',
};

const statusIcons: Record<string, React.ReactNode> = {
  'PENDING': <Clock className="h-3.5 w-3.5" />,
  'PAID': <CheckCircle2 className="h-3.5 w-3.5" />,
  'PROCESSING': <Package className="h-3.5 w-3.5" />,
  'DELIVERED': <Truck className="h-3.5 w-3.5" />,
  'CANCELLED': <Receipt className="h-3.5 w-3.5" />,
};

const paymentIcons: Record<string, React.ReactNode> = {
  'QRIS': <QrCode className="h-4 w-4 text-emerald-600" />,
  'GOPAY': <span className="text-xs font-bold text-green-600">G</span>,
  'OVO': <span className="text-xs font-bold text-purple-600">O</span>,
  'DANA': <span className="text-xs font-bold text-blue-600">D</span>,
};

export default function OrderHistoryPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/orders?userId=${user.id}`)
      .then((r) => r.json())
      .then((d) => { setOrders(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="py-12 min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Silakan masuk terlebih dahulu</p>
            <Button onClick={() => router.push('/login')} className="bg-emerald-600 hover:bg-emerald-700">
              Masuk
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const filteredOrders = filterStatus === 'ALL' ? orders : orders.filter(o => o.status === filterStatus);

  const handleSendETransaksi = (order: Order) => {
    const items = order.items.map((item) => `• ${item.product?.name || 'Produk'} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`).join('\n');
    const date = new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const invoice = order.invoiceNumber || order.id.substring(0, 12).toUpperCase();

    const message = `🧾 *E-TRANSAKSI DIGITAL*
*Desa Air Sempiang Digital*
━━━━━━━━━━━━━━━━━━

📋 *Detail E-Transaksi:*
No. Invoice: *${invoice}*
Tanggal: ${date}, ${time} WIB
Pembeli: ${order.buyerName}

📦 *Item Pesanan:*
${items}

━━━━━━━━━━━━━━━━━━
💰 *Total: ${formatPrice(order.totalAmount)}*

💳 *Metode: ${order.paymentMethod}*
📌 *Status: ${statusLabels[order.status] || order.status}*

${order.status === 'PENDING' ? 'Mohon lakukan pembayaran dan kirim bukti ke nomor ini.' : 'Terima kasih atas pembayaran Anda!'}

*E-Transaksi Desa Air Sempiang*
Kec. Kabawetan, Kab. Kepahiang`;

    window.open(`https://wa.me/6285150859735?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 mb-6 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Receipt className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900">E-Transaksi</h1>
            <p className="text-sm text-gray-500">Riwayat transaksi digital Marketplace Desa</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 mb-6">
          {[
            { label: 'Total Transaksi', value: orders.length.toString(), color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { label: 'Menunggu Bayar', value: orders.filter(o => o.status === 'PENDING').length.toString(), color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { label: 'Dibayar', value: orders.filter(o => o.status === 'PAID').length.toString(), color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { label: 'Selesai', value: orders.filter(o => o.status === 'DELIVERED').length.toString(), color: 'bg-green-50 text-green-700 border-green-200' },
          ].map((stat, i) => (
            <div key={i} className={`rounded-xl p-3 border text-center ${stat.color}`}>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-[10px] font-medium opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {['ALL', 'PENDING', 'PAID', 'PROCESSING', 'DELIVERED', 'CANCELLED'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                filterStatus === s
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'ALL' ? 'Semua' : statusLabels[s] || s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3" />
                  <div className="h-4 bg-gray-100 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card className="border-emerald-100">
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Belum ada e-transaksi</h3>
              <p className="text-gray-600 text-sm mb-4">Mulai berbelanja di marketplace desa</p>
              <Button onClick={() => router.push('/marketplace')} className="bg-emerald-600 hover:bg-emerald-700">
                Ke Marketplace
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const invoice = order.invoiceNumber || order.id.substring(0, 12).toUpperCase();
              const isExpanded = expandedOrder === order.id;
              const isQRIS = order.paymentMethod === 'QRIS';
              
              return (
                <Card key={order.id} className="border-emerald-100 hover:shadow-md transition-all">
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          order.status === 'DELIVERED' ? 'bg-green-100' : 
                          order.status === 'PENDING' ? 'bg-amber-100' : 'bg-emerald-100'
                        }`}>
                          {statusIcons[order.status] || <Package className="h-4 w-4 text-emerald-600" />}
                        </div>
                        <div>
                          <span className="font-bold text-emerald-900 text-sm">#{invoice}</span>
                          <div className="flex items-center gap-1.5">
                            {isQRIS && <QrCode className="h-3 w-3 text-emerald-500" />}
                            <span className="text-[10px] text-gray-500">{order.paymentMethod}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={`${statusColors[order.status] || 'bg-gray-100'} flex items-center gap-1`}>
                        {statusIcons[order.status]}
                        {statusLabels[order.status] || order.status}
                      </Badge>
                    </div>

                    {/* Items summary */}
                    <div className="space-y-1.5 mb-3">
                      {order.items.slice(0, isExpanded ? undefined : 2).map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.product?.name || 'Produk'} x{item.quantity}</span>
                          <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                      {!isExpanded && order.items.length > 2 && (
                        <button
                          onClick={() => setExpandedOrder(order.id)}
                          className="text-xs text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
                        >
                          +{order.items.length - 2} item lainnya <ChevronDown className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="font-bold text-emerald-800">{formatPrice(order.totalAmount)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      {order.status === 'PENDING' && (
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-500 text-xs"
                          onClick={() => handleSendETransaksi(order)}
                        >
                          <MessageCircle className="mr-1 h-3.5 w-3.5" />
                          Kirim Bukti via WA
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className={`text-xs ${order.status !== 'PENDING' ? 'flex-1' : ''} border-emerald-200 text-emerald-700`}
                        onClick={() => handleSendETransaksi(order)}
                      >
                        <Zap className="mr-1 h-3.5 w-3.5" />
                        E-Transaksi ke WA
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Bottom info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Semua e-transaksi aman & terverifikasi
          </p>
        </div>
      </div>
    </div>
  );
}
