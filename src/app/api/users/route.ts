import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id, email, name, role, phone, address, created_at')
        .order('created_at', { ascending: false });
      if (error) return NextResponse.json({ error: 'Gagal memuat pengguna' }, { status: 500 });
      return NextResponse.json(data);
    }

    const users = await db.user.findMany({
      select: { id: true, email: true, name: true, role: true, phone: true, address: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Users GET error:', error);
    return NextResponse.json({ error: 'Gagal memuat pengguna' }, { status: 500 });
  }
}
