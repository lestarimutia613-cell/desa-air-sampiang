import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('literacy_materials')
        .select('*')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });
      if (error) return NextResponse.json({ error: 'Gagal memuat materi literasi' }, { status: 500 });
      return NextResponse.json(data);
    }

    const materials = await db.literacyMaterial.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(materials);
  } catch (error) {
    console.error('Literacy GET error:', error);
    return NextResponse.json({ error: 'Gagal memuat materi literasi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('literacy_materials')
        .insert(body)
        .select()
        .single();
      if (error) return NextResponse.json({ error: 'Gagal membuat materi' }, { status: 500 });
      return NextResponse.json(data);
    }

    const material = await db.literacyMaterial.create({ data: body });
    return NextResponse.json(material);
  } catch (error) {
    console.error('Literacy POST error:', error);
    return NextResponse.json({ error: 'Gagal membuat materi' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (isSupabaseConfigured) {
      const { data: material, error } = await supabaseAdmin
        .from('literacy_materials')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) return NextResponse.json({ error: 'Gagal mengupdate materi' }, { status: 500 });
      return NextResponse.json(material);
    }

    const material = await db.literacyMaterial.update({ where: { id }, data });
    return NextResponse.json(material);
  } catch (error) {
    console.error('Literacy PUT error:', error);
    return NextResponse.json({ error: 'Gagal mengupdate materi' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });

    if (isSupabaseConfigured) {
      const { error } = await supabaseAdmin.from('literacy_materials').delete().eq('id', id);
      if (error) return NextResponse.json({ error: 'Gagal menghapus materi' }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    await db.literacyMaterial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Literacy DELETE error:', error);
    return NextResponse.json({ error: 'Gagal menghapus materi' }, { status: 500 });
  }
}
