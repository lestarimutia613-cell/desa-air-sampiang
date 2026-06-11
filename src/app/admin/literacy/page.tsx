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
import { Plus, Pencil, Trash2, BookOpen, Loader2 } from 'lucide-react';
import { SortableList } from '@/components/admin/SortableList';

interface LiteracyMaterial {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string | null;
  file_url: string | null;
  sort_order: number;
}

const defaultForm = { title: '', content: '', category: 'E-GOVERNMENT', author: '', file_url: '' };

export default function AdminLiteracyPage() {
  const router = useRouter();
  const [materials, setMaterials] = useState<LiteracyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const admin = localStorage.getItem('desa_admin');
    if (!admin) { router.replace('/admin/login'); return; }
    fetchMaterials();
  }, [router]);

  const fetchMaterials = async () => {
    try {
      const res = await fetch('/api/literacy');
      const data = await res.json();
      setMaterials(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await fetch('/api/literacy', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...form, author: form.author || null, file_url: form.file_url || null }),
        });
      } else {
        await fetch('/api/literacy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, author: form.author || null, file_url: form.file_url || null }),
        });
      }
      setDialogOpen(false);
      setForm(defaultForm);
      setEditingId(null);
      fetchMaterials();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus materi ini?')) return;
    await fetch(`/api/literacy?id=${id}`, { method: 'DELETE' });
    fetchMaterials();
  };

  const handleEdit = (item: LiteracyMaterial) => {
    setEditingId(item.id);
    setForm({ title: item.title, content: item.content, category: item.category, author: item.author || '', file_url: item.file_url || '' });
    setDialogOpen(true);
  };

  const handleReorder = async (newItems: LiteracyMaterial[]) => {
    setMaterials(newItems);
    const reorderData = newItems.map((item, index) => ({ id: item.id, sort_order: index }));
    await fetch('/api/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'literacy_materials', items: reorderData }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola Literasi</h2>
          <p className="text-sm text-gray-500">{materials.length} materi terdaftar</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) { setEditingId(null); setForm(defaultForm); }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" /> Tambah Materi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Materi' : 'Tambah Materi Baru'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Judul</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Judul materi" />
              </div>
              <div className="space-y-2">
                <Label>Konten</Label>
                <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Isi materi" rows={5} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="E-GOVERNMENT, dll" />
                </div>
                <div className="space-y-2">
                  <Label>Penulis</Label>
                  <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>File URL</Label>
                <Input value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} placeholder="URL file (opsional)" />
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full bg-orange-600 hover:bg-orange-700">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {editingId ? 'Simpan Perubahan' : 'Tambah Materi'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400"><Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" /> Memuat...</div>
      ) : (
        <SortableList
          items={materials}
          onReorder={handleReorder}
          renderItem={(item: LiteracyMaterial) => (
            <Card className="border-gray-200">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                  <BookOpen className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-gray-100 text-gray-600 text-[10px]">{item.category}</Badge>
                    {item.author && <span className="text-xs text-gray-400">Oleh: {item.author}</span>}
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
