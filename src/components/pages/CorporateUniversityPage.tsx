'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Monitor, ShoppingBag, Sprout, Building, Palette, Languages } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'TEKNOLOGI': <Monitor className="h-6 w-6" />,
  'UMKM': <ShoppingBag className="h-6 w-6" />,
  'PERTANIAN': <Sprout className="h-6 w-6" />,
  'PEMERINTAHAN': <Building className="h-6 w-6" />,
  'BUDAYA': <Palette className="h-6 w-6" />,
  'BAHASA': <Languages className="h-6 w-6" />,
};

const categoryColors: Record<string, string> = {
  'TEKNOLOGI': 'bg-blue-100 text-blue-800',
  'UMKM': 'bg-orange-100 text-orange-800',
  'PERTANIAN': 'bg-green-100 text-green-800',
  'PEMERINTAHAN': 'bg-purple-100 text-purple-800',
  'BUDAYA': 'bg-pink-100 text-pink-800',
  'BAHASA': 'bg-cyan-100 text-cyan-800',
};

export default function CorporateUniversityPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    fetch('/api/courses')
      .then((r) => r.json())
      .then((d) => { setCourses(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['ALL', ...Array.from(new Set(courses.map((c) => c.category)))];
  const filtered = selectedCategory === 'ALL' ? courses : courses.filter((c) => c.category === selectedCategory);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge className="bg-emerald-100 text-emerald-800 mb-3">Corporate University</Badge>
          <h1 className="text-3xl font-bold text-emerald-900 mb-3">Corporate University Desa Air Sempiang</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pusat pendidikan dan pelatihan berkelanjutan untuk meningkatkan kapasitas sumber daya manusia desa. 
            Berbagai kursus dan pelatihan tersedia untuk warga dari segala usia.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Program Kursus', value: '6+', icon: <GraduationCap className="h-5 w-5" /> },
            { label: 'Instruktur', value: '6+', icon: <Building className="h-5 w-5" /> },
            { label: 'Kategori', value: '6', icon: <Palette className="h-5 w-5" /> },
            { label: 'Alumni', value: '150+', icon: <Languages className="h-5 w-5" /> },
          ].map((stat, i) => (
            <Card key={i} className="border-emerald-100">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mx-auto mb-2">
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-emerald-800">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
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

        {/* Courses */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow border-emerald-100 group">
              <div className={`h-3 rounded-t-lg ${
                course.category === 'TEKNOLOGI' ? 'bg-blue-500' :
                course.category === 'UMKM' ? 'bg-orange-500' :
                course.category === 'PERTANIAN' ? 'bg-green-500' :
                course.category === 'PEMERINTAHAN' ? 'bg-purple-500' :
                course.category === 'BUDAYA' ? 'bg-pink-500' :
                'bg-cyan-500'
              }`} />
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${categoryColors[course.category] || 'bg-gray-100 text-gray-800'}`}>
                    {categoryIcons[course.category] || <GraduationCap className="h-6 w-6" />}
                  </div>
                  <Badge className={categoryColors[course.category] || 'bg-gray-100 text-gray-800'}>
                    {course.category}
                  </Badge>
                </div>
                <h3 className="font-bold text-emerald-900 mb-2 text-lg">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{course.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <GraduationCap className="h-4 w-4" />
                  <span>Instruktur: {course.instructor}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
