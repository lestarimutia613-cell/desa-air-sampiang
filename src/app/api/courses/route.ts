import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const courses = await db.course.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Courses GET error:', error);
    return NextResponse.json({ error: 'Gagal memuat kursus' }, { status: 500 });
  }
}
