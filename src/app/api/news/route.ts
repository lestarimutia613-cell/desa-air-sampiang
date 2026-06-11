import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
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
    const news = await db.news.create({ data: body });
    return NextResponse.json(news);
  } catch (error) {
    console.error('News POST error:', error);
    return NextResponse.json({ error: 'Gagal membuat berita' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    await db.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('News DELETE error:', error);
    return NextResponse.json({ error: 'Gagal menghapus berita' }, { status: 500 });
  }
}
