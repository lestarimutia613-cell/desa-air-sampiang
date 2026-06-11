import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const id = searchParams.get('id');

    if (id) {
      if (isSupabaseConfigured) {
        const { data, error } = await supabaseAdmin
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        if (error || !data) return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
        return NextResponse.json(data);
      }
      const product = await db.product.findUnique({ where: { id } });
      if (!product) return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
      return NextResponse.json(product);
    }

    if (isSupabaseConfigured) {
      let query = supabaseAdmin
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) return NextResponse.json({ error: 'Gagal memuat produk' }, { status: 500 });
      return NextResponse.json(data);
    }

    // Prisma fallback
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

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('products')
        .insert(body)
        .select()
        .single();
      if (error) return NextResponse.json({ error: 'Gagal membuat produk' }, { status: 500 });
      return NextResponse.json(data);
    }

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

    if (isSupabaseConfigured) {
      const { data: product, error } = await supabaseAdmin
        .from('products')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) return NextResponse.json({ error: 'Gagal mengupdate produk' }, { status: 500 });
      return NextResponse.json(product);
    }

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

    if (isSupabaseConfigured) {
      const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
      if (error) return NextResponse.json({ error: 'Gagal menghapus produk' }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Products DELETE error:', error);
    return NextResponse.json({ error: 'Gagal menghapus produk' }, { status: 500 });
  }
}
