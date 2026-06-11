import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase';
import { db } from '@/lib/db';

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('settings')
        .select('*');
      if (error) return NextResponse.json({ error: 'Gagal memuat pengaturan' }, { status: 500 });

      // Convert array of key-value pairs to object
      const settings: Record<string, string> = {};
      (data || []).forEach((item: { key: string; value: string | null }) => {
        settings[item.key] = item.value || '';
      });
      return NextResponse.json(settings);
    }

    // Prisma fallback
    return NextResponse.json({});
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Gagal memuat pengaturan' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (isSupabaseConfigured) {
      // Upsert each setting
      const upserts = Object.entries(body).map(([key, value]) => ({
        key,
        value: String(value),
      }));

      for (const setting of upserts) {
        const { error } = await supabaseAdmin
          .from('settings')
          .upsert(setting, { onConflict: 'key' });
        if (error) {
          console.error('Settings upsert error for key:', setting.key, error);
        }
      }

      // Fetch updated settings
      const { data } = await supabaseAdmin.from('settings').select('*');
      const settings: Record<string, string> = {};
      (data || []).forEach((item: { key: string; value: string | null }) => {
        settings[item.key] = item.value || '';
      });
      return NextResponse.json(settings);
    }

    // Prisma fallback
    return NextResponse.json(body);
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan pengaturan' }, { status: 500 });
  }
}
