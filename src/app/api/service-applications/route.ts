import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('service_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json(data);
    }

    // Prisma fallback
    const applications = await db.serviceApplication.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching service applications:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceType, applicantName, applicantNik, formData, userId } = body;

    if (!serviceType || !applicantName) {
      return NextResponse.json(
        { error: 'Jenis layanan dan nama pemohon wajib diisi' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('service_applications')
        .insert({
          service_type: serviceType,
          applicant_name: applicantName,
          applicant_nik: applicantNik || null,
          form_data: formData || {},
          status: 'PENDING',
          user_id: userId || null,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data, { status: 201 });
    }

    // Prisma fallback
    const application = await db.serviceApplication.create({
      data: {
        serviceType,
        applicantName,
        applicantNik: applicantNik || null,
        formData: JSON.stringify(formData || {}),
        status: 'PENDING',
        userId: userId || null,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Error creating service application:', error);
    return NextResponse.json(
      { error: 'Gagal mengirim pengajuan layanan' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID dan status wajib diisi' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('service_applications')
        .update({
          status,
          admin_notes: adminNotes || null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    // Prisma fallback
    const application = await db.serviceApplication.update({
      where: { id },
      data: {
        status,
        adminNotes: adminNotes || null,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error updating service application:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate pengajuan layanan' },
      { status: 500 }
    );
  }
}
