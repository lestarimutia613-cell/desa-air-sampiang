'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  CreditCard,
  Smartphone,
  Building2,
  Receipt,
  Printer,
  CheckCircle2,
  ArrowLeft,
  Package,
} from 'lucide-react';

export default function PaymentPage() {
  const { user, pendingOrder, setCurrentPage, clearCart } = useAppStore();
  const [paymentMethod, setPaymentMethod] = useState('BANK_BRI');
  const [buyerName, setBuyerName] = useState(user?.name || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || '');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [error, setError] = useState('');

  if (!user || !pendingOrder) {
    return (
      <div className="py-12 min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Tidak ada pesanan yang sedang diproses</p>
            <Button onClick={() => setCurrentPage('marketplace')} className="bg-emerald-600 hover:bg-emerald-700">
              Kembali ke Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const paymentOptions = [
    { value: 'BANK_BRI', label: 'Bank BRI', icon: <Building2 className="h-5 w-5" />, detail: 'Transfer ke BRI: 0012-01-000456-789 (Desa Air Sempiang)' },
    { value: 'BANK_MANDIRI', label: 'Bank Mandiri', icon: <Building2 className="h-5 w-5" />, detail: 'Transfer ke Mandiri: 123-000-456-7890 (Desa Air Sempiang)' },
    { value: 'BANK_BNI', label: 'Bank BNI', icon: <Building2 className="h-5 w-5" />, detail: 'Transfer ke BNI: 0098-765-4321 (Desa Air Sempiang)' },
    { value: 'GOPAY', label: 'GoPay', icon: <Smartphone className="h-5 w-5" />, detail: 'Kirim ke 085150859735 a.n. Desa Air Sempiang' },
    { value: 'OVO', label: 'OVO', icon: <Smartphone className="h-5 w-5" />, detail: 'Kirim ke 085150859735 a.n. Desa Air Sempiang' },
    { value: 'DANA', label: 'DANA', icon: <Smartphone className="h-5 w-5" />, detail: 'Kirim ke 085150859735 a.n. Desa Air Sempiang' },
  ];

  const selectedPayment = paymentOptions.find((p) => p.value === paymentMethod);
  const isBank = paymentMethod.startsWith('BANK');

  const handlePayment = async () => {
    if (!buyerName || !buyerPhone) {
      setError('Nama dan nomor telepon pembeli wajib diisi');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: pendingOrder.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          paymentMethod,
          buyerName,
          buyerPhone,
          bankAccount: isBank ? bankAccount : undefined,
          bankName: isBank ? bankName : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal membuat pesanan');
        return;
      }

      setOrderResult(data);
      clearCart();
    } catch {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content');
    if (!printContent) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Bukti Transaksi - Desa Air Sempiang</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #065f46; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { color: #065f46; margin: 0; font-size: 18px; }
        .header p { margin: 4px 0; font-size: 12px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { text-align: left; padding: 8px; border-bottom: 1px solid #eee; font-size: 13px; }
        th { background: #f0fdf4; color: #065f46; }
        .total { text-align: right; font-size: 16px; font-weight: bold; color: #065f46; margin: 15px 0; }
        .info { margin: 10px 0; font-size: 13px; }
        .info strong { color: #065f46; }
        .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
      </style></head><body>
      ${printContent.innerHTML}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Order Success View
  if (orderResult) {
    return (
      <div className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-emerald-900">Pesanan Berhasil Dibuat!</h1>
            <p className="text-gray-600 mt-2">Silakan lakukan pembayaran sesuai metode yang dipilih</p>
          </div>

          <div id="receipt-content">
            <Card className="border-emerald-200">
              <CardHeader className="bg-emerald-50">
                <CardTitle className="text-emerald-800 text-center">
                  <Receipt className="h-5 w-5 inline mr-2" />
                  Bukti Transaksi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="text-center border-b pb-4">
                  <h2 className="font-bold text-emerald-800">Desa Air Sempiang</h2>
                  <p className="text-xs text-gray-500">Kec. Kabawetan, Kab. Kepahiang, Prov. Bengkulu</p>
                  <p className="text-xs text-gray-500">No. Pesanan: {orderResult.id.substring(0, 12).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">Tanggal: {new Date(orderResult.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Nama Pembeli</p>
                    <p className="font-medium">{buyerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">No. Telepon</p>
                    <p className="font-medium">{buyerPhone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Metode Pembayaran</p>
                    <p className="font-medium">{selectedPayment?.label}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <Badge className="bg-amber-100 text-amber-800">Menunggu Pembayaran</Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="font-bold text-emerald-800 mb-2">Detail Pesanan</p>
                  <div className="space-y-2">
                    {pendingOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between text-lg font-bold text-emerald-800">
                    <span>Total</span>
                    <span>{formatPrice(pendingOrder.total)}</span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-amber-800 mb-1">Instruksi Pembayaran:</p>
                  <p className="text-sm text-amber-700">{selectedPayment?.detail}</p>
                  <p className="text-xs text-amber-600 mt-2">
                    Kirim bukti pembayaran ke WhatsApp 085150859735 dengan menyertakan nomor pesanan Anda.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4 mt-6 justify-center">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Cetak Bukti
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => setCurrentPage('beranda')}
            >
              Kembali ke Beranda
            </Button>
            <a
              href={`https://wa.me/6285150859735?text=${encodeURIComponent(
                `Halo, saya ${buyerName} ingin mengirim bukti pembayaran untuk pesanan ${orderResult.id.substring(0, 12).toUpperCase()} sebesar ${formatPrice(pendingOrder.total)}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-green-600 hover:bg-green-500">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Kirim Bukti via WA
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Payment Form View
  return (
    <div className="py-12">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => setCurrentPage('marketplace')}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 mb-6 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Marketplace
        </button>

        <h1 className="text-2xl font-bold text-emerald-900 mb-6">Pembayaran</h1>

        {/* Order Summary */}
        <Card className="border-emerald-200 mb-6">
          <CardHeader>
            <CardTitle className="text-emerald-800 text-lg">Ringkasan Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingOrder.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} x {formatPrice(item.price)}</p>
                  </div>
                  <p className="font-medium text-sm">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold text-emerald-800 text-lg">
                <span>Total</span>
                <span>{formatPrice(pendingOrder.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="border-emerald-200 mb-6">
          <CardHeader>
            <CardTitle className="text-emerald-800 text-lg">Metode Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {paymentOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPaymentMethod(opt.value)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    paymentMethod === opt.value
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <div className={`mx-auto mb-1 ${paymentMethod === opt.value ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {opt.icon}
                  </div>
                  <p className={`text-xs font-medium ${paymentMethod === opt.value ? 'text-emerald-800' : 'text-gray-600'}`}>
                    {opt.label}
                  </p>
                </button>
              ))}
            </div>
            {selectedPayment && (
              <div className="mt-4 p-3 bg-emerald-50 rounded-lg text-sm text-emerald-700">
                {selectedPayment.detail}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Buyer Info */}
        <Card className="border-emerald-200 mb-6">
          <CardHeader>
            <CardTitle className="text-emerald-800 text-lg">Informasi Pembeli</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buyerName">Nama Pembeli *</Label>
              <Input
                id="buyerName"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Nama lengkap pembeli"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyerPhone">Nomor Telepon Pembeli *</Label>
              <Input
                id="buyerPhone"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                required
              />
              <p className="text-xs text-gray-400">Bukti transaksi akan dikirim ke nomor ini</p>
            </div>
            {isBank && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bankAccount">Nomor Rekening Pengirim</Label>
                  <Input
                    id="bankAccount"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="Nomor rekening yang digunakan untuk transfer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankName">Nama Rekening Pengirim</Label>
                  <Input
                    id="bankName"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Nama sesuai rekening"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <Button
          onClick={handlePayment}
          className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 text-lg"
          disabled={loading}
        >
          <CreditCard className="mr-2 h-5 w-5" />
          {loading ? 'Memproses...' : `Bayar ${formatPrice(pendingOrder.total)}`}
        </Button>
      </div>
    </div>
  );
}
