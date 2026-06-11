import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('village_services')
        .select('*')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });
      if (error) return NextResponse.json({ error: 'Gagal memuat layanan' }, { status: 500 });
      return NextResponse.json(data);
    }

    const services = await db.villageService.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(services);
  } catch (error) {
    console.error('Services GET error:', error);
    return NextResponse.json({ error: 'Gagal memuat layanan' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('village_services')
        .insert(body)
        .select()
        .single();
      if (error) return NextResponse.json({ error: 'Gagal membuat layanan' }, { status: 500 });
      return NextResponse.json(data);
    }

    const service = await db.villageService.create({ data: body });
    return NextResponse.json(service);
  } catch (error) {
    console.error('Services POST error:', error);
    return NextResponse.json({ error: 'Gagal membuat layanan' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (isSupabaseConfigured) {
      const { data: service, error } = await supabaseAdmin
        .from('village_services')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) return NextResponse.json({ error: 'Gagal mengupdate layanan' }, { status: 500 });
      return NextResponse.json(service);
    }

    const service = await db.villageService.update({ where: { id }, data });
    return NextResponse.json(service);
  } catch (error) {
    console.error('Services PUT error:', error);
    return NextResponse.json({ error: 'Gagal mengupdate layanan' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });

    if (isSupabaseConfigured) {
      const { error } = await supabaseAdmin.from('village_services').delete().eq('id', id);
      if (error) return NextResponse.json({ error: 'Gagal menghapus layanan' }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    await db.villageService.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Services DELETE error:', error);
    return NextResponse.json({ error: 'Gagal menghapus layanan' }, { status: 500 });
  }
}
