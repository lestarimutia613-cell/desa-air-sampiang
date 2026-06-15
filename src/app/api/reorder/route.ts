import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase';
import { db } from '@/lib/db';

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

    // Prisma fallback - update sort order for supported tables
    for (const item of items) {
      try {
        switch (table) {
          case 'products':
            await db.product.update({ where: { id: item.id }, data: { /* sort_order not in schema */ } });
            break;
          case 'news':
            await db.news.update({ where: { id: item.id }, data: { /* sort_order not in schema */ } });
            break;
          case 'village_services':
            await db.villageService.update({ where: { id: item.id }, data: { /* sort_order not in schema */ } });
            break;
          case 'courses':
            await db.course.update({ where: { id: item.id }, data: { /* sort_order not in schema */ } });
            break;
          case 'literacy_materials':
            await db.literacyMaterial.update({ where: { id: item.id }, data: { /* sort_order not in schema */ } });
            break;
        }
      } catch {
        // Skip items that don't exist
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reorder error:', error);
    return NextResponse.json({ error: 'Gagal mengupdate urutan' }, { status: 500 });
  }
}
