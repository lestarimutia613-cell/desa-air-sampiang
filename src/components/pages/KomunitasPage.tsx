'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  User,
  UserCheck,
  Baby,
  Heart,
  GraduationCap,
  Monitor,
  ShoppingBag,
  Sprout,
  Building,
  Palette,
  Languages,
  BookOpen,
  FileText,
  Laptop,
} from 'lucide-react';

interface ResidentData {
  id: string;
  category: string;
  total: number;
  male: number;
  female: number;
  description: string | null;
  year: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
}

interface LiteracyMaterial {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string | null;
}

const courseCategoryIcons: Record<string, React.ReactNode> = {
  'TEKNOLOGI': <Monitor className="h-6 w-6" />,
  'UMKM': <ShoppingBag className="h-6 w-6" />,
  'PERTANIAN': <Sprout className="h-6 w-6" />,
  'PEMERINTAHAN': <Building className="h-6 w-6" />,
  'BUDAYA': <Palette className="h-6 w-6" />,
  'BAHASA': <Languages className="h-6 w-6" />,
};

const courseCategoryColors: Record<string, string> = {
  'TEKNOLOGI': 'bg-blue-100 text-blue-800',
  'UMKM': 'bg-orange-100 text-orange-800',
  'PERTANIAN': 'bg-green-100 text-green-800',
  'PEMERINTAHAN': 'bg-purple-100 text-purple-800',
  'BUDAYA': 'bg-pink-100 text-pink-800',
  'BAHASA': 'bg-cyan-100 text-cyan-800',
};

const literacyCategoryIcons: Record<string, React.ReactNode> = {
  'E-GOVERNMENT': <Laptop className="h-6 w-6" />,
  'UMKM': <FileText className="h-6 w-6" />,
  'PERTANIAN': <Sprout className="h-6 w-6" />,
  'PENDIDIKAN': <GraduationCap className="h-6 w-6" />,
};

function KependudukanTab() {
  const [data, setData] = useState<ResidentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/residents')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const icons: Record<string, React.ReactNode> = {
    'Total Penduduk': <Users className="h-6 w-6" />,
    'Kepala Keluarga': <UserCheck className="h-6 w-6" />,
    'Usia Produktif (18-55)': <User className="h-6 w-6" />,
    'Anak-anak (0-17 tahun)': <Baby className="h-6 w-6" />,
    'Lansia (55+ tahun)': <Heart className="h-6 w-6" />,
    'Pelajar/Mahasiswa': <GraduationCap className="h-6 w-6" />,
  };

  return (
    <div>
      {!loading && data.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {data.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow border-emerald-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                    {icons[item.category] || <Users className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-900">{item.category}</h3>
                    <p className="text-2xl font-bold text-emerald-700">
                      {item.total.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
                {item.male > 0 || item.female > 0 ? (
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-600 flex items-center gap-1">
                        <User className="h-3 w-3" /> Laki-laki
                      </span>
                      <span className="font-medium">{item.male.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(item.male / item.total) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-pink-600 flex items-center gap-1">
                        <User className="h-3 w-3" /> Perempuan
                      </span>
                      <span className="font-medium">{item.female.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-pink-500 h-2 rounded-full"
                        style={{ width: `${(item.female / item.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : null}
                {item.description && (
                  <p className="text-xs text-gray-500 mt-4 leading-relaxed">{item.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
        <CardHeader>
          <CardTitle className="text-emerald-800">Ringkasan Data Kependudukan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-emerald-700">3.245</p>
              <p className="text-sm text-gray-600">Total Penduduk</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-blue-600">1.642</p>
              <p className="text-sm text-gray-600">Laki-laki</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-pink-600">1.603</p>
              <p className="text-sm text-gray-600">Perempuan</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-amber-600">856</p>
              <p className="text-sm text-gray-600">Kepala Keluarga</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CorporateUniversityTab() {
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
    <div>
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
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${courseCategoryColors[course.category] || 'bg-gray-100 text-gray-800'}`}>
                  {courseCategoryIcons[course.category] || <GraduationCap className="h-6 w-6" />}
                </div>
                <Badge className={courseCategoryColors[course.category] || 'bg-gray-100 text-gray-800'}>
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
  );
}

function LiterasiTab() {
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
    <div>
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
                  {literacyCategoryIcons[material.category] || <BookOpen className="h-6 w-6" />}
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
  );
}

export default function KomunitasPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge className="bg-emerald-100 text-emerald-800 mb-3">Komunitas</Badge>
          <h1 className="text-3xl font-bold text-emerald-900 mb-3">Komunitas Desa Air Sempiang</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Data kependudukan, program pendidikan, dan literasi untuk pemberdayaan warga desa.
          </p>
        </div>

        <Tabs defaultValue="kependudukan" className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="kependudukan" className="text-xs sm:text-sm">
              <Users className="h-4 w-4 mr-1" />
              Kependudukan
            </TabsTrigger>
            <TabsTrigger value="corpu" className="text-xs sm:text-sm">
              <GraduationCap className="h-4 w-4 mr-1" />
              Corpu
            </TabsTrigger>
            <TabsTrigger value="literasi" className="text-xs sm:text-sm">
              <BookOpen className="h-4 w-4 mr-1" />
              Literasi
            </TabsTrigger>
          </TabsList>
          <TabsContent value="kependudukan">
            <KependudukanTab />
          </TabsContent>
          <TabsContent value="corpu">
            <CorporateUniversityTab />
          </TabsContent>
          <TabsContent value="literasi">
            <LiterasiTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
