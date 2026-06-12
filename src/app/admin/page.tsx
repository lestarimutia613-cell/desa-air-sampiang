'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  ShoppingBag,
  Package,
  DollarSign,
  Clock,
  FileText,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

interface OrderItem {
  product?: { name: string };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  buyer_name: string;
  buyer_phone: string;
  total_amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  items?: OrderItem[];
}

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

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin').then((r) => r.json()),
      fetch('/api/orders?admin=true').then((r) => r.json()),
    ]).then(([s, o]) => {
      setStats(s);
      setOrders(o);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500">Selamat datang di Panel Admin Desa Air Sempiang</p>
        </div>
        <Badge className="bg-orange-100 text-orange-800">Admin Panel</Badge>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Pengguna', value: stats.totalUsers, icon: <Users className="h-5 w-5" />, color: 'bg-blue-50 text-blue-600 border-blue-200' },
            { label: 'Total Produk', value: stats.totalProducts, icon: <ShoppingBag className="h-5 w-5" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
            { label: 'Total Pesanan', value: stats.totalOrders, icon: <Package className="h-5 w-5" />, color: 'bg-purple-50 text-purple-600 border-purple-200' },
            { label: 'Pesanan Pending', value: stats.pendingOrders, icon: <Clock className="h-5 w-5" />, color: 'bg-amber-50 text-amber-600 border-amber-200' },
            { label: 'Total Berita', value: stats.totalNews, icon: <FileText className="h-5 w-5" />, color: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
            { label: 'Total Layanan', value: stats.totalServices, icon: <FileText className="h-5 w-5" />, color: 'bg-pink-50 text-pink-600 border-pink-200' },
            { label: 'Total Kursus', value: stats.totalCourses, icon: <TrendingUp className="h-5 w-5" />, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
            { label: 'Pendapatan', value: formatPrice(stats.totalRevenue?._sum?.totalAmount || 0), icon: <DollarSign className="h-5 w-5" />, color: 'bg-green-50 text-green-600 border-green-200' },
          ].map((stat, i) => (
            <Card key={i} className={`border ${stat.color}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  {stat.icon}
                  <ArrowRight className="h-3 w-3 opacity-30" />
                </div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs opacity-70">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Recent Orders */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <h3 className="font-bold text-gray-900 mb-4">Pesanan Terbaru</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Memuat data...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-gray-400">Belum ada pesanan</div>
            ) : (
              orders.slice(0, 10).map((order) => (
                <div key={order.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {order.buyer_name} - {order.items?.map((i) => i.product?.name).join(', ')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <Badge className={statusColors[order.status] || 'bg-gray-100'}>
                    {statusLabels[order.status] || order.status}
                  </Badge>
                  <p className="font-medium text-sm">{formatPrice(order.total_amount)}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Kelola Produk', desc: 'Tambah, edit, atau hapus produk', count: stats?.totalProducts || 0, href: '/admin/products' },
          { title: 'Kelola Pesanan', desc: 'Proses dan konfirmasi pesanan', count: stats?.totalOrders || 0, href: '/admin/orders' },
          { title: 'Kelola Berita', desc: 'Publikasikan berita desa', count: stats?.totalNews || 0, href: '/admin/news' },
          { title: 'Kelola Layanan', desc: 'Atur layanan desa', count: stats?.totalServices || 0, href: '/admin/services' },
          { title: 'Kelola Kursus', desc: 'Atur program Corporate University', count: stats?.totalCourses || 0, href: '/admin/courses' },
          { title: 'Pengaturan', desc: 'Konfigurasi website desa', count: 0, href: '/admin/settings' },
        ].map((item, i) => (
          <Card key={i} className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
              </div>
              <p className="text-xs text-gray-500 mb-3">{item.desc}</p>
              {item.count > 0 && (
                <Badge className="bg-gray-100 text-gray-700">{item.count} data</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
