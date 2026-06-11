import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

    // Update stock
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
    const order = await db.order.update({
      where: { id },
      data: { 
        ...(status && { status }),
      },
      include: { paymentProofs: true },
    });

    // Also update payment proof status
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
