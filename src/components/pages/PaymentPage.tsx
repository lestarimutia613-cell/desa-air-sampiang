'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
            name: item.name,
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

  // Generate WhatsApp message text
  const generateWhatsAppMessage = () => {
    if (!orderResult) return '';
    const items = pendingOrder.items.map((item) => `• ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`).join('\n');
    const date = new Date(orderResult.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = new Date(orderResult.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    return `🛒 *BUKTI TRANSAKSI*
*Desa Air Sempiang Digital*
━━━━━━━━━━━━━━━━━━

Dear ${buyerName},

Terima kasih sudah berbelanja di *Marketplace Desa Air Sempiang* 🎉

📋 *Detail Pesanan:*
No. Invoice: *${orderResult.invoiceNumber}*
Tanggal: ${date}, ${time} WIB

📦 *Item Pesanan:*
${items}

━━━━━━━━━━━━━━━━━━
💰 *Total Pembayaran: ${formatPrice(pendingOrder.total)}*

💳 *Metode Pembayaran:*
${selectedPayment?.label}
${selectedPayment?.detail}

📌 *Status: MENUNGGU PEMBAYARAN*

Mohon lakukan pembayaran sesuai metode di atas, lalu kirim bukti pembayaran ke nomor ini.

Salam hormat,
*Marketplace Desa Air Sempiang*
Kec. Kabawetan, Kab. Kepahiang, Bengkulu`;
  };

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content');
    if (!printContent) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Bukti Transaksi - Desa Air Sempiang</title>
      <style>
        body { font-family: 'Courier New', monospace; padding: 20px; color: #333; max-width: 400px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 2px dashed #065f46; padding-bottom: 12px; margin-bottom: 16px; }
        .header h1 { color: #065f46; margin: 0; font-size: 16px; }
        .header p { margin: 4px 0; font-size: 11px; color: #666; }
        .row { display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0; }
        .row-bold { font-weight: bold; font-size: 14px; }
        .separator { border-top: 1px dashed #ccc; margin: 8px 0; }
        .title { font-weight: bold; font-size: 13px; color: #065f46; margin: 8px 0 4px; }
        .item { font-size: 12px; padding: 2px 0; }
        .footer { margin-top: 16px; text-align: center; font-size: 10px; color: #999; border-top: 1px dashed #ccc; padding-top: 8px; }
        .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
      </style></head><body>
      ${printContent.innerHTML}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSendWhatsApp = () => {
    const message = generateWhatsAppMessage();
    // Send to village WhatsApp number 085150859735
    const url = `https://wa.me/6285150859735?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Order Success View
  if (orderResult) {
    const date = new Date(orderResult.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = new Date(orderResult.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    return (
      <div className="py-12">
        <div className="max-w-lg mx-auto px-4">
          <div className="text-center mb-6">
            <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-emerald-900">Pesanan Berhasil!</h1>
            <p className="text-gray-500 text-sm mt-1">Silakan lakukan pembayaran sesuai metode yang dipilih</p>
          </div>

          {/* WhatsApp-style Receipt */}
          <div id="receipt-content">
            <Card className="border-0 shadow-2xl overflow-hidden">
              {/* Green header */}
              <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-5 py-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Receipt className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base">Desa Air Sempiang Digital</h2>
                    <p className="text-emerald-200 text-xs">Kec. Kabawetan, Kab. Kepahiang</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-5 space-y-4 font-mono">
                {/* Greeting */}
                <div>
                  <p className="text-sm text-gray-700">Dear <span className="font-bold">{buyerName}</span>,</p>
                  <p className="text-sm text-gray-600 mt-1">Terima kasih sudah berbelanja di <span className="font-bold text-emerald-700">Marketplace Desa Air Sempiang</span> 🎉</p>
                </div>

                <div className="border-t border-dashed border-gray-200" />

                {/* Invoice Info */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Detail Pesanan</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">No. Invoice</span>
                    <span className="font-bold text-gray-900">{orderResult.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tanggal</span>
                    <span className="text-gray-700">{date}, {time} WIB</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-200" />

                {/* Items */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Item Pesanan</p>
                  {pendingOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.name} x{item.quantity}</span>
                      <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-gray-200" />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-800 text-sm">Total Pembayaran</span>
                  <span className="font-bold text-emerald-800 text-lg">{formatPrice(pendingOrder.total)}</span>
                </div>

                <div className="border-t border-dashed border-gray-200" />

                {/* Payment Method */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Metode Pembayaran</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Metode</span>
                    <span className="font-bold text-gray-900">{selectedPayment?.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">{selectedPayment?.detail}</p>
                </div>

                <div className="border-t border-dashed border-gray-200" />

                {/* Status */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status</span>
                  <Badge className="bg-amber-100 text-amber-800 font-bold">MENUNGGU PEMBAYARAN</Badge>
                </div>

                {/* Instruction */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-amber-800 mb-1">📌 Instruksi:</p>
                  <p className="text-xs text-amber-700">Mohon lakukan pembayaran sesuai metode di atas, lalu kirim bukti pembayaran ke WhatsApp desa di nomor <span className="font-bold">085150859735</span>.</p>
                </div>

                <div className="border-t border-dashed border-gray-200" />

                {/* Closing */}
                <div className="text-center text-xs text-gray-400">
                  <p>Salam hormat,</p>
                  <p className="font-bold text-emerald-700">Marketplace Desa Air Sempiang</p>
                  <p>Kec. Kabawetan, Kab. Kepahiang, Bengkulu</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-6">
            <Button
              className="w-full bg-green-600 hover:bg-green-500 py-5 text-base"
              onClick={handleSendWhatsApp}
            >
              <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Kirim Bukti ke WhatsApp Desa
            </Button>
            <Button
              variant="outline"
              className="w-full py-4"
              onClick={handlePrint}
            >
              <Printer className="mr-2 h-4 w-4" /> Cetak Bukti Transaksi
            </Button>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-4"
              onClick={() => setCurrentPage('beranda')}
            >
              Kembali ke Beranda
            </Button>
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
              <p className="text-xs text-gray-400">Bukti transaksi akan dikirim ke nomor WhatsApp ini</p>
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
