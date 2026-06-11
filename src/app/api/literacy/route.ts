import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const materials = await db.literacyMaterial.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(materials);
  } catch (error) {
    console.error('Literacy GET error:', error);
    return NextResponse.json({ error: 'Gagal memuat materi literasi' }, { status: 500 });
  }
}
