import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function generateInvoiceNumber(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ETX-${y}${m}${d}-${rand}`;
}

function generateQRISContent(invoiceNumber: string, amount: number): string {
  const timestamp = Date.now().toString().slice(-10);
  return `00020101021226580014COM.GO-JEK.WWW0118936009140336118750215ID10200032110303UME51440014ID.CO.QRIS.WWW0215ID20200032110303UME5204581253033605802ID5915DESA AIR SEMPIANG6007JAKARTA61051234062240520${timestamp}0703UME6304AMT${amount}INV${invoiceNumber}`;
}

// GET /api/e-transaksi
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const id = searchParams.get('id');
    const status = searchParams.get('status');

    if (id) {
      const transaction = await db.eTransaction.findUnique({ where: { id } });
      if (!transaction) return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
      return NextResponse.json({ ...transaction, items: JSON.parse(transaction.items) });
    }

    const where: Record<string, string> = {};
    if (userId) where.userId = userId;
    if (status) where.transactionStatus = status;

    const transactions = await db.eTransaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const stats = {
      total: transactions.length,
      pending: transactions.filter(t => t.transactionStatus === 'PENDING').length,
      paid: transactions.filter(t => t.transactionStatus === 'PAID').length,
      completed: transactions.filter(t => t.transactionStatus === 'COMPLETED').length,
      cancelled: transactions.filter(t => t.transactionStatus === 'CANCELLED').length,
      totalRevenue: transactions.filter(t => t.transactionStatus === 'COMPLETED').reduce((s, t) => s + t.totalAmount, 0),
    };

    return NextResponse.json({
      transactions: transactions.map(t => ({ ...t, items: JSON.parse(t.items) })),
      stats,
    });
  } catch (error) {
    console.error('E-Transaction GET error:', error);
    return NextResponse.json({ error: 'Gagal memuat e-transaksi' }, { status: 500 });
  }
}

// POST /api/e-transaksi
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, buyerName, buyerPhone, buyerEmail, items, paymentMethod } = body;

    if (!buyerName || !buyerPhone) {
      return NextResponse.json({ error: 'Nama dan nomor telepon wajib diisi' }, { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Item pesanan tidak boleh kosong' }, { status: 400 });
    }

    const totalAmount = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
    const invoiceNumber = generateInvoiceNumber();
    const qrisContent = generateQRISContent(invoiceNumber, totalAmount);
    const itemsJson = JSON.stringify(items.map((item: { productId?: string; name: string; quantity: number; price: number }) => ({
      productId: item.productId || '',
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    })));

    // Create order first if userId exists
    let orderId: string | null = null;
    if (userId) {
      const order = await db.order.create({
        data: {
          invoiceNumber: `INV-${invoiceNumber.split('-').slice(1).join('-')}`,
          userId,
          totalAmount,
          status: 'PENDING',
          paymentMethod: paymentMethod || 'QRIS',
          buyerPhone,
          buyerName,
          items: {
            create: items.filter((item: { productId: string }) => item.productId).map((item: { productId: string; quantity: number; price: number }) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
          paymentProofs: {
            create: {
              invoiceNumber: `INV-${invoiceNumber.split('-').slice(1).join('-')}`,
              buyerName,
              buyerPhone,
              totalAmount,
              paymentMethod: paymentMethod || 'QRIS',
              items: itemsJson,
              status: 'PENDING',
            },
          },
        },
        include: { items: { include: { product: true } }, paymentProofs: true },
      });
      orderId = order.id;

      // Update stock
      for (const item of items.filter((i: { productId: string }) => i.productId)) {
        try {
          await db.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        } catch {}
      }
    }

    const transaction = await db.eTransaction.create({
      data: {
        invoiceNumber,
        orderId,
        userId: userId || null,
        buyerName,
        buyerPhone,
        buyerEmail: buyerEmail || null,
        items: itemsJson,
        totalAmount,
        paymentMethod: paymentMethod || 'QRIS',
        paymentStatus: 'PENDING',
        transactionStatus: 'PENDING',
        qrisContent,
      },
    });

    return NextResponse.json({
      ...transaction,
      items: JSON.parse(transaction.items),
    });
  } catch (error) {
    console.error('E-Transaction POST error:', error);
    return NextResponse.json({ error: 'Gagal membuat e-transaksi' }, { status: 500 });
  }
}

// PUT /api/e-transaksi
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, transactionStatus, paymentStatus, notes, whSent } = body;

    if (!id) return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });

    const updateData: Record<string, unknown> = {};
    if (transactionStatus) {
      updateData.transactionStatus = transactionStatus;
      if (transactionStatus === 'PAID') updateData.paidAt = new Date();
      if (transactionStatus === 'COMPLETED') updateData.completedAt = new Date();
      if (transactionStatus === 'CANCELLED') updateData.cancelledAt = new Date();
    }
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (notes !== undefined) updateData.notes = notes;
    if (whSent) {
      updateData.whSentCount = { increment: 1 };
      updateData.whLastSentAt = new Date();
    }

    const transaction = await db.eTransaction.update({
      where: { id },
      data: updateData,
    });

    // Also update linked order
    if (transactionStatus && transaction.orderId) {
      try {
        await db.order.update({
          where: { id: transaction.orderId },
          data: { status: transactionStatus },
        });
      } catch {}
    }

    return NextResponse.json({
      ...transaction,
      items: JSON.parse(transaction.items),
    });
  } catch (error) {
    console.error('E-Transaction PUT error:', error);
    return NextResponse.json({ error: 'Gagal mengupdate e-transaksi' }, { status: 500 });
  }
}
