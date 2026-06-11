import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const residents = await db.residentData.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(residents);
  } catch (error) {
    console.error('Residents GET error:', error);
    return NextResponse.json({ error: 'Gagal memuat data kependudukan' }, { status: 500 });
  }
}
