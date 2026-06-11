'use client';

import { useState, useEffect } from 'react';
import { useAppStore, CartItem } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag, Leaf, Package } from 'lucide-react';

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

export default function MarketplacePage() {
  const { user, cart, addToCart, removeFromCart, updateCartQuantity, clearCart, setCurrentPage, setPendingOrder, cartTotal } = useAppStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['ALL', ...Array.from(new Set(products.map((p) => p.category)))];
  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddToCart = (product: Product) => {
    if (!user) {
      setCurrentPage('login');
      return;
    }
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setPendingOrder({ items: [...cart], total: cartTotal() });
    setCurrentPage('payment');
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge className="bg-emerald-100 text-emerald-800 mb-3">Marketplace</Badge>
          <h1 className="text-3xl font-bold text-emerald-900 mb-3">Marketplace Desa Air Sempiang</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan produk unggulan UMKM dan pertanian lokal desa. Belanja langsung dari petani dan pengrajin Desa Air Sempiang.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Input
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-emerald-50'
                }`}
              >
                {cat === 'ALL' ? 'Semua' : cat}
              </button>
            ))}
          </div>
          {user && cart.length > 0 && (
            <Button
              onClick={() => setShowCart(!showCart)}
              className="bg-emerald-600 hover:bg-emerald-700 ml-auto relative"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Keranjang ({cart.length})
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </Badge>
            </Button>
          )}
        </div>

        {/* Cart Panel */}
        {showCart && user && (
          <Card className="mb-8 border-emerald-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-emerald-900 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" /> Keranjang Belanja
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>Tutup</Button>
              </div>
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Keranjang belanja kosong</p>
              ) : (
                <>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-emerald-700 text-sm font-bold">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateCartQuantity(item.productId, Math.max(0, item.quantity - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="font-bold text-sm text-emerald-800 w-28 text-right">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-xl font-bold text-emerald-800">{formatPrice(cartTotal())}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={clearCart}>Kosongkan</Button>
                      <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleCheckout}>
                        Checkout
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
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-40 bg-gray-200 rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-5 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-100 rounded mb-3" />
                  <div className="h-8 bg-gray-200 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => {
              const inCart = cart.find((c) => c.productId === product.id);
              return (
                <Card key={product.id} className="group hover:shadow-lg transition-all overflow-hidden border-emerald-100">
                  <div className="h-40 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center relative">
                    <Package className="h-16 w-16 text-emerald-400" />
                    <Badge className="absolute top-3 left-3 bg-white/90 text-emerald-800 text-[10px]">
                      {product.category}
                    </Badge>
                    {product.stock < 10 && (
                      <Badge className="absolute top-3 right-3 bg-red-100 text-red-700 text-[10px]">
                        Sisa {product.stock}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-emerald-900 mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{product.seller}</p>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-emerald-700">{formatPrice(product.price)}</p>
                      {inCart ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateCartQuantity(product.id, Math.max(0, inCart.quantity - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-6 text-center">{inCart.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateCartQuantity(product.id, inCart.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-xs"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {product.stock === 0 ? 'Habis' : 'Tambah'}
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
              <p className="text-sm text-amber-700 mb-4">Anda perlu masuk atau mendaftar terlebih dahulu untuk berbelanja di marketplace desa</p>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setCurrentPage('login')}>
                Masuk / Daftar
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
