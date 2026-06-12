import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { table, items } = body;

    if (!table || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Parameter tidak valid' }, { status: 400 });
    }

    if (isSupabaseConfigured) {
      for (const item of items) {
        await supabaseAdmin
          .from(table)
          .update({ sort_order: item.sort_order })
          .eq('id', item.id);
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reorder error:', error);
    return NextResponse.json({ error: 'Gagal mengupdate urutan' }, { status: 500 });
  }
}
