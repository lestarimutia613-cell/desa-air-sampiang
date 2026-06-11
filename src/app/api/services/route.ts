import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const services = await db.villageService.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(services);
  } catch (error) {
    console.error('Services GET error:', error);
    return NextResponse.json({ error: 'Gagal memuat layanan' }, { status: 500 });
  }
}
