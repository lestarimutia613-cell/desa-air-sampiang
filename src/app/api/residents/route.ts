import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('resident_data')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return NextResponse.json({ error: 'Gagal memuat data kependudukan' }, { status: 500 });
      return NextResponse.json(data);
    }

    const residents = await db.residentData.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(residents);
  } catch (error) {
    console.error('Residents GET error:', error);
    return NextResponse.json({ error: 'Gagal memuat data kependudukan' }, { status: 500 });
  }
}
