'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Laptop, Sprout, GraduationCap } from 'lucide-react';

interface LiteracyMaterial {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string | null;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'E-GOVERNMENT': <Laptop className="h-6 w-6" />,
  'UMKM': <FileText className="h-6 w-6" />,
  'PERTANIAN': <Sprout className="h-6 w-6" />,
  'PENDIDIKAN': <GraduationCap className="h-6 w-6" />,
};

export default function LiterasiPage() {
  const [materials, setMaterials] = useState<LiteracyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    fetch('/api/literacy')
      .then((r) => r.json())
      .then((d) => { setMaterials(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['ALL', ...Array.from(new Set(materials.map((m) => m.category)))];
  const filtered = selectedCategory === 'ALL' ? materials : materials.filter((m) => m.category === selectedCategory);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge className="bg-emerald-100 text-emerald-800 mb-3">Literasi</Badge>
          <h1 className="text-3xl font-bold text-emerald-900 mb-3">Pusat Literasi Desa Air Sempiang</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Koleksi materi bacaan, panduan, dan modul pelatihan untuk meningkatkan literasi dan pengetahuan warga desa.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-emerald-50'
              }`}
            >
              {cat === 'ALL' ? 'Semua' : cat}
            </button>
          ))}
        </div>

        {/* Materials */}
        <div className="grid sm:grid-cols-2 gap-6">
          {filtered.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow border-emerald-100">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                    {categoryIcons[material.category] || <BookOpen className="h-6 w-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge className="bg-emerald-100 text-emerald-800 mb-2">{material.category}</Badge>
                    <h3 className="font-bold text-emerald-900 mb-2 text-lg">{material.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-4">{material.content}</p>
                    {material.author && (
                      <p className="text-xs text-gray-400">Oleh: {material.author}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info */}
        <Card className="mt-8 border-emerald-200 bg-emerald-50">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
            <h3 className="font-bold text-emerald-800 mb-2">Literasi Digital untuk Semua</h3>
            <p className="text-sm text-gray-600">
              Program literasi digital Desa Air Sempiang bertujuan meningkatkan kemampuan warga dalam 
              memanfaatkan teknologi informasi untuk kehidupan sehari-hari dan pemberdayaan ekonomi.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
