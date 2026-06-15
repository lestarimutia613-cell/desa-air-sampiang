'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, CheckCircle2, Eye, Truck, Loader2 } from 'lucide-react';

interface OrderItem {
  product?: { name: string };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  invoiceNumber: string;
  buyerName: string;
  buyerPhone: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items?: OrderItem[];
}

const statusColors: Record<string, string> = {
  'PENDING': 'bg-amber-100 text-amber-800',
  'PAID': 'bg-blue-100 text-blue-800',
  'PROCESSING': 'bg-purple-100 text-purple-800',
  'DELIVERED': 'bg-green-100 text-green-800',
  'COMPLETED': 'bg-green-100 text-green-800',
  'CANCELLED': 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  'PENDING': 'Menunggu',
  'PAID': 'Dibayar',
  'PROCESSING': 'Diproses',
  'DELIVERED': 'Terkirim',
  'COMPLETED': 'Selesai',
  'CANCELLED': 'Dibatalkan',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders?admin=true');
      const data = await res.json();
      // Normalize both snake_case (Supabase) and camelCase (Prisma) to camelCase
      const normalized = Array.isArray(data) ? data.map((o: Record<string, unknown>) => ({
        id: o.id,
        invoiceNumber: o.invoiceNumber ?? o.invoice_number ?? '',
        buyerName: o.buyerName ?? o.buyer_name ?? '',
        buyerPhone: o.buyerPhone ?? o.buyer_phone ?? '',
        totalAmount: Number(o.totalAmount ?? o.total_amount ?? 0),
        status: o.status ?? 'PENDING',
        paymentMethod: o.paymentMethod ?? o.payment_method ?? '',
        createdAt: o.createdAt ?? o.created_at ?? '',
        items: o.items as OrderItem[] | undefined,
      })) : [];
      setOrders(normalized);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const res = await fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status }),
    });
    if (res.ok) {
      setOrders(orders.map((o) => o.id === orderId ? { ...o, status } : o));
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola Pesanan</h2>
          <p className="text-sm text-gray-500">{orders.length} pesanan total</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'PENDING', 'PAID', 'PROCESSING', 'DELIVERED', 'COMPLETED', 'CANCELLED'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === s ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s === 'ALL' ? 'Semua' : statusLabels[s]} ({s === 'ALL' ? orders.length : orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" /> Memuat pesanan...
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <Card key={order.id} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-bold text-gray-900">{order.buyerName}</p>
                      <Badge className={statusColors[order.status] || 'bg-gray-100'}>
                        {statusLabels[order.status] || order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">Telepon: {order.buyerPhone}</p>
                    <p className="text-sm text-gray-500">Pembayaran: {order.paymentMethod}</p>
                    {order.items && order.items.map((item, i) => (
                      <p key={i} className="text-xs text-gray-400">
                        {item.product?.name} x{item.quantity} = {formatPrice(item.price * item.quantity)}
                      </p>
                    ))}
                    <p className="font-bold text-orange-600 mt-2">Total: {formatPrice(order.totalAmount)}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {order.status === 'PENDING' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-500" onClick={() => updateOrderStatus(order.id, 'PAID')}>
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Konfirmasi
                      </Button>
                    )}
                    {order.status === 'PAID' && (
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-500" onClick={() => updateOrderStatus(order.id, 'PROCESSING')}>
                        <Eye className="h-4 w-4 mr-1" /> Proses
                      </Button>
                    )}
                    {order.status === 'PROCESSING' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-500" onClick={() => updateOrderStatus(order.id, 'DELIVERED')}>
                        <Truck className="h-4 w-4 mr-1" /> Terkirim
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Tidak ada pesanan</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
