'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag, Package, Store, Search, CreditCard, MessageCircle, QrCode, Clock, CheckCircle2, Truck, Zap, RefreshCw } from 'lucide-react';
import ETransaksiModal from '@/components/chat/ETransaksiModal';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  seller: string;
}

interface ETransaction {
  id: string;
  invoiceNumber: string;
  buyerName: string;
  buyerPhone: string;
  items: { name: string; quantity: number; price: number; subtotal: number }[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionStatus: string;
  createdAt: string;
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

export default function MarketplacePage() {
  const router = useRouter();
  const { user, cart, addToCart, removeFromCart, updateCartQuantity, clearCart, setPendingOrder, cartTotal } = useAppStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [eTransaksiOpen, setETransaksiOpen] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<ETransaction[]>([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [transStats, setTransStats] = useState({ total: 0, pending: 0, paid: 0, completed: 0, totalRevenue: 0 });

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.filter((p: Product) => p.category === 'UMKM'));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/e-transaksi?userId=${user.id}`);
      const data = await res.json();
      if (data.transactions) {
        setRecentTransactions(data.transactions.slice(0, 10));
        setTransStats(data.stats);
      }
    } catch {}
  }, [user]);

  useEffect(() => {
    if (user) {
      fetch(`/api/e-transaksi?userId=${user.id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.transactions) {
            setRecentTransactions(data.transactions.slice(0, 10));
            setTransStats(data.stats);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    if (!user) { router.push('/login'); return; }
    addToCart({ productId: product.id, name: product.name, price: product.price, quantity: 1, image: product.image });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setPendingOrder({ items: [...cart], total: cartTotal() });
    setETransaksiOpen(true);
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const handleSendETransaksiWA = async (tx: ETransaction) => {
    const items = tx.items.map((item) => `• ${item.name} x${item.quantity} = ${formatPrice(item.subtotal || item.price * item.quantity)}`).join('\n');
    const date = new Date(tx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = new Date(tx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const message = `🧾 *E-TRANSAKSI DIGITAL*
*Desa Air Sempiang Digital*
━━━━━━━━━━━━━━━━━━

📋 *Detail:*
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

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge className="bg-orange-100 text-orange-800 mb-3">Marketplace UMKM</Badge>
          <h1 className="text-3xl font-bold text-emerald-900 mb-3">Produk UMKM Desa Air Sempiang</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Temukan produk unggulan Usaha Mikro Kecil Menengah lokal desa. Belanja langsung dari pengrajin dan pelaku UMKM Desa Air Sempiang.</p>
        </div>

        {/* UMKM Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Pelaku UMKM', value: '25+', icon: <Store className="h-5 w-5" />, color: 'bg-orange-50 text-orange-600 border-orange-200' },
            { label: 'Produk Tersedia', value: products.length.toString(), icon: <Package className="h-5 w-5" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
            { label: 'Kategori', value: 'UMKM', icon: <ShoppingBag className="h-5 w-5" />, color: 'bg-blue-50 text-blue-600 border-blue-200' },
            { label: 'Pesan Sekarang', value: 'Gratis Ongkir', icon: <ShoppingCart className="h-5 w-5" />, color: 'bg-green-50 text-green-600 border-green-200' },
          ].map((stat, i) => (
            <Card key={i} className={`border ${stat.color}`}>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">{stat.icon}</div>
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-xs opacity-70">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Cari produk UMKM..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2 ml-auto">
            {user && (
              <Button onClick={() => { setShowTransactions(!showTransactions); if (!showTransactions) fetchTransactions(); }}
                variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                <CreditCard className="h-4 w-4 mr-2" /> E-Transaksi
                {transStats.pending > 0 && <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-amber-500 text-white text-[10px]">{transStats.pending}</Badge>}
              </Button>
            )}
            {user && cart.length > 0 && (
              <Button onClick={() => setShowCart(!showCart)} className="bg-emerald-600 hover:bg-emerald-700 relative">
                <ShoppingCart className="h-4 w-4 mr-2" /> Keranjang ({cart.length})
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500">{cart.reduce((s, i) => s + i.quantity, 0)}</Badge>
              </Button>
            )}
          </div>
        </div>

        {/* E-Transaksi Panel */}
        {showTransactions && user && (
          <Card className="mb-8 border-emerald-200 shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-emerald-900 flex items-center gap-2"><Zap className="h-5 w-5" /> E-Transaksi Saya</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={fetchTransactions} className="text-emerald-600"><RefreshCw className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowTransactions(false)}>Tutup</Button>
                </div>
              </div>

              {/* Transaction Stats */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { label: 'Total', value: transStats.total.toString(), color: 'bg-emerald-50 text-emerald-700' },
                  { label: 'Pending', value: transStats.pending.toString(), color: 'bg-amber-50 text-amber-700' },
                  { label: 'Dibayar', value: transStats.paid.toString(), color: 'bg-blue-50 text-blue-700' },
                  { label: 'Selesai', value: transStats.completed.toString(), color: 'bg-green-50 text-green-700' },
                ].map((s, i) => (
                  <div key={i} className={`rounded-lg p-2 text-center ${s.color}`}>
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-[10px]">{s.label}</p>
                  </div>
                ))}
              </div>

              {recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm">Belum ada e-transaksi</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.paymentMethod === 'QRIS' ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                            {tx.paymentMethod === 'QRIS' ? <QrCode className="h-4 w-4 text-emerald-600" /> : <CreditCard className="h-4 w-4 text-blue-600" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">#{tx.invoiceNumber}</p>
                            <p className="text-[10px] text-gray-500">{new Date(tx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${statusColors[tx.transactionStatus] || 'bg-gray-100'} text-[10px]`}>{statusLabels[tx.transactionStatus] || tx.transactionStatus}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">{tx.items.length} item</p>
                        <p className="font-bold text-sm text-emerald-800">{formatPrice(tx.totalAmount)}</p>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {tx.transactionStatus === 'PENDING' && (
                          <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-[11px] h-7" onClick={() => handleConfirmPayment(tx)}>
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Sudah Bayar
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className={`text-[11px] h-7 border-green-200 text-green-700 ${tx.transactionStatus !== 'PENDING' ? 'flex-1' : ''}`} onClick={() => handleSendETransaksiWA(tx)}>
                          <MessageCircle className="mr-1 h-3 w-3" /> Kirim WA
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Cart Panel */}
        {showCart && user && (
          <Card className="mb-8 border-emerald-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-emerald-900 flex items-center gap-2"><ShoppingCart className="h-5 w-5" /> Keranjang Belanja</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>Tutup</Button>
              </div>
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Keranjang belanja kosong</p>
              ) : (
                <>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center"><Package className="h-6 w-6 text-emerald-600" /></div>
                        <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{item.name}</p><p className="text-emerald-700 text-sm font-bold">{formatPrice(item.price)}</p></div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateCartQuantity(item.productId, Math.max(0, item.quantity - 1))}><Minus className="h-3 w-3" /></Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => removeFromCart(item.productId)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                        <p className="font-bold text-sm text-emerald-800 w-28 text-right">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm text-gray-500">Total</p><p className="text-xl font-bold text-emerald-800">{formatPrice(cartTotal())}</p></div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={clearCart}>Kosongkan</Button>
                      <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleCheckout}>
                        <CreditCard className="h-4 w-4 mr-2" /> Checkout
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse"><div className="h-40 bg-gray-200 rounded-t-lg" /><CardContent className="p-4"><div className="h-5 bg-gray-200 rounded mb-2" /><div className="h-4 bg-gray-100 rounded mb-3" /><div className="h-8 bg-gray-200 rounded" /></CardContent></Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-gray-200"><CardContent className="p-12 text-center"><ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" /><h3 className="font-bold text-gray-600 mb-2">Produk Tidak Ditemukan</h3><p className="text-sm text-gray-500">Coba gunakan kata kunci pencarian lain</p></CardContent></Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => {
              const inCart = cart.find((c) => c.productId === product.id);
              return (
                <Card key={product.id} className="group hover:shadow-lg transition-all overflow-hidden border-orange-100">
                  <div className="h-40 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center relative">
                    <Store className="h-16 w-16 text-orange-300" />
                    <Badge className="absolute top-3 left-3 bg-white/90 text-orange-800 text-[10px]">UMKM</Badge>
                    {product.stock < 10 && <Badge className="absolute top-3 right-3 bg-red-100 text-red-700 text-[10px]">Sisa {product.stock}</Badge>}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-emerald-900 mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{product.seller}</p>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-emerald-700">{formatPrice(product.price)}</p>
                      {inCart ? (
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateCartQuantity(product.id, Math.max(0, inCart.quantity - 1))}><Minus className="h-3 w-3" /></Button>
                          <span className="text-sm font-medium w-6 text-center">{inCart.quantity}</span>
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateCartQuantity(product.id, inCart.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                        </div>
                      ) : (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs" onClick={() => handleAddToCart(product)} disabled={product.stock === 0}>
                          <Plus className="h-3 w-3 mr-1" />{product.stock === 0 ? 'Habis' : 'Tambah'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!user && (
          <Card className="mt-8 border-amber-200 bg-amber-50">
            <CardContent className="p-6 text-center">
              <ShoppingBag className="h-8 w-8 text-amber-600 mx-auto mb-3" />
              <h3 className="font-bold text-amber-800 mb-2">Masuk untuk Berbelanja</h3>
              <p className="text-sm text-amber-700 mb-4">Anda perlu masuk atau mendaftar terlebih dahulu untuk berbelanja di marketplace UMKM desa</p>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push('/login')}>Masuk / Daftar</Button>
            </CardContent>
          </Card>
        )}
      </div>

      <ETransaksiModal open={eTransaksiOpen} onClose={() => { setETransaksiOpen(false); fetchTransactions(); }} />
    </div>
  );
}
