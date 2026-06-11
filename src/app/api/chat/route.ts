import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Anda adalah asisten AI Desa Air Sempiang, Kecamatan Kabawetan, Kabupaten Kepahiang, Provinsi Bengkulu. 
Anda membantu warga desa dengan informasi tentang:
- Profil Desa Air Sempiang: Terletak di koordinat 3°33'28.8" LS dan 102°36'7.2" BT
- Batas wilayah: Utara: Kab. Rejang Lebong, Selatan: Kec. Tebat Karai, Barat: Kec. Ujan Mas, Timur: Kec. Muara Kemumu
- Layanan desa, kependudukan, UMKM, pertanian, pendidikan
- Program Desa Cantik
- Marketplace produk UMKM lokal
Jawab dengan bahasa Indonesia yang sopan dan ramah. Jika ditanya hal di luar konteks desa, arahkan ke topik desa.`
        },
        {
          role: 'user',
          content: message
        }
      ],
    });

    const reply = completion.choices?.[0]?.message?.content || 'Maaf, saya tidak dapat memproses pertanyaan Anda saat ini. Silakan coba lagi.';
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      reply: 'Maaf, layanan chat sedang tidak tersedia. Silakan hubungi kantor desa langsung di 085150859735 atau melalui WhatsApp.' 
    }, { status: 500 });
  }
}
