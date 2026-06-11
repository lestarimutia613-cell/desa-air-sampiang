import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createHash } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name, phone, address } = body;

    if (action === 'login') {
      const hashedPassword = createHash('sha256').update(password).digest('hex');
      const user = await db.user.findUnique({
        where: { email },
      });

      if (!user || user.password !== hashedPassword) {
        return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
      }

      return NextResponse.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        address: user.address,
      });
    }

    if (action === 'register') {
      const existing = await db.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
      }

      const hashedPassword = createHash('sha256').update(password).digest('hex');
      const user = await db.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: 'USER',
          phone: phone || null,
          address: address || null,
        },
      });

      return NextResponse.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        address: user.address,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
