import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      const orders = await db.order.findMany({
        where: { userId },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(orders);
    }

    const orders = await db.order.findMany({
      include: { items: { include: { product: true } }, user: true },
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

    const order = await db.order.create({
      data: {
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
      },
      include: { items: { include: { product: true } } },
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
    const { id, status, paymentProof } = body;
    const order = await db.order.update({
      where: { id },
      data: { 
        ...(status && { status }),
        ...(paymentProof && { paymentProof }),
      },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error('Orders PUT error:', error);
    return NextResponse.json({ error: 'Gagal mengupdate pesanan' }, { status: 500 });
  }
}
