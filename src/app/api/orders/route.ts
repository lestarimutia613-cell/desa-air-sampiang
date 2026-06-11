import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase';

function generateInvoiceNumber(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `INV-${y}${m}${d}-${rand}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const admin = searchParams.get('admin');

    if (isSupabaseConfigured) {
      if (userId) {
        const { data, error } = await supabaseAdmin
          .from('orders')
          .select('*, items:order_items(*, product:products(name))')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (error) return NextResponse.json({ error: 'Gagal memuat pesanan' }, { status: 500 });
        return NextResponse.json(data);
      }

      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*, items:order_items(*, product:products(name)), user:users(name, email), payment_proofs(*)')
        .order('created_at', { ascending: false });
      if (error) return NextResponse.json({ error: 'Gagal memuat pesanan' }, { status: 500 });
      return NextResponse.json(data);
    }

    // Prisma fallback
    if (userId) {
      const orders = await db.order.findMany({
        where: { userId },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(orders);
    }

    const orders = await db.order.findMany({
      include: { items: { include: { product: true } }, user: true, paymentProofs: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Gagal memuat pesanan' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, items, paymentMethod, buyerPhone, buyerName, bankAccount, bankName } = body;

    const totalAmount = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
    const invoiceNumber = generateInvoiceNumber();
    const itemsJson = JSON.stringify(items.map((item: { name: string; quantity: number; price: number }) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })));

    if (isSupabaseConfigured) {
      // Create order
      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          invoice_number: invoiceNumber,
          user_id: userId,
          total_amount: totalAmount,
          status: 'PENDING',
          payment_method: paymentMethod,
          buyer_phone: buyerPhone,
          buyer_name: buyerName,
          bank_account: bankAccount || null,
          bank_name: bankName || null,
        })
        .select()
        .single();

      if (orderError || !order) {
        return NextResponse.json({ error: 'Gagal membuat pesanan' }, { status: 500 });
      }

      // Create order items
      const orderItems = items.map((item: { productId: string; quantity: number; price: number }) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabaseAdmin
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items error:', itemsError);
      }

      // Create payment proof
      await supabaseAdmin
        .from('payment_proofs')
        .insert({
          order_id: order.id,
          invoice_number: invoiceNumber,
          buyer_name: buyerName,
          buyer_phone: buyerPhone,
          total_amount: totalAmount,
          payment_method: paymentMethod,
          items: itemsJson,
          status: 'PENDING',
        });

      // Update stock
      for (const item of items) {
        if (isSupabaseConfigured) {
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

      // Fetch the complete order with items
      const { data: fullOrder } = await supabaseAdmin
        .from('orders')
        .select('*, items:order_items(*, product:products(name)), payment_proofs(*)')
        .eq('id', order.id)
        .single();

      return NextResponse.json(fullOrder || order);
    }

    // Prisma fallback
    const order = await db.order.create({
      data: {
        invoiceNumber,
        userId,
        totalAmount,
        status: 'PENDING',
        paymentMethod,
        buyerPhone,
        buyerName,
        bankAccount: bankAccount || null,
        bankName: bankName || null,
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        paymentProofs: {
          create: {
            invoiceNumber,
            buyerName,
            buyerPhone,
            totalAmount,
            paymentMethod,
            items: itemsJson,
            status: 'PENDING',
          },
        },
      },
      include: { items: { include: { product: true } }, paymentProofs: true },
    });

    for (const item of items) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Orders POST error:', error);
    return NextResponse.json({ error: 'Gagal membuat pesanan' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (isSupabaseConfigured) {
      const { data: order, error } = await supabaseAdmin
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select('*, payment_proofs(*)')
        .single();

      if (error) {
        return NextResponse.json({ error: 'Gagal mengupdate pesanan' }, { status: 500 });
      }

      // Also update payment proof status
      if (status && order?.payment_proofs?.length > 0) {
        await supabaseAdmin
          .from('payment_proofs')
          .update({ status })
          .eq('order_id', id);
      }

      return NextResponse.json(order);
    }

    // Prisma fallback
    const order = await db.order.update({
      where: { id },
      data: { 
        ...(status && { status }),
      },
      include: { paymentProofs: true },
    });

    if (status && order.paymentProofs.length > 0) {
      await db.paymentProof.update({
        where: { id: order.paymentProofs[0].id },
        data: { status },
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Orders PUT error:', error);
    return NextResponse.json({ error: 'Gagal mengupdate pesanan' }, { status: 500 });
  }
}
