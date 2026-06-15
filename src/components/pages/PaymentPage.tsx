'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  AlertCircle,
  QrCode,
  Copy,
  Check,
  Download,
  Share2,
  MessageCircle,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function PaymentPage() {
  const router = useRouter();
  const { user, pendingOrder, clearCart } = useAppStore();
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [buyerName, setBuyerName] = useState(user?.name || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || '');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQRIS, setShowQRIS] = useState(false);

  if (!user || !pendingOrder) {
    return (
      <div className="py-12 min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Tidak ada pesanan yang sedang diproses</p>
            <Button onClick={() => router.push('/marketplace')} className="bg-emerald-600 hover:bg-emerald-700">
              Kembali ke Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  // Generate QRIS content (simulated - in production this would come from a payment gateway)
  const qrisContent = `00020101021226580014COM.GO-JEK.WWW0118936009140336118750215ID10200032110303UME51440014ID.CO.QRIS.WWW0215ID20200032110303UME5204581253033605802ID5915DESA AIR SEMPIANG6007JAKARTA61051234062240520${Date.now().toString().slice(-8)}0703UME6304`;

  const paymentOptions = [
    { 
      value: 'QRIS', 
      label: 'QRIS', 
      icon: <QrCode className="h-5 w-5" />, 
      detail: 'Scan QR code menggunakan e-wallet atau mobile banking manapun',
      badge: 'Rekomendasi',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      popular: true,
    },
    { value: 'BANK_BRI', label: 'Bank BRI', icon: <Building2 className="h-5 w-5" />, detail: 'Transfer ke BRI: 0012-01-000456-789 (Desa Air Sempiang)' },
    { value: 'BANK_MANDIRI', label: 'Bank Mandiri', icon: <Building2 className="h-5 w-5" />, detail: 'Transfer ke Mandiri: 123-000-456-7890 (Desa Air Sempiang)' },
    { value: 'BANK_BNI', label: 'Bank BNI', icon: <Building2 className="h-5 w-5" />, detail: 'Transfer ke BNI: 0098-765-4321 (Desa Air Sempiang)' },
    { value: 'GOPAY', label: 'GoPay', icon: <Smartphone className="h-5 w-5" />, detail: 'Kirim ke 085150859735 a.n. Desa Air Sempiang' },
    { value: 'OVO', label: 'OVO', icon: <Smartphone className="h-5 w-5" />, detail: 'Kirim ke 085150859735 a.n. Desa Air Sempiang' },
    { value: 'DANA', label: 'DANA', icon: <Smartphone className="h-5 w-5" />, detail: 'Kirim ke 085150859735 a.n. Desa Air Sempiang' },
  ];

  const selectedPayment = paymentOptions.find((p) => p.value === paymentMethod);
  const isBank = paymentMethod.startsWith('BANK');
  const isQRIS = paymentMethod === 'QRIS';

  const handleCopyQRIS = () => {
    navigator.clipboard.writeText(qrisContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  // Generate WhatsApp e-transaction message
  const generateWhatsAppMessage = () => {
    if (!orderResult) return '';
    const items = pendingOrder.items.map((item) => `• ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`).join('\n');
    const date = new Date(orderResult.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = new Date(orderResult.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    return `🧾 *E-TRANSAKSI DIGITAL*
*Desa Air Sempiang Digital*
━━━━━━━━━━━━━━━━━━

Dear ${buyerName},

Terima kasih sudah berbelanja di *Marketplace Desa Air Sempiang* 🎉

📋 *Detail E-Transaksi:*
No. Invoice: *${orderResult.invoiceNumber}*
Tanggal: ${date}, ${time} WIB
Status: *E-TRANSAKSI TERVERIFIKASI*

📦 *Item Pesanan:*
${items}

━━━━━━━━━━━━━━━━━━
💰 *Total Pembayaran: ${formatPrice(pendingOrder.total)}*

💳 *Metode Pembayaran:*
${selectedPayment?.label}
${selectedPayment?.detail}

${isQRIS ? '✅ Pembayaran QRIS - Scan & Bayar\n📱 Status: Menunggu Scan QR' : '📌 *Status: MENUNGGU PEMBAYARAN*'}

Mohon lakukan pembayaran sesuai metode di atas, lalu kirim bukti pembayaran ke nomor ini.

Salam hormat,
*E-Transaksi Desa Air Sempiang*
Kec. Kabawetan, Kab. Kepahiang, Bengkulu`;
  };

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content');
    if (!printContent) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>E-Transaksi - Desa Air Sempiang</title>
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
        .badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
        .qris-box { text-align: center; padding: 12px; border: 2px solid #065f46; border-radius: 8px; margin: 8px 0; }
        .qris-box svg { width: 180px; height: 180px; }
      </style></head><body>
      ${printContent.innerHTML}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSendWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const url = `https://wa.me/6285150859735?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleDownloadReceipt = () => {
    const receipt = document.getElementById('receipt-content');
    if (!receipt) return;
    const blob = new Blob([receipt.innerText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `e-transaksi-${orderResult?.invoiceNumber || 'receipt'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate SVG QR Code
  const generateQRSVG = () => {
    // Simulated QR pattern - in production use a real QR library
    const modules = 21;
    const cellSize = 8;
    const size = modules * cellSize;
    
    // Create a deterministic pattern based on the QRIS content
    let rects = '';
    const seed = qrisContent.length;
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        // Finder patterns (3 corners)
        const isTopLeft = row < 7 && col < 7;
        const isTopRight = row < 7 && col >= modules - 7;
        const isBottomLeft = row >= modules - 7 && col < 7;
        
        if (isTopLeft || isTopRight || isBottomLeft) {
          const r = isTopLeft ? row : isBottomLeft ? row - (modules - 7) : row;
          const c = isTopLeft ? col : isTopRight ? col - (modules - 7) : col;
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          if (isBorder || isInner) {
            rects += `<rect x="${col * cellSize}" y="${row * cellSize}" width="${cellSize}" height="${cellSize}" fill="#065f46"/>`;
          }
        } else if ((row + col + seed) % 3 === 0 || (row * col + seed) % 5 === 0) {
          rects += `<rect x="${col * cellSize}" y="${row * cellSize}" width="${cellSize}" height="${cellSize}" fill="#065f46"/>`;
        }
      }
    }
    
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" fill="white" rx="4"/>
      ${rects}
    </svg>`;
  };

  // Order Success / E-Transaksi View
  if (orderResult) {
    const date = new Date(orderResult.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = new Date(orderResult.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    return (
      <div className="py-12">
        <div className="max-w-lg mx-auto px-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-200">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-emerald-900">E-Transaksi Berhasil!</h1>
            <p className="text-gray-500 text-sm mt-1">Transaksi digital Anda telah dicatat</p>
          </div>

          {/* E-Transaction Receipt */}
          <div id="receipt-content">
            <Card className="border-0 shadow-2xl overflow-hidden">
              {/* Green header */}
              <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-5 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Receipt className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-base">E-Transaksi Digital</h2>
                      <p className="text-emerald-200 text-xs">Desa Air Sempiang</p>
                    </div>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30 text-xs">E-RECEIPT</Badge>
                </div>
              </div>

              <CardContent className="p-5 space-y-4 font-mono">
                {/* Greeting */}
                <div>
                  <p className="text-sm text-gray-700">Dear <span className="font-bold">{buyerName}</span>,</p>
                  <p className="text-sm text-gray-600 mt-1">Terima kasih! Transaksi Anda di <span className="font-bold text-emerald-700">Marketplace Desa Air Sempiang</span> berhasil dicatat.</p>
                </div>

                <div className="border-t border-dashed border-gray-200" />

                {/* E-Transaction Badge & Info */}
                <div className="bg-emerald-50 rounded-lg p-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                    <Zap className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">E-Transaksi Terverifikasi</p>
                    <p className="text-xs text-emerald-600">Transaksi digital aman & tercatat</p>
                  </div>
                </div>

                {/* Invoice Info */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Detail Transaksi</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">No. Invoice</span>
                    <span className="font-bold text-gray-900">{orderResult.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tanggal</span>
                    <span className="text-gray-700">{date}, {time} WIB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pembeli</span>
                    <span className="text-gray-700">{buyerName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Telepon</span>
                    <span className="text-gray-700">{buyerPhone}</span>
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
                <div className="flex justify-between items-center bg-emerald-50 rounded-lg p-3">
                  <span className="font-bold text-emerald-800 text-sm">Total Pembayaran</span>
                  <span className="font-bold text-emerald-800 text-lg">{formatPrice(pendingOrder.total)}</span>
                </div>

                <div className="border-t border-dashed border-gray-200" />

                {/* Payment Method */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Metode Pembayaran</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Metode</span>
                    <span className="font-bold text-gray-900 flex items-center gap-1">
                      {selectedPayment?.icon} {selectedPayment?.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">{selectedPayment?.detail}</p>
                </div>

                {/* QRIS Section in Receipt */}
                {isQRIS && (
                  <>
                    <div className="border-t border-dashed border-gray-200" />
                    <div className="bg-white border-2 border-emerald-200 rounded-xl p-4 text-center">
                      <p className="text-xs font-bold text-emerald-700 mb-3">SCAN QRIS UNTUK BAYAR</p>
                      <div className="w-44 h-44 mx-auto bg-white p-2 rounded-lg border border-gray-100 shadow-inner flex items-center justify-center">
                        <QRCodeSVG value={qrisContent} size={160} bgColor="#FFFFFF" fgColor="#065f46" level="M" />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2">Scan dengan e-wallet atau mobile banking</p>
                      <p className="text-sm font-bold text-emerald-800 mt-1">{formatPrice(pendingOrder.total)}</p>
                    </div>
                  </>
                )}

                <div className="border-t border-dashed border-gray-200" />

                {/* Status */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status</span>
                  <Badge className={isQRIS ? 'bg-blue-100 text-blue-800 font-bold' : 'bg-amber-100 text-amber-800 font-bold'}>
                    {isQRIS ? 'MENUNGGU SCAN QR' : 'MENUNGGU PEMBAYARAN'}
                  </Badge>
                </div>

                {/* Instruction */}
                <div className={`rounded-lg p-3 ${isQRIS ? 'bg-blue-50 border border-blue-200' : 'bg-amber-50 border border-amber-200'}`}>
                  <p className={`text-xs font-medium mb-1 flex items-center gap-1 ${isQRIS ? 'text-blue-800' : 'text-amber-800'}`}>
                    <AlertCircle className="h-3 w-3" /> Instruksi Pembayaran:
                  </p>
                  {isQRIS ? (
                    <div className="text-xs text-blue-700 space-y-1">
                      <p>1. Buka e-wallet atau mobile banking Anda</p>
                      <p>2. Pilih menu "Scan QR" / "QRIS"</p>
                      <p>3. Scan QR code di atas</p>
                      <p>4. Konfirmasi pembayaran sebesar <span className="font-bold">{formatPrice(pendingOrder.total)}</span></p>
                      <p>5. Kirim bukti ke WhatsApp desa</p>
                    </div>
                  ) : (
                    <p className="text-xs text-amber-700">Mohon lakukan pembayaran sesuai metode di atas, lalu kirim bukti pembayaran ke WhatsApp desa di nomor <span className="font-bold">085150859735</span>.</p>
                  )}
                </div>

                <div className="border-t border-dashed border-gray-200" />

                {/* Closing */}
                <div className="text-center text-xs text-gray-400">
                  <p className="flex items-center justify-center gap-1"><ShieldCheck className="h-3 w-3" /> E-Transaksi Aman & Terverifikasi</p>
                  <p className="font-bold text-emerald-700 mt-1">Marketplace Desa Air Sempiang</p>
                  <p>Kec. Kabawetan, Kab. Kepahiang, Bengkulu</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-6">
            {/* Primary: Send to WhatsApp */}
            <Button
              className="w-full bg-green-600 hover:bg-green-500 py-5 text-base"
              onClick={handleSendWhatsApp}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Kirim E-Transaksi ke WhatsApp
            </Button>

            <div className="grid grid-cols-2 gap-3">
              {/* Download receipt */}
              <Button
                variant="outline"
                className="py-4 border-emerald-200 text-emerald-700"
                onClick={handleDownloadReceipt}
              >
                <Download className="mr-2 h-4 w-4" /> Unduh
              </Button>
              {/* Print receipt */}
              <Button
                variant="outline"
                className="py-4 border-emerald-200 text-emerald-700"
                onClick={handlePrint}
              >
                <Printer className="mr-2 h-4 w-4" /> Cetak
              </Button>
            </div>

            {/* Secondary actions */}
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-4"
              onClick={() => router.push('/order-history')}
            >
              <Package className="mr-2 h-4 w-4" /> Lihat Riwayat Transaksi
            </Button>
            <Button
              variant="ghost"
              className="w-full py-3 text-gray-500"
              onClick={() => router.push('/')}
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
          onClick={() => router.push('/marketplace')}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 mb-6 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Marketplace
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-emerald-900">Pembayaran E-Transaksi</h1>
            <p className="text-sm text-gray-500">Transaksi digital aman & terverifikasi</p>
          </div>
        </div>

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
                  onClick={() => { setPaymentMethod(opt.value); setShowQRIS(false); }}
                  className={`relative p-3 rounded-xl border-2 text-center transition-all ${
                    paymentMethod === opt.value
                      ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                      : 'border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  {opt.badge && (
                    <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] px-2 py-0.5 rounded-full font-bold ${opt.badgeColor}`}>
                      {opt.badge}
                    </span>
                  )}
                  <div className={`mx-auto mb-1 ${paymentMethod === opt.value ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {opt.icon}
                  </div>
                  <p className={`text-xs font-medium ${paymentMethod === opt.value ? 'text-emerald-800' : 'text-gray-600'}`}>
                    {opt.label}
                  </p>
                </button>
              ))}
            </div>
            
            {/* QRIS Preview */}
            {isQRIS && (
              <div className="mt-4 border-2 border-emerald-200 rounded-xl p-4 bg-gradient-to-b from-emerald-50 to-white">
                <div className="flex items-center gap-2 mb-3">
                  <QrCode className="h-5 w-5 text-emerald-600" />
                  <p className="font-bold text-emerald-800 text-sm">Pembayaran QRIS</p>
                  <Badge className="bg-emerald-100 text-emerald-700 text-[9px] ml-auto">Scan & Bayar</Badge>
                </div>
                <div className="w-40 h-40 mx-auto bg-white p-2 rounded-lg border border-gray-100 shadow-inner flex items-center justify-center mb-3">
                  <QRCodeSVG value={qrisContent} size={140} bgColor="#FFFFFF" fgColor="#065f46" level="M" />
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Scan dengan e-wallet atau mobile banking</p>
                  <p className="text-lg font-bold text-emerald-800">{formatPrice(pendingOrder.total)}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">GoPay</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">OVO</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">DANA</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">ShopeePay</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">m-Banking</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={handleCopyQRIS}
                    className="flex-1 flex items-center justify-center gap-1 text-xs text-emerald-700 bg-emerald-100 hover:bg-emerald-200 py-2 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Tersalin!' : 'Salin Kode QRIS'}
                  </button>
                </div>
              </div>
            )}

            {selectedPayment && !isQRIS && (
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
              <Label htmlFor="buyerPhone">Nomor WhatsApp Pembeli *</Label>
              <Input
                id="buyerPhone"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                required
              />
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <MessageCircle className="h-3 w-3" /> E-transaksi & bukti pembayaran akan dikirim ke WhatsApp ini
              </p>
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

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 mb-4 text-xs text-gray-400">
          <ShieldCheck className="h-4 w-4" />
          <span>Transaksi aman & terenkripsi</span>
        </div>

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
          {loading ? 'Memproses E-Transaksi...' : `Bayar ${formatPrice(pendingOrder.total)}`}
        </Button>
      </div>
    </div>
  );
}
