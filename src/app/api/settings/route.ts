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
    const rows = await db.setting.findMany();
    const settings: Record<string, string> = {};
    rows.forEach((row) => {
      settings[row.key] = row.value;
    });

    // Return default settings if empty
    if (Object.keys(settings).length === 0) {
      const defaults: Record<string, string> = {
        village_name: 'Desa Air Sempiang',
        village_description: 'Kecamatan Kabawetan, Kabupaten Kepahiang, Provinsi Bengkulu',
        village_address: 'Kec. Kabawetan, Kab. Kepahiang, Prov. Bengkulu',
        village_phone: '085150859735',
        village_email: 'info@desaairsempiang.id',
        village_whatsapp: '085150859735',
        village_coordinates: '-3.558,102.602',
        primary_color: '#059669',
        accent_color: '#d97706',
        bank_bri: '0012-01-000456-789',
        bank_mandiri: '123-000-456-7890',
        bank_bni: '0098-765-4321',
        gopay_number: '085150859735',
        ovo_number: '085150859735',
        dana_number: '085150859735',
      };
      // Seed defaults into database
      for (const [key, value] of Object.entries(defaults)) {
        try {
          await db.setting.create({ data: { key, value } });
        } catch {}
      }
      return NextResponse.json(defaults);
    }

    return NextResponse.json(settings);
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
    for (const [key, value] of Object.entries(body)) {
      await db.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    // Fetch updated
    const rows = await db.setting.findMany();
    const settings: Record<string, string> = {};
    rows.forEach((row) => {
      settings[row.key] = row.value;
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan pengaturan' }, { status: 500 });
  }
}
