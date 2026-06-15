import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase';

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

// Normalize Supabase snake_case to camelCase
function normalizeTx(t: Record<string, unknown>) {
  return {
    id: t.id,
    invoiceNumber: t.invoice_number ?? t.invoiceNumber,
    orderId: t.order_id ?? t.orderId ?? null,
    userId: t.user_id ?? t.userId ?? null,
    buyerName: t.buyer_name ?? t.buyerName,
    buyerPhone: t.buyer_phone ?? t.buyerPhone,
    buyerEmail: t.buyer_email ?? t.buyerEmail ?? null,
    items: typeof t.items === 'string' ? JSON.parse(t.items) : (t.items || []),
    totalAmount: Number(t.total_amount ?? t.totalAmount ?? 0),
    paymentMethod: t.payment_method ?? t.paymentMethod ?? 'QRIS',
    paymentStatus: t.payment_status ?? t.paymentStatus ?? 'PENDING',
    transactionStatus: t.transaction_status ?? t.transactionStatus ?? 'PENDING',
    qrisContent: t.qris_content ?? t.qrisContent ?? null,
    whSentCount: t.wh_sent_count ?? t.whSentCount ?? 0,
    whLastSentAt: t.wh_last_sent_at ?? t.whLastSentAt ?? null,
    notes: t.notes ?? null,
    paidAt: t.paid_at ?? t.paidAt ?? null,
    completedAt: t.completed_at ?? t.completedAt ?? null,
    cancelledAt: t.cancelled_at ?? t.cancelledAt ?? null,
    createdAt: t.created_at ?? t.createdAt,
    updatedAt: t.updated_at ?? t.updatedAt,
  };
}

// GET /api/e-transaksi
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const id = searchParams.get('id');
    const status = searchParams.get('status');

    if (isSupabaseConfigured) {
      if (id) {
        const { data, error } = await supabaseAdmin
          .from('e_transactions')
          .select('*')
          .eq('id', id)
          .single();
        if (error || !data) return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
        return NextResponse.json(normalizeTx(data));
      }

      let query = supabaseAdmin
        .from('e_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) query = query.eq('user_id', userId);
      if (status) query = query.eq('transaction_status', status);

      const { data: transactions, error } = await query;
      if (error) return NextResponse.json({ error: 'Gagal memuat e-transaksi' }, { status: 500 });

      const parsed = (transactions || []).map(normalizeTx);

      const stats = {
        total: parsed.length,
        pending: parsed.filter((t) => t.transactionStatus === 'PENDING').length,
        paid: parsed.filter((t) => t.transactionStatus === 'PAID').length,
        completed: parsed.filter((t) => t.transactionStatus === 'COMPLETED').length,
        cancelled: parsed.filter((t) => t.transactionStatus === 'CANCELLED').length,
        totalRevenue: parsed.filter((t) => t.transactionStatus === 'COMPLETED').reduce((s, t) => s + t.totalAmount, 0),
      };

      return NextResponse.json({ transactions: parsed, stats });
    }

    // Prisma fallback
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

    if (isSupabaseConfigured) {
      // Create order first if userId exists
      let orderId: string | null = null;
      if (userId) {
        const { data: order, error: orderError } = await supabaseAdmin
          .from('orders')
          .insert({
            invoice_number: `INV-${invoiceNumber.split('-').slice(1).join('-')}`,
            user_id: userId,
            total_amount: totalAmount,
            status: 'PENDING',
            payment_method: paymentMethod || 'QRIS',
            buyer_phone: buyerPhone,
            buyer_name: buyerName,
          })
          .select()
          .single();

        if (!orderError && order) {
          orderId = order.id;

          const orderItems = items
            .filter((item: { productId: string }) => item.productId)
            .map((item: { productId: string; quantity: number; price: number }) => ({
              order_id: order.id,
              product_id: item.productId,
              quantity: item.quantity,
              price: item.price,
            }));

          if (orderItems.length > 0) {
            await supabaseAdmin.from('order_items').insert(orderItems);
          }

          await supabaseAdmin.from('payment_proofs').insert({
            order_id: order.id,
            invoice_number: `INV-${invoiceNumber.split('-').slice(1).join('-')}`,
            buyer_name: buyerName,
            buyer_phone: buyerPhone,
            total_amount: totalAmount,
            payment_method: paymentMethod || 'QRIS',
            items: itemsJson,
            status: 'PENDING',
          });

          for (const item of items.filter((i: { productId: string }) => i.productId)) {
            const { data: product } = await supabaseAdmin
              .from('products')
              .select('stock')
              .eq('id', item.productId)
              .single();
            if (product) {
              await supabaseAdmin
                .from('products')
                .update({ stock: Math.max(0, product.stock - item.quantity) })
                .eq('id', item.productId);
            }
          }
        }
      }

      const { data: transaction, error: txError } = await supabaseAdmin
        .from('e_transactions')
        .insert({
          invoice_number: invoiceNumber,
          order_id: orderId,
          user_id: userId || null,
          buyer_name: buyerName,
          buyer_phone: buyerPhone,
          buyer_email: buyerEmail || null,
          items: itemsJson,
          total_amount: totalAmount,
          payment_method: paymentMethod || 'QRIS',
          payment_status: 'PENDING',
          transaction_status: 'PENDING',
          qris_content: qrisContent,
        })
        .select()
        .single();

      if (txError) {
        console.error('Supabase e-transaction create error:', txError);
        return NextResponse.json({ error: 'Gagal membuat e-transaksi' }, { status: 500 });
      }

      return NextResponse.json(normalizeTx(transaction));
    }

    // Prisma fallback
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

    if (isSupabaseConfigured) {
      const updateData: Record<string, unknown> = {};
      if (transactionStatus) {
        updateData.transaction_status = transactionStatus;
        if (transactionStatus === 'PAID') updateData.paid_at = new Date().toISOString();
        if (transactionStatus === 'COMPLETED') updateData.completed_at = new Date().toISOString();
        if (transactionStatus === 'CANCELLED') updateData.cancelled_at = new Date().toISOString();
      }
      if (paymentStatus) updateData.payment_status = paymentStatus;
      if (notes !== undefined) updateData.notes = notes;
      if (whSent) {
        const { data: current } = await supabaseAdmin
          .from('e_transactions')
          .select('wh_sent_count')
          .eq('id', id)
          .single();
        updateData.wh_sent_count = (current?.wh_sent_count || 0) + 1;
        updateData.wh_last_sent_at = new Date().toISOString();
      }

      const { data: transaction, error } = await supabaseAdmin
        .from('e_transactions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase e-transaction update error:', error);
        return NextResponse.json({ error: 'Gagal mengupdate e-transaksi' }, { status: 500 });
      }

      // Also update linked order
      if (transactionStatus && transaction?.order_id) {
        await supabaseAdmin
          .from('orders')
          .update({ status: transactionStatus })
          .eq('id', transaction.order_id);
      }

      return NextResponse.json(normalizeTx(transaction));
    }

    // Prisma fallback
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
