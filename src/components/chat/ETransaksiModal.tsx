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
  Truck,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ETransaksiModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = 'summary' | 'payment' | 'success';

interface TransactionItem {
  productId?: string;
  name: string;
  quantity: number;
  price: number;
  subtotal?: number;
}

interface TransactionResult {
  id: string;
  invoiceNumber: string;
  buyerName: string;
  buyerPhone: string;
  items: TransactionItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionStatus: string;
  qrisContent?: string;
  createdAt: string;
}

const WA_NUMBER = '6285150859735';

const statusLabels: Record<string, string> = {
  'PENDING': 'Menunggu Pembayaran',
  'PAID': 'Dibayar',
  'PROCESSING': 'Sedang Diproses',
  'COMPLETED': 'Selesai',
  'CANCELLED': 'Dibatalkan',
};

export default function ETransaksiModal({ open, onClose }: ETransaksiModalProps) {
  const { user, pendingOrder, clearCart } = useAppStore();
  const [step, setStep] = useState<Step>('summary');
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [buyerName, setBuyerName] = useState(user?.name || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || '');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const paymentOptions = [
    { value: 'QRIS', label: 'QRIS', icon: <QrCode className="h-5 w-5" />, detail: 'Scan QR code menggunakan e-wallet atau mobile banking manapun', badge: 'Rekomendasi', badgeColor: 'bg-emerald-100 text-emerald-700' },
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
    setTransactionResult(null);
    setError('');
    setCopied(false);
    setBankAccount('');
    setBankName('');
    onClose();
  };

  const handleCopyQRIS = () => {
    if (transactionResult?.qrisContent) {
      navigator.clipboard.writeText(transactionResult.qrisContent);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateTransaction = async () => {
    if (!buyerName || !buyerPhone) {
      setError('Nama dan nomor telepon wajib diisi');
      return;
    }
    if (!pendingOrder) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/e-transaksi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || null,
          buyerName,
          buyerPhone,
          buyerEmail: user?.email || null,
          items: pendingOrder.items.map(item => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal membuat transaksi');
        return;
      }

      setTransactionResult(data);
      clearCart();
      setStep('success');
    } catch {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const handleSendWhatsApp = async () => {
    if (!transactionResult || !pendingOrder) return;

    const items = transactionResult.items.map((item) => `• ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`).join('\n');
    const date = new Date(transactionResult.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = new Date(transactionResult.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const message = `🧾 *E-TRANSAKSI DIGITAL*
*Desa Air Sempiang Digital*
━━━━━━━━━━━━━━━━━━

Dear ${buyerName},

Terima kasih sudah berbelanja di *Marketplace Desa Air Sempiang* 🎉

📋 *Detail E-Transaksi:*
No. Invoice: *${transactionResult.invoiceNumber}*
Tanggal: ${date}, ${time} WIB
Status: *E-TRANSAKSI TERVERIFIKASI*

📦 *Item Pesanan:*
${items}

━━━━━━━━━━━━━━━━━━
💰 *Total Pembayaran: ${formatPrice(transactionResult.totalAmount)}*

💳 *Metode Pembayaran:*
${selectedPayment?.label}
${selectedPayment?.detail}

${isQRIS ? '✅ Pembayaran QRIS - Scan & Bayar\n📱 Status: Menunggu Scan QR' : '📌 *Status: MENUNGGU PEMBAYARAN*'}

Mohon lakukan pembayaran sesuai metode di atas, lalu kirim bukti pembayaran ke nomor ini.

Salam hormat,
*E-Transaksi Desa Air Sempiang*
Kec. Kabawetan, Kab. Kepahiang, Bengkulu`;

    // Track WhatsApp send
    try {
      await fetch('/api/e-transaksi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: transactionResult.id, whSent: true }),
      });
    } catch {}

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleConfirmPayment = async () => {
    if (!transactionResult) return;
    try {
      const res = await fetch('/api/e-transaksi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: transactionResult.id, transactionStatus: 'PAID', paymentStatus: 'PAID' }),
      });
      const data = await res.json();
      if (res.ok) {
        setTransactionResult({ ...transactionResult, transactionStatus: 'PAID', paymentStatus: 'PAID' });
      }
    } catch {}
  };

  const handlePrint = () => {
    const printContent = document.getElementById('e-receipt-print');
    if (!printContent) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<html><head><title>E-Transaksi - ${transactionResult?.invoiceNumber || 'Receipt'}</title>
      <style>body{font-family:'Courier New',monospace;padding:20px;color:#333;max-width:400px;margin:0 auto}
      .row{display:flex;justify-content:space-between;font-size:12px;padding:3px 0}
      .sep{border-top:1px dashed #ccc;margin:8px 0}
      .title{font-weight:bold;font-size:13px;color:#065f46;margin:8px 0 4px}
      .footer{text-align:center;font-size:10px;color:#999;margin-top:16px;border-top:1px dashed #ccc;padding-top:8px}</style>
      </head><body>${printContent.innerHTML}</body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownloadReceipt = () => {
    const receipt = document.getElementById('e-receipt-print');
    if (!receipt) return;
    const blob = new Blob([receipt.innerText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `e-transaksi-${transactionResult?.invoiceNumber || 'receipt'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!pendingOrder && step !== 'success') {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && resetAndClose()}>
        <DialogContent className="max-w-md">
          <div className="p-6 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Tidak ada pesanan yang sedang diproses</p>
            <Button onClick={resetAndClose} className="bg-emerald-600 hover:bg-emerald-700">Kembali</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ====== SUCCESS STEP ======
  if (step === 'success' && transactionResult && pendingOrder) {
    const date = new Date(transactionResult.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = new Date(transactionResult.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const isPaid = transactionResult.transactionStatus === 'PAID';

    return (
      <Dialog open={open} onOpenChange={(v) => !v && resetAndClose()}>
        <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto p-0">
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-5 py-4 text-white flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-base">E-Transaksi Berhasil!</h2>
                <p className="text-emerald-200 text-xs">Transaksi digital telah dicatat</p>
              </div>
            </div>
            <button onClick={resetAndClose} className="text-white/70 hover:text-white"><X className="h-5 w-5" /></button>
          </div>

          <div id="e-receipt-print" className="p-5 space-y-4 font-mono">
            <div className="bg-emerald-50 rounded-lg p-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  {isPaid ? 'Pembayaran Dikonfirmasi' : 'E-Transaksi Terverifikasi'}
                </p>
                <p className="text-xs text-emerald-600">Transaksi digital aman & tercatat</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Detail Transaksi</p>
              <div className="flex justify-between text-sm"><span className="text-gray-500">No. Invoice</span><span className="font-bold text-gray-900">{transactionResult.invoiceNumber}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Tanggal</span><span className="text-gray-700">{date}, {time} WIB</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Pembeli</span><span className="text-gray-700">{buyerName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Telepon</span><span className="text-gray-700">{buyerPhone}</span></div>
            </div>

            <div className="border-t border-dashed border-gray-200" />

            <div className="space-y-2">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Item Pesanan</p>
              {transactionResult.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.name} x{item.quantity}</span>
                  <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-200" />

            <div className="flex justify-between items-center bg-emerald-50 rounded-lg p-3">
              <span className="font-bold text-emerald-800 text-sm">Total Pembayaran</span>
              <span className="font-bold text-emerald-800 text-lg">{formatPrice(transactionResult.totalAmount)}</span>
            </div>

            <div className="border-t border-dashed border-gray-200" />

            <div className="space-y-2">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Metode Pembayaran</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Metode</span>
                <span className="font-bold text-gray-900 flex items-center gap-1">{selectedPayment?.icon} {selectedPayment?.label}</span>
              </div>
              <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">{selectedPayment?.detail}</p>
            </div>

            {isQRIS && transactionResult.qrisContent && (
              <>
                <div className="border-t border-dashed border-gray-200" />
                <div className="bg-white border-2 border-emerald-200 rounded-xl p-4 text-center">
                  <p className="text-xs font-bold text-emerald-700 mb-3">SCAN QRIS UNTUK BAYAR</p>
                  <div className="w-44 h-44 mx-auto bg-white p-2 rounded-lg border border-gray-100 shadow-inner flex items-center justify-center">
                    <QRCodeSVG value={transactionResult.qrisContent} size={160} bgColor="#FFFFFF" fgColor="#065f46" level="M" />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">Scan dengan e-wallet atau mobile banking</p>
                  <p className="text-sm font-bold text-emerald-800 mt-1">{formatPrice(transactionResult.totalAmount)}</p>
                  <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                    {['GoPay', 'OVO', 'DANA', 'ShopeePay', 'm-Banking'].map(w => (
                      <span key={w} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{w}</span>
                    ))}
                  </div>
                  <button onClick={handleCopyQRIS} className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-emerald-700 bg-emerald-100 hover:bg-emerald-200 py-2 rounded-lg transition-colors">
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Tersalin!' : 'Salin Kode QRIS'}
                  </button>
                </div>
              </>
            )}

            <div className="border-t border-dashed border-gray-200" />

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Status</span>
              <Badge className={isPaid ? 'bg-green-100 text-green-800 font-bold' : 'bg-amber-100 text-amber-800 font-bold'}>
                {isPaid ? 'SUDAH DIBAYAR' : 'MENUNGGU PEMBAYARAN'}
              </Badge>
            </div>

            {!isPaid && (
              <div className={`rounded-lg p-3 ${isQRIS ? 'bg-blue-50 border border-blue-200' : 'bg-amber-50 border border-amber-200'}`}>
                <p className={`text-xs font-medium mb-1 flex items-center gap-1 ${isQRIS ? 'text-blue-800' : 'text-amber-800'}`}>
                  <AlertCircle className="h-3 w-3" /> Instruksi Pembayaran:
                </p>
                {isQRIS ? (
                  <div className="text-xs text-blue-700 space-y-1">
                    <p>1. Buka e-wallet atau mobile banking Anda</p>
                    <p>2. Pilih menu &quot;Scan QR&quot; / &quot;QRIS&quot;</p>
                    <p>3. Scan QR code di atas</p>
                    <p>4. Konfirmasi pembayaran sebesar <span className="font-bold">{formatPrice(transactionResult.totalAmount)}</span></p>
                    <p>5. Kirim bukti ke WhatsApp desa</p>
                  </div>
                ) : (
                  <p className="text-xs text-amber-700">Mohon lakukan pembayaran sesuai metode di atas, lalu kirim bukti pembayaran ke WhatsApp desa di nomor <span className="font-bold">085150859735</span>.</p>
                )}
              </div>
            )}

            <div className="border-t border-dashed border-gray-200" />
            <div className="text-center text-xs text-gray-400">
              <p className="flex items-center justify-center gap-1"><ShieldCheck className="h-3 w-3" /> E-Transaksi Aman & Terverifikasi</p>
              <p className="font-bold text-emerald-700 mt-1">Marketplace Desa Air Sempiang</p>
              <p>Kec. Kabawetan, Kab. Kepahiang, Bengkulu</p>
            </div>
          </div>

          <div className="px-5 pb-5 flex flex-col gap-3">
            {!isPaid && (
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 py-4" onClick={handleConfirmPayment}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Saya Sudah Bayar
              </Button>
            )}
            <Button className="w-full bg-green-600 hover:bg-green-500 py-4 text-base" onClick={handleSendWhatsApp}>
              <MessageCircle className="mr-2 h-5 w-5" /> Kirim E-Transaksi ke WhatsApp
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="py-3 border-emerald-200 text-emerald-700" onClick={handleDownloadReceipt}>
                <Download className="mr-2 h-4 w-4" /> Unduh
              </Button>
              <Button variant="outline" className="py-3 border-emerald-200 text-emerald-700" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Cetak
              </Button>
            </div>
            <Button variant="ghost" className="w-full py-3 text-gray-500" onClick={resetAndClose}>
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
        <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto p-0">
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-5 py-4 text-white flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button onClick={() => setStep('summary')} className="text-white/70 hover:text-white mr-1"><ArrowLeft className="h-5 w-5" /></button>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><CreditCard className="h-5 w-5" /></div>
              <div><h2 className="font-bold text-base">Pembayaran</h2><p className="text-emerald-200 text-xs">{formatPrice(pendingOrder!.total)}</p></div>
            </div>
            <button onClick={resetAndClose} className="text-white/70 hover:text-white"><X className="h-5 w-5" /></button>
          </div>

          <div className="p-5 space-y-5">
            <div>
              <p className="text-sm font-bold text-emerald-800 mb-3">Pilih Metode Pembayaran</p>
              <div className="grid grid-cols-2 gap-2">
                {paymentOptions.map((opt) => (
                  <button key={opt.value} onClick={() => setPaymentMethod(opt.value)}
                    className={`relative p-3 rounded-xl border-2 text-center transition-all ${paymentMethod === opt.value ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-gray-200 hover:border-emerald-300'}`}>
                    {opt.badge && <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] px-2 py-0.5 rounded-full font-bold ${opt.badgeColor}`}>{opt.badge}</span>}
                    <div className={`mx-auto mb-1 ${paymentMethod === opt.value ? 'text-emerald-600' : 'text-gray-400'}`}>{opt.icon}</div>
                    <p className={`text-xs font-medium ${paymentMethod === opt.value ? 'text-emerald-800' : 'text-gray-600'}`}>{opt.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {isQRIS && (
              <div className="border-2 border-emerald-200 rounded-xl p-4 bg-gradient-to-b from-emerald-50 to-white">
                <div className="flex items-center gap-2 mb-3">
                  <QrCode className="h-5 w-5 text-emerald-600" />
                  <p className="font-bold text-emerald-800 text-sm">Pembayaran QRIS</p>
                  <Badge className="bg-emerald-100 text-emerald-700 text-[9px] ml-auto">Scan & Bayar</Badge>
                </div>
                <div className="w-40 h-40 mx-auto bg-white p-2 rounded-lg border border-gray-100 shadow-inner flex items-center justify-center mb-3">
                  <QRCodeSVG value={`00020101021226580014COM.GO-JEK.WWW0118936009140336118750215ID10200032110303UME51440014ID.CO.QRIS.WWW0215ID20200032110303UME5204581253033605802ID5915DESA AIR SEMPIANG6007JAKARTA61051234062240520${Date.now().toString().slice(-10)}0703UME6304`} size={140} bgColor="#FFFFFF" fgColor="#065f46" level="M" />
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">QR code final akan muncul setelah checkout</p>
                  <p className="text-lg font-bold text-emerald-800">{formatPrice(pendingOrder!.total)}</p>
                  <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                    {['GoPay', 'OVO', 'DANA', 'ShopeePay', 'm-Banking'].map(w => (
                      <span key={w} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{w}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedPayment && !isQRIS && (
              <div className="p-3 bg-emerald-50 rounded-lg text-sm text-emerald-700">{selectedPayment.detail}</div>
            )}

            <Separator />

            <div className="space-y-4">
              <p className="text-sm font-bold text-emerald-800">Informasi Pembeli</p>
              <div className="space-y-2">
                <Label htmlFor="modal-buyerName" className="text-xs">Nama Pembeli *</Label>
                <Input id="modal-buyerName" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="Nama lengkap" className="h-9" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-buyerPhone" className="text-xs">Nomor WhatsApp *</Label>
                <Input id="modal-buyerPhone" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} placeholder="08xxxxxxxxxx" className="h-9" />
                <p className="text-[10px] text-gray-400 flex items-center gap-1"><MessageCircle className="h-3 w-3" /> E-transaksi akan dikirim ke WhatsApp ini</p>
              </div>
              {isBank && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="modal-bankAccount" className="text-xs">Nomor Rekening Pengirim</Label>
                    <Input id="modal-bankAccount" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} placeholder="Nomor rekening" className="h-9" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modal-bankName" className="text-xs">Nama Rekening Pengirim</Label>
                    <Input id="modal-bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Nama sesuai rekening" className="h-9" />
                  </div>
                </>
              )}
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">{error}</div>}

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400"><ShieldCheck className="h-4 w-4" /><span>Transaksi aman & terenkripsi</span></div>

            <Button onClick={handleCreateTransaction} className="w-full bg-emerald-600 hover:bg-emerald-700 py-5 text-base" disabled={loading}>
              <CreditCard className="mr-2 h-5 w-5" />
              {loading ? 'Memproses E-Transaksi...' : `Bayar ${formatPrice(pendingOrder!.total)}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ====== SUMMARY STEP (default) ======
  return (
    <Dialog open={open} onOpenChange={(v) => !v && resetAndClose()}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto p-0">
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-5 py-4 text-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><ShoppingCart className="h-5 w-5" /></div>
            <div><h2 className="font-bold text-base">Checkout E-Transaksi</h2><p className="text-emerald-200 text-xs">Ringkasan pesanan Anda</p></div>
          </div>
          <button onClick={resetAndClose} className="text-white/70 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-3">
            {pendingOrder!.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"><Package className="h-5 w-5 text-emerald-600" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.quantity} x {formatPrice(item.price)}</p>
                </div>
                <p className="font-medium text-sm text-emerald-800">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex justify-between items-center bg-emerald-50 rounded-lg p-4">
            <div><p className="text-sm text-gray-500">Total Pembayaran</p><p className="text-2xl font-bold text-emerald-800">{formatPrice(pendingOrder!.total)}</p></div>
            <Badge className="bg-emerald-100 text-emerald-700">{pendingOrder!.items.reduce((s, i) => s + i.quantity, 0)} item</Badge>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="summary-buyerName" className="text-xs font-medium">Nama Pembeli *</Label>
              <Input id="summary-buyerName" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="Nama lengkap" className="h-9" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary-buyerPhone" className="text-xs font-medium">Nomor WhatsApp *</Label>
              <Input id="summary-buyerPhone" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} placeholder="08xxxxxxxxxx" className="h-9" />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs font-medium text-amber-800 mb-1 flex items-center gap-1"><Zap className="h-3 w-3" /> E-Transaksi Digital</p>
            <p className="text-[11px] text-amber-700">Setelah checkout, e-transaksi akan otomatis dicatat di database dan dapat dikirim ke WhatsApp sebagai bukti transaksi resmi.</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400"><ShieldCheck className="h-4 w-4" /><span>Transaksi aman & terenkripsi</span></div>

          <Button onClick={() => { if (!buyerName || !buyerPhone) { setError('Nama dan nomor telepon wajib diisi'); return; } setError(''); setStep('payment'); }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 py-5 text-base">
            <CreditCard className="mr-2 h-5 w-5" /> Lanjut ke Pembayaran
          </Button>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
