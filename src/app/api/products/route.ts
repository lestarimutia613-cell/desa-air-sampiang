import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const id = searchParams.get('id');

    if (id) {
      const product = await db.product.findUnique({ where: { id } });
      if (!product) return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
      return NextResponse.json(product);
    }

    const where = category ? { category } : {};
    const products = await db.product.findMany({ where, orderBy: { createdAt: 'desc' } });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Gagal memuat produk' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = await db.product.create({ data: body });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Products POST error:', error);
    return NextResponse.json({ error: 'Gagal membuat produk' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const product = await db.product.update({ where: { id }, data });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Products PUT error:', error);
    return NextResponse.json({ error: 'Gagal mengupdate produk' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Products DELETE error:', error);
    return NextResponse.json({ error: 'Gagal menghapus produk' }, { status: 500 });
  }
}
