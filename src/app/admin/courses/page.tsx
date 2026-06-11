'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, GraduationCap, Loader2 } from 'lucide-react';
import { SortableList } from '@/components/admin/SortableList';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  image: string | null;
  sort_order: number;
}

const defaultForm = { title: '', description: '', instructor: '', category: 'TEKNOLOGI', image: '' };

export default function AdminCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const admin = localStorage.getItem('desa_admin');
    if (!admin) { router.replace('/admin/login'); return; }
    fetchCourses();
  }, [router]);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      setCourses(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await fetch('/api/courses', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...form, image: form.image || null }),
        });
      } else {
        await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, image: form.image || null }),
        });
      }
      setDialogOpen(false);
      setForm(defaultForm);
      setEditingId(null);
      fetchCourses();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kursus ini?')) return;
    await fetch(`/api/courses?id=${id}`, { method: 'DELETE' });
    fetchCourses();
  };

  const handleEdit = (item: Course) => {
    setEditingId(item.id);
    setForm({ title: item.title, description: item.description, instructor: item.instructor, category: item.category, image: item.image || '' });
    setDialogOpen(true);
  };

  const handleReorder = async (newItems: Course[]) => {
    setCourses(newItems);
    const reorderData = newItems.map((item, index) => ({ id: item.id, sort_order: index }));
    await fetch('/api/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'courses', items: reorderData }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola Kursus</h2>
          <p className="text-sm text-gray-500">{courses.length} kursus terdaftar</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) { setEditingId(null); setForm(defaultForm); }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" /> Tambah Kursus
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Kursus' : 'Tambah Kursus Baru'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Judul</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Judul kursus" />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi kursus" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Instruktur</Label>
                  <Input value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="TEKNOLOGI, UMKM, dll" />
                </div>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full bg-orange-600 hover:bg-orange-700">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {editingId ? 'Simpan Perubahan' : 'Tambah Kursus'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400"><Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" /> Memuat...</div>
      ) : (
        <SortableList
          items={courses}
          onReorder={handleReorder}
          renderItem={(item: Course) => (
            <Card className="border-gray-200">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                  <GraduationCap className="h-6 w-6 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-gray-100 text-gray-600 text-[10px]">{item.category}</Badge>
                    <span className="text-xs text-gray-400">Instruktur: {item.instructor}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="h-8 w-8 text-gray-400 hover:text-orange-600">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-gray-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        />
      )}
    </div>
  );
}
