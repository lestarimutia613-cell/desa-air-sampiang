'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  ShoppingBag,
  FileText,
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
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
  userId: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  buyerName: string;
  buyerPhone: string;
  createdAt: string;
  user?: { name: string; email: string };
  items: OrderItem[];
}

export default function AdminPage() {
  const { user } = useAppStore();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    Promise.all([
      fetch('/api/admin').then((r) => r.json()),
      fetch('/api/orders').then((r) => r.json()),
    ]).then(([s, o]) => {
      setStats(s);
      setOrders(o);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  if (user?.role !== 'ADMIN') {
    return (
      <div className="py-12 min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="font-bold text-gray-900 mb-2">Akses Ditolak</h2>
            <p className="text-gray-600 text-sm">Halaman ini hanya dapat diakses oleh administrator desa</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

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

  const statusColors: Record<string, string> = {
    'PENDING': 'bg-amber-100 text-amber-800',
    'PAID': 'bg-blue-100 text-blue-800',
    'PROCESSING': 'bg-purple-100 text-purple-800',
    'DELIVERED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<string, string> = {
    'PENDING': 'Menunggu',
    'PAID': 'Dibayar',
    'PROCESSING': 'Diproses',
    'DELIVERED': 'Terkirim',
    'CANCELLED': 'Dibatalkan',
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge className="bg-orange-100 text-orange-800 mb-2">Panel Admin</Badge>
            <h1 className="text-3xl font-bold text-emerald-900">Dashboard Admin Desa</h1>
            <p className="text-gray-600">Kelola layanan, pesanan, dan konten website desa</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="orders">Pesanan</TabsTrigger>
            <TabsTrigger value="management">Manajemen</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {stats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Pengguna', value: stats.totalUsers, icon: <Users className="h-5 w-5" />, color: 'bg-blue-100 text-blue-700' },
                  { label: 'Total Produk', value: stats.totalProducts, icon: <ShoppingBag className="h-5 w-5" />, color: 'bg-emerald-100 text-emerald-700' },
                  { label: 'Total Pesanan', value: stats.totalOrders, icon: <Package className="h-5 w-5" />, color: 'bg-purple-100 text-purple-700' },
                  { label: 'Pesanan Pending', value: stats.pendingOrders, icon: <Clock className="h-5 w-5" />, color: 'bg-amber-100 text-amber-700' },
                  { label: 'Total Berita', value: stats.totalNews, icon: <FileText className="h-5 w-5" />, color: 'bg-cyan-100 text-cyan-700' },
                  { label: 'Total Layanan', value: stats.totalServices, icon: <FileText className="h-5 w-5" />, color: 'bg-pink-100 text-pink-700' },
                  { label: 'Total Kursus', value: stats.totalCourses, icon: <TrendingUp className="h-5 w-5" />, color: 'bg-indigo-100 text-indigo-700' },
                  { label: 'Pendapatan', value: formatPrice(stats.totalRevenue._sum.totalAmount || 0), icon: <DollarSign className="h-5 w-5" />, color: 'bg-green-100 text-green-700' },
                ].map((stat, i) => (
                  <Card key={i} className="border-emerald-100">
                    <CardContent className="p-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${stat.color}`}>
                        {stat.icon}
                      </div>
                      <p className="text-2xl font-bold text-emerald-900">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Recent Orders */}
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-800">Pesanan Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {orders.slice(0, 10).map((order) => (
                    <div key={order.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {order.buyerName} - {order.items.map((i) => i.product?.name).join(', ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <Badge className={statusColors[order.status] || 'bg-gray-100'}>
                        {statusLabels[order.status] || order.status}
                      </Badge>
                      <p className="font-medium text-sm">{formatPrice(order.totalAmount)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-800">Kelola Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-bold text-emerald-900">{order.buyerName}</p>
                              <Badge className={statusColors[order.status]}>
                                {statusLabels[order.status]}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">Telepon: {order.buyerPhone}</p>
                            <p className="text-sm text-gray-600">
                              Pembayaran: {order.paymentMethod}
                            </p>
                            <div className="mt-2">
                              {order.items.map((item, i) => (
                                <p key={i} className="text-xs text-gray-500">
                                  {item.product?.name} x{item.quantity} = {formatPrice(item.price * item.quantity)}
                                </p>
                              ))}
                            </div>
                            <p className="font-bold text-emerald-800 mt-2">
                              Total: {formatPrice(order.totalAmount)}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(order.createdAt).toLocaleString('id-ID')}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            {order.status === 'PENDING' && (
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-500"
                                onClick={() => updateOrderStatus(order.id, 'PAID')}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" /> Konfirmasi Bayar
                              </Button>
                            )}
                            {order.status === 'PAID' && (
                              <Button
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-500"
                                onClick={() => updateOrderStatus(order.id, 'PROCESSING')}
                              >
                                <Eye className="h-4 w-4 mr-1" /> Proses
                              </Button>
                            )}
                            {order.status === 'PROCESSING' && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-500"
                                onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                              >
                                <Truck className="h-4 w-4 mr-1" /> Tandai Terkirim
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Kelola Produk', desc: 'Tambah, edit, atau hapus produk marketplace', count: stats?.totalProducts || 0, icon: <ShoppingBag className="h-6 w-6" /> },
                { title: 'Kelola Berita', desc: 'Publikasikan berita dan pengumuman desa', count: stats?.totalNews || 0, icon: <FileText className="h-6 w-6" /> },
                { title: 'Kelola Layanan', desc: 'Atur layanan desa yang tersedia', count: stats?.totalServices || 0, icon: <FileText className="h-6 w-6" /> },
                { title: 'Kelola Kursus', desc: 'Atur program Corporate University', count: stats?.totalCourses || 0, icon: <TrendingUp className="h-6 w-6" /> },
                { title: 'Data Pengguna', desc: 'Lihat data pengguna terdaftar', count: stats?.totalUsers || 0, icon: <Users className="h-6 w-6" /> },
                { title: 'Laporan Keuangan', desc: 'Lihat laporan pendapatan desa', count: 0, icon: <DollarSign className="h-6 w-6" /> },
              ].map((item, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow border-emerald-100">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-emerald-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.desc}</p>
                    <Badge className="bg-emerald-100 text-emerald-800">{item.count} data</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
