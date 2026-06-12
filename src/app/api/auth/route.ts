import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase';
import { createHash } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name, phone, address, username } = body;

    if (action === 'login') {
      const hashedPassword = createHash('sha256').update(password).digest('hex');

      if (isSupabaseConfigured) {
        const { data, error } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (error || !data || data.password !== hashedPassword) {
          return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
        }

        return NextResponse.json({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          phone: data.phone,
          address: data.address,
        });
      }

      // Prisma fallback
      const user = await db.user.findUnique({ where: { email } });
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
      const hashedPassword = createHash('sha256').update(password).digest('hex');

      if (isSupabaseConfigured) {
        const { data: existing } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', email)
          .single();

        if (existing) {
          return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
          .from('users')
          .insert({
            email,
            name,
            password: hashedPassword,
            role: 'USER',
            phone: phone || null,
            address: address || null,
          })
          .select()
          .single();

        if (error) {
          return NextResponse.json({ error: 'Gagal membuat akun' }, { status: 500 });
        }

        return NextResponse.json({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          phone: data.phone,
          address: data.address,
        });
      }

      // Prisma fallback
      const existing = await db.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
      }

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

    if (action === 'admin-login') {
      const hashedPassword = createHash('sha256').update(password).digest('hex');

      if (isSupabaseConfigured) {
        const { data, error } = await supabaseAdmin
          .from('admins')
          .select('*')
          .eq('username', username)
          .single();

        if (error || !data || data.password !== hashedPassword) {
          return NextResponse.json({ error: 'Username atau password admin salah' }, { status: 401 });
        }

        return NextResponse.json({
          id: data.id,
          username: data.username,
          email: data.email,
          name: data.name,
          role: 'ADMIN',
          phone: data.phone,
        });
      }

      // Prisma fallback
      const admin = await db.admin.findUnique({ where: { username } });
      if (!admin || admin.password !== hashedPassword) {
        return NextResponse.json({ error: 'Username atau password admin salah' }, { status: 401 });
      }

      return NextResponse.json({
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: 'ADMIN',
        phone: admin.phone,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
