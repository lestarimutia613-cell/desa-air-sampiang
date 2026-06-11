import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('courses')
        .select('*')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });
      if (error) return NextResponse.json({ error: 'Gagal memuat kursus' }, { status: 500 });
      return NextResponse.json(data);
    }

    const courses = await db.course.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Courses GET error:', error);
    return NextResponse.json({ error: 'Gagal memuat kursus' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('courses')
        .insert(body)
        .select()
        .single();
      if (error) return NextResponse.json({ error: 'Gagal membuat kursus' }, { status: 500 });
      return NextResponse.json(data);
    }

    const course = await db.course.create({ data: body });
    return NextResponse.json(course);
  } catch (error) {
    console.error('Courses POST error:', error);
    return NextResponse.json({ error: 'Gagal membuat kursus' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (isSupabaseConfigured) {
      const { data: course, error } = await supabaseAdmin
        .from('courses')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) return NextResponse.json({ error: 'Gagal mengupdate kursus' }, { status: 500 });
      return NextResponse.json(course);
    }

    const course = await db.course.update({ where: { id }, data });
    return NextResponse.json(course);
  } catch (error) {
    console.error('Courses PUT error:', error);
    return NextResponse.json({ error: 'Gagal mengupdate kursus' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });

    if (isSupabaseConfigured) {
      const { error } = await supabaseAdmin.from('courses').delete().eq('id', id);
      if (error) return NextResponse.json({ error: 'Gagal menghapus kursus' }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    await db.course.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Courses DELETE error:', error);
    return NextResponse.json({ error: 'Gagal menghapus kursus' }, { status: 500 });
  }
}
