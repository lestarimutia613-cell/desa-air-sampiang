'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ArrowLeft, Clock, CheckCircle2, Truck, Eye } from 'lucide-react';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: { name: string };
}

interface Order {
  id: string;
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

export default function OrderHistoryPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 mb-6 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>

        <h1 className="text-3xl font-bold text-emerald-900 mb-6">Riwayat Pesanan</h1>

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
        ) : orders.length === 0 ? (
          <Card className="border-emerald-100">
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Belum ada pesanan</h3>
              <p className="text-gray-600 text-sm mb-4">Mulai berbelanja di marketplace desa</p>
              <Button onClick={() => router.push('/marketplace')} className="bg-emerald-600 hover:bg-emerald-700">
                Ke Marketplace
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="border-emerald-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-emerald-600" />
                      <span className="font-bold text-emerald-900">
                        #{order.id.substring(0, 12).toUpperCase()}
                      </span>
                    </div>
                    <Badge className={statusColors[order.status] || 'bg-gray-100'}>
                      {statusLabels[order.status] || order.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.product?.name} x{item.quantity}</span>
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="font-bold text-emerald-800">{formatPrice(order.totalAmount)}</span>
                  </div>
                  {order.status === 'PENDING' && (
                    <a
                      href={`https://wa.me/6285150859735?text=${encodeURIComponent(
                        `Halo, saya ${order.buyerName} ingin mengirim bukti pembayaran untuk pesanan #${order.id.substring(0, 12).toUpperCase()} sebesar ${formatPrice(order.totalAmount)}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" className="mt-3 bg-green-600 hover:bg-green-500 w-full">
                        Kirim Bukti Pembayaran via WhatsApp
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
