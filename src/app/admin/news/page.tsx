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
import { Plus, Pencil, Trash2, Newspaper, Loader2 } from 'lucide-react';
import { SortableList } from '@/components/admin/SortableList';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string | null;
  author: string;
  sort_order: number;
  created_at?: string;
  createdAt?: string;
}

const defaultForm = { title: '', content: '', image: '', author: 'Admin Desa' };

export default function AdminNewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const admin = localStorage.getItem('desa_admin');
    if (!admin) { router.replace('/admin/login'); return; }
    fetchNews();
  }, [router]);

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      setNews(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await fetch('/api/news', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...form }),
        });
      } else {
        await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      setDialogOpen(false);
      setForm(defaultForm);
      setEditingId(null);
      fetchNews();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus berita ini?')) return;
    await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
    fetchNews();
  };

  const handleEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setForm({ title: item.title, content: item.content, image: item.image || '', author: item.author });
    setDialogOpen(true);
  };

  const handleReorder = async (newItems: NewsItem[]) => {
    setNews(newItems);
    const reorderData = newItems.map((item, index) => ({ id: item.id, sort_order: index }));
    await fetch('/api/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'news', items: reorderData }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola Berita</h2>
          <p className="text-sm text-gray-500">{news.length} berita terdaftar</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) { setEditingId(null); setForm(defaultForm); }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" /> Tambah Berita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Berita' : 'Tambah Berita Baru'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Judul</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Judul berita" />
              </div>
              <div className="space-y-2">
                <Label>Konten</Label>
                <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Isi berita" rows={5} />
              </div>
              <div className="space-y-2">
                <Label>Penulis</Label>
                <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full bg-orange-600 hover:bg-orange-700">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {editingId ? 'Simpan Perubahan' : 'Tambah Berita'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400"><Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" /> Memuat...</div>
      ) : (
        <SortableList
          items={news}
          onReorder={handleReorder}
          renderItem={(item: NewsItem) => (
            <Card className="border-gray-200">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0">
                  <Newspaper className="h-6 w-6 text-cyan-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                  <p className="text-xs text-gray-400">Oleh: {item.author} • {new Date(item.created_at || Date.now()).toLocaleDateString('id-ID')}</p>
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
