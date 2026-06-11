import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const [usersRes, productsRes, ordersRes, newsRes, servicesRes, coursesRes, pendingRes, revenueRes] = await Promise.all([
        supabaseAdmin.from('users').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('products').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('orders').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('news').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('village_services').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('courses').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'PENDING'),
        supabaseAdmin.from('orders').select('total_amount').in('status', ['PAID', 'DELIVERED']),
      ]);

      const totalRevenue = (revenueRes.data || []).reduce((sum: number, o: { total_amount: number }) => sum + (o.total_amount || 0), 0);

      return NextResponse.json({
        totalUsers: usersRes.count || 0,
        totalProducts: productsRes.count || 0,
        totalOrders: ordersRes.count || 0,
        totalNews: newsRes.count || 0,
        totalServices: servicesRes.count || 0,
        totalCourses: coursesRes.count || 0,
        pendingOrders: pendingRes.count || 0,
        totalRevenue: { _sum: { totalAmount: totalRevenue } },
      });
    }

    // Prisma fallback
    const stats = {
      totalUsers: await db.user.count(),
      totalProducts: await db.product.count(),
      totalOrders: await db.order.count(),
      totalNews: await db.news.count(),
      totalServices: await db.villageService.count(),
      totalCourses: await db.course.count(),
      pendingOrders: await db.order.count({ where: { status: 'PENDING' } }),
      totalRevenue: await db.order.aggregate({ _sum: { totalAmount: true }, where: { status: { in: ['PAID', 'DELIVERED'] } } }),
    };
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Gagal memuat statistik' }, { status: 500 });
  }
}
