'use client';

import { useState } from 'react';
import { useAppStore, CartItem } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  CreditCard,
  Smartphone,
  Building2,
  Receipt,
  Printer,
  CheckCircle2,
  Package,
  AlertCircle,
  QrCode,
  Copy,
  Check,
  Download,
  MessageCircle,
  Clock,
  ShieldCheck,
  Zap,
  X,
  ShoppingCart,
  ArrowLeft,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ETransaksiModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = 'summary' | 'payment' | 'success';

export default function ETransaksiModal({ open, onClose }: ETransaksiModalProps) {
  const { user, pendingOrder, clearCart, setPendingOrder } = useAppStore();
  const [step, setStep] = useState<Step>('summary');
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [buyerName, setBuyerName] = useState(user?.name || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || '');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

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

  const resetAndClose = () => {
    setStep('summary');
    setPaymentMethod('QRIS');
    setOrderResult(null);
    setError('');
    setCopied(false);
    setBankAccount('');
    setBankName('');
    onClose();
  };

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
    if (!user || !pendingOrder) return;
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
      setStep('success');
    } catch {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const generateWhatsAppMessage = () => {
    if (!orderResult || !pendingOrder) return '';
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

  const handleSendWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const url = `https://wa.me/6285150859735?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    const printContent = document.getElementById('e-receipt-content');
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
      </style></head><body>
      ${printContent.innerHTML}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownloadReceipt = () => {
    const receipt = document.getElementById('e-receipt-content');
    if (!receipt) return;
    const blob = new Blob([receipt.innerText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `e-transaksi-${orderResult?.invoiceNumber || 'receipt'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // No order data
  if (!pendingOrder) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && resetAndClose()}>
        <DialogContent className="max-w-md">
          <div className="p-6 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Tidak ada pesanan yang sedang diproses</p>
            <Button onClick={resetAndClose} className="bg-emerald-600 hover:bg-emerald-700">
              Kembali ke Marketplace
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ====== SUCCESS STEP ======
  if (step === 'success' && orderResult) {
    const date = new Date(orderResult.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = new Date(orderResult.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    return (
      <Dialog open={open} onOpenChange={(v) => !v && resetAndClose()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-5 py-4 text-white flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-base">E-Transaksi Berhasil!</h2>
                <p className="text-emerald-200 text-xs">Transaksi digital Anda telah dicatat</p>
              </div>
            </div>
            <button onClick={resetAndClose} className="text-white/70 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Receipt Content */}
          <div id="e-receipt-content" className="p-5 space-y-4 font-mono">
            {/* E-Transaction Badge */}
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

            {/* QRIS Section */}
            {isQRIS && (
              <>
                <div className="border-t border-dashed border-gray-200" />
                <div className="bg-white border-2 border-emerald-200 rounded-xl p-4 text-center">
                  <p className="text-xs font-bold text-emerald-700 mb-3">SCAN QRIS UNTUK BAYAR</p>
                  <div className="w-44 h-44 mx-auto bg-white p-2 rounded-lg border border-gray-100 shadow-inner flex items-center justify-center">
                    <QRCodeSVG
                      value={qrisContent}
                      size={160}
                      bgColor="#FFFFFF"
                      fgColor="#065f46"
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">Scan dengan e-wallet atau mobile banking</p>
                  <p className="text-sm font-bold text-emerald-800 mt-1">{formatPrice(pendingOrder.total)}</p>
                  <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">GoPay</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">OVO</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">DANA</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">ShopeePay</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">m-Banking</span>
                  </div>
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
          </div>

          {/* Action Buttons */}
          <div className="px-5 pb-5 flex flex-col gap-3">
            <Button
              className="w-full bg-green-600 hover:bg-green-500 py-5 text-base"
              onClick={handleSendWhatsApp}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Kirim E-Transaksi ke WhatsApp
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="py-4 border-emerald-200 text-emerald-700"
                onClick={handleDownloadReceipt}
              >
                <Download className="mr-2 h-4 w-4" /> Unduh
              </Button>
              <Button
                variant="outline"
                className="py-4 border-emerald-200 text-emerald-700"
                onClick={handlePrint}
              >
                <Printer className="mr-2 h-4 w-4" /> Cetak
              </Button>
            </div>
            <Button
              variant="ghost"
              className="w-full py-3 text-gray-500"
              onClick={resetAndClose}
            >
              Kembali ke Marketplace
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ====== PAYMENT STEP ======
  if (step === 'payment') {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && resetAndClose()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-5 py-4 text-white flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button onClick={() => setStep('summary')} className="text-white/70 hover:text-white mr-1">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-base">Pembayaran</h2>
                <p className="text-emerald-200 text-xs">{formatPrice(pendingOrder.total)}</p>
              </div>
            </div>
            <button onClick={resetAndClose} className="text-white/70 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Payment Method Selection */}
            <div>
              <p className="text-sm font-bold text-emerald-800 mb-3">Pilih Metode Pembayaran</p>
              <div className="grid grid-cols-2 gap-2">
                {paymentOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPaymentMethod(opt.value)}
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
            </div>

            {/* QRIS Preview */}
            {isQRIS && (
              <div className="border-2 border-emerald-200 rounded-xl p-4 bg-gradient-to-b from-emerald-50 to-white">
                <div className="flex items-center gap-2 mb-3">
                  <QrCode className="h-5 w-5 text-emerald-600" />
                  <p className="font-bold text-emerald-800 text-sm">Pembayaran QRIS</p>
                  <Badge className="bg-emerald-100 text-emerald-700 text-[9px] ml-auto">Scan & Bayar</Badge>
                </div>
                <div className="w-40 h-40 mx-auto bg-white p-2 rounded-lg border border-gray-100 shadow-inner flex items-center justify-center mb-3">
                  <QRCodeSVG
                    value={qrisContent}
                    size={140}
                    bgColor="#FFFFFF"
                    fgColor="#065f46"
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Scan dengan e-wallet atau mobile banking</p>
                  <p className="text-lg font-bold text-emerald-800">{formatPrice(pendingOrder.total)}</p>
                  <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">GoPay</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">OVO</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">DANA</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">ShopeePay</span>
                  </div>
                </div>
                <div className="mt-3">
                  <button
                    onClick={handleCopyQRIS}
                    className="w-full flex items-center justify-center gap-1 text-xs text-emerald-700 bg-emerald-100 hover:bg-emerald-200 py-2 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Tersalin!' : 'Salin Kode QRIS'}
                  </button>
                </div>
              </div>
            )}

            {/* Non-QRIS Payment Detail */}
            {selectedPayment && !isQRIS && (
              <div className="p-3 bg-emerald-50 rounded-lg text-sm text-emerald-700">
                {selectedPayment.detail}
              </div>
            )}

            <Separator />

            {/* Buyer Info */}
            <div className="space-y-4">
              <p className="text-sm font-bold text-emerald-800">Informasi Pembeli</p>
              <div className="space-y-2">
                <Label htmlFor="modal-buyerName" className="text-xs">Nama Pembeli *</Label>
                <Input
                  id="modal-buyerName"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Nama lengkap pembeli"
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-buyerPhone" className="text-xs">Nomor WhatsApp Pembeli *</Label>
                <Input
                  id="modal-buyerPhone"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="h-9"
                />
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" /> E-transaksi akan dikirim ke WhatsApp ini
                </p>
              </div>
              {isBank && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="modal-bankAccount" className="text-xs">Nomor Rekening Pengirim</Label>
                    <Input
                      id="modal-bankAccount"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      placeholder="Nomor rekening yang digunakan"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modal-bankName" className="text-xs">Nama Rekening Pengirim</Label>
                    <Input
                      id="modal-bankName"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="Nama sesuai rekening"
                      className="h-9"
                    />
                  </div>
                </>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Security badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Transaksi aman & terenkripsi</span>
            </div>

            <Button
              onClick={handlePayment}
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-5 text-base"
              disabled={loading}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              {loading ? 'Memproses E-Transaksi...' : `Bayar ${formatPrice(pendingOrder.total)}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ====== SUMMARY STEP (default) ======
  return (
    <Dialog open={open} onOpenChange={(v) => !v && resetAndClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-5 py-4 text-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base">Checkout E-Transaksi</h2>
              <p className="text-emerald-200 text-xs">Ringkasan pesanan Anda</p>
            </div>
          </div>
          <button onClick={resetAndClose} className="text-white/70 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Items */}
          <div className="space-y-3">
            {pendingOrder.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.quantity} x {formatPrice(item.price)}</p>
                </div>
                <p className="font-medium text-sm text-emerald-800">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center bg-emerald-50 rounded-lg p-4">
            <div>
              <p className="text-sm text-gray-500">Total Pembayaran</p>
              <p className="text-2xl font-bold text-emerald-800">{formatPrice(pendingOrder.total)}</p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700">
              {pendingOrder.items.reduce((s, i) => s + i.quantity, 0)} item
            </Badge>
          </div>

          {/* Buyer Info Preview */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="summary-buyerName" className="text-xs font-medium">Nama Pembeli *</Label>
              <Input
                id="summary-buyerName"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Nama lengkap pembeli"
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary-buyerPhone" className="text-xs font-medium">Nomor WhatsApp *</Label>
              <Input
                id="summary-buyerPhone"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="h-9"
              />
            </div>
          </div>

          {/* E-Transaksi Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs font-medium text-amber-800 mb-1 flex items-center gap-1">
              <Zap className="h-3 w-3" /> E-Transaksi Digital
            </p>
            <p className="text-[11px] text-amber-700">
              Setelah pembayaran, e-transaksi akan otomatis dicatat dan dapat dikirim ke WhatsApp sebagai bukti transaksi resmi.
            </p>
          </div>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Transaksi aman & terenkripsi</span>
          </div>

          <Button
            onClick={() => {
              if (!buyerName || !buyerPhone) {
                setError('Nama dan nomor telepon wajib diisi');
                return;
              }
              setError('');
              setStep('payment');
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 py-5 text-base"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Lanjut ke Pembayaran
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
