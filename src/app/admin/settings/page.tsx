'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Save,
  MapPin,
  Phone,
  Mail,
  Globe,
  Palette,
  CreditCard,
  MessageCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    const admin = localStorage.getItem('desa_admin');
    if (!admin) {
      router.replace('/admin/login');
      return;
    }
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      console.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pengaturan</h2>
          <p className="text-sm text-gray-500">Konfigurasi website dan informasi desa</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="h-4 w-4 mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saving ? 'Menyimpan...' : saved ? 'Tersimpan!' : 'Simpan'}
        </Button>
      </div>

      {/* Village Information */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-500" /> Informasi Desa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Desa</Label>
              <Input
                value={settings.village_name || ''}
                onChange={(e) => updateSetting('village_name', e.target.value)}
                placeholder="Nama desa"
              />
            </div>
            <div className="space-y-2">
              <Label>Telepon</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  value={settings.village_phone || ''}
                  onChange={(e) => updateSetting('village_phone', e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea
              value={settings.village_description || ''}
              onChange={(e) => updateSetting('village_description', e.target.value)}
              placeholder="Deskripsi desa"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Alamat</Label>
            <Input
              value={settings.village_address || ''}
              onChange={(e) => updateSetting('village_address', e.target.value)}
              placeholder="Alamat lengkap desa"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  value={settings.village_email || ''}
                  onChange={(e) => updateSetting('village_email', e.target.value)}
                  placeholder="email@desa.id"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  value={settings.village_whatsapp || ''}
                  onChange={(e) => updateSetting('village_whatsapp', e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Configuration */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-orange-500" /> Konfigurasi Peta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Koordinat Desa (Latitude, Longitude)</Label>
            <Input
              value={settings.village_coordinates || ''}
              onChange={(e) => updateSetting('village_coordinates', e.target.value)}
              placeholder="-3.558,102.602"
            />
            <p className="text-xs text-gray-400">Format: latitude,longitude (contoh: -3.558,102.602)</p>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5 text-orange-500" /> Tampilan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Warna Utama (Primary)</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.primary_color || '#059669'}
                  onChange={(e) => updateSetting('primary_color', e.target.value)}
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={settings.primary_color || '#059669'}
                  onChange={(e) => updateSetting('primary_color', e.target.value)}
                  placeholder="#059669"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Warna Aksen (Accent)</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.accent_color || '#d97706'}
                  onChange={(e) => updateSetting('accent_color', e.target.value)}
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={settings.accent_color || '#d97706'}
                  onChange={(e) => updateSetting('accent_color', e.target.value)}
                  placeholder="#d97706"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-orange-500" /> Media Sosial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Facebook URL</Label>
            <Input
              value={settings.facebook_url || ''}
              onChange={(e) => updateSetting('facebook_url', e.target.value)}
              placeholder="https://facebook.com/desaairsempiang"
            />
          </div>
          <div className="space-y-2">
            <Label>Instagram URL</Label>
            <Input
              value={settings.instagram_url || ''}
              onChange={(e) => updateSetting('instagram_url', e.target.value)}
              placeholder="https://instagram.com/desaairsempiang"
            />
          </div>
          <div className="space-y-2">
            <Label>YouTube URL</Label>
            <Input
              value={settings.youtube_url || ''}
              onChange={(e) => updateSetting('youtube_url', e.target.value)}
              placeholder="https://youtube.com/@desaairsempiang"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Configuration */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-500" /> Konfigurasi Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Bank BRI</Label>
            <Input
              value={settings.bank_bri || ''}
              onChange={(e) => updateSetting('bank_bri', e.target.value)}
              placeholder="Nomor rekening BRI"
            />
          </div>
          <div className="space-y-2">
            <Label>Bank Mandiri</Label>
            <Input
              value={settings.bank_mandiri || ''}
              onChange={(e) => updateSetting('bank_mandiri', e.target.value)}
              placeholder="Nomor rekening Mandiri"
            />
          </div>
          <div className="space-y-2">
            <Label>Bank BNI</Label>
            <Input
              value={settings.bank_bni || ''}
              onChange={(e) => updateSetting('bank_bni', e.target.value)}
              placeholder="Nomor rekening BNI"
            />
          </div>
          <Separator />
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>GoPay</Label>
              <Input
                value={settings.gopay_number || ''}
                onChange={(e) => updateSetting('gopay_number', e.target.value)}
                placeholder="Nomor GoPay"
              />
            </div>
            <div className="space-y-2">
              <Label>OVO</Label>
              <Input
                value={settings.ovo_number || ''}
                onChange={(e) => updateSetting('ovo_number', e.target.value)}
                placeholder="Nomor OVO"
              />
            </div>
            <div className="space-y-2">
              <Label>DANA</Label>
              <Input
                value={settings.dana_number || ''}
                onChange={(e) => updateSetting('dana_number', e.target.value)}
                placeholder="Nomor DANA"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button Bottom */}
      <div className="flex justify-end pb-8">
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="bg-orange-600 hover:bg-orange-700"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="h-4 w-4 mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saving ? 'Menyimpan...' : saved ? 'Tersimpan!' : 'Simpan Semua Pengaturan'}
        </Button>
      </div>
    </div>
  );
}
