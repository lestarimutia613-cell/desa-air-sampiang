import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('news')
        .select('*')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });
      if (error) return NextResponse.json({ error: 'Gagal memuat berita' }, { status: 500 });
      return NextResponse.json(data);
    }

    const news = await db.news.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(news);
  } catch (error) {
    console.error('News GET error:', error);
    return NextResponse.json({ error: 'Gagal memuat berita' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('news')
        .insert(body)
        .select()
        .single();
      if (error) return NextResponse.json({ error: 'Gagal membuat berita' }, { status: 500 });
      return NextResponse.json(data);
    }

    const news = await db.news.create({ data: body });
    return NextResponse.json(news);
  } catch (error) {
    console.error('News POST error:', error);
    return NextResponse.json({ error: 'Gagal membuat berita' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (isSupabaseConfigured) {
      const { data: news, error } = await supabaseAdmin
        .from('news')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) return NextResponse.json({ error: 'Gagal mengupdate berita' }, { status: 500 });
      return NextResponse.json(news);
    }

    const news = await db.news.update({ where: { id }, data });
    return NextResponse.json(news);
  } catch (error) {
    console.error('News PUT error:', error);
    return NextResponse.json({ error: 'Gagal mengupdate berita' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });

    if (isSupabaseConfigured) {
      const { error } = await supabaseAdmin.from('news').delete().eq('id', id);
      if (error) return NextResponse.json({ error: 'Gagal menghapus berita' }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    await db.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('News DELETE error:', error);
    return NextResponse.json({ error: 'Gagal menghapus berita' }, { status: 500 });
  }
}
