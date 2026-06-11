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
import { Plus, Pencil, Trash2, FileText, Loader2 } from 'lucide-react';
import { SortableList } from '@/components/admin/SortableList';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  requirements: string | null;
  sort_order: number;
}

const defaultForm = { name: '', description: '', category: 'SURAT', requirements: '' };

export default function AdminServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const admin = localStorage.getItem('desa_admin');
    if (!admin) { router.replace('/admin/login'); return; }
    fetchServices();
  }, [router]);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await fetch('/api/services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...form, requirements: form.requirements || null }),
        });
      } else {
        await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, requirements: form.requirements || null }),
        });
      }
      setDialogOpen(false);
      setForm(defaultForm);
      setEditingId(null);
      fetchServices();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus layanan ini?')) return;
    await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
    fetchServices();
  };

  const handleEdit = (item: Service) => {
    setEditingId(item.id);
    setForm({ name: item.name, description: item.description, category: item.category, requirements: item.requirements || '' });
    setDialogOpen(true);
  };

  const handleReorder = async (newItems: Service[]) => {
    setServices(newItems);
    const reorderData = newItems.map((item, index) => ({ id: item.id, sort_order: index }));
    await fetch('/api/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'village_services', items: reorderData }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola Layanan</h2>
          <p className="text-sm text-gray-500">{services.length} layanan terdaftar</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) { setEditingId(null); setForm(defaultForm); }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" /> Tambah Layanan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Layanan' : 'Tambah Layanan Baru'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Layanan</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama layanan" />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi layanan" rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="KEPENDUDUKAN, SURAT, dll" />
              </div>
              <div className="space-y-2">
                <Label>Persyaratan</Label>
                <Textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="Persyaratan (opsional)" rows={2} />
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full bg-orange-600 hover:bg-orange-700">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {editingId ? 'Simpan Perubahan' : 'Tambah Layanan'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400"><Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" /> Memuat...</div>
      ) : (
        <SortableList
          items={services}
          onReorder={handleReorder}
          renderItem={(item: Service) => (
            <Card className="border-gray-200">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 text-pink-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                  <Badge className="bg-gray-100 text-gray-600 text-[10px] mt-1">{item.category}</Badge>
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
