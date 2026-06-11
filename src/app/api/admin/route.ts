import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
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
