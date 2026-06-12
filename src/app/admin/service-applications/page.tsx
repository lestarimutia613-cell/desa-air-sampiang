'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ServiceApplication {
  id: string;
  service_type: string;
  applicant_name: string;
  applicant_nik: string | null;
  form_data: Record<string, string>;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  'PENDING': 'bg-amber-100 text-amber-800',
  'APPROVED': 'bg-green-100 text-green-800',
  'REJECTED': 'bg-red-100 text-red-800',
  'PROCESSING': 'bg-blue-100 text-blue-800',
  'COMPLETED': 'bg-emerald-100 text-emerald-800',
};

const statusLabels: Record<string, string> = {
  'PENDING': 'Menunggu',
  'APPROVED': 'Disetujui',
  'REJECTED': 'Ditolak',
  'PROCESSING': 'Diproses',
  'COMPLETED': 'Selesai',
};

const statusIcons: Record<string, React.ReactNode> = {
  'PENDING': <Clock className="h-4 w-4" />,
  'APPROVED': <CheckCircle2 className="h-4 w-4" />,
  'REJECTED': <XCircle className="h-4 w-4" />,
  'PROCESSING': <AlertCircle className="h-4 w-4" />,
  'COMPLETED': <CheckCircle2 className="h-4 w-4" />,
};

export default function ServiceApplicationsPage() {
  const [applications, setApplications] = useState<ServiceApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/service-applications')
      .then((r) => r.json())
      .then((data) => {
        setApplications(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch('/api/service-applications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        status,
        adminNotes: adminNotes[id] || undefined,
      }),
    });

    if (res.ok) {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status, admin_notes: adminNotes[id] || null } : app
        )
      );
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pengajuan Layanan</h2>
          <p className="text-sm text-gray-500">Kelola pengajuan surat dan layanan desa dari warga</p>
        </div>
        <Badge className="bg-amber-100 text-amber-800">
          {applications.filter((a) => a.status === 'PENDING').length} Menunggu
        </Badge>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Memuat data...</div>
      ) : applications.length === 0 ? (
        <Card className="border-gray-200">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-bold text-gray-600 mb-2">Belum Ada Pengajuan</h3>
            <p className="text-sm text-gray-500">Pengajuan layanan dari warga akan muncul di sini</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id} className="border-gray-200">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-900 text-sm">{app.applicant_name}</h3>
                      <Badge className={statusColors[app.status] || 'bg-gray-100'}>
                        <span className="flex items-center gap-1">
                          {statusIcons[app.status]}
                          {statusLabels[app.status] || app.status}
                        </span>
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      Jenis: <span className="font-medium text-gray-700">{app.service_type}</span>
                      {app.applicant_nik && ` | NIK: ${app.applicant_nik}`}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(app.created_at || new Date().toISOString())}
                    </p>

                    <button
                      onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                      className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800 mt-2"
                    >
                      <Eye className="h-3 w-3" />
                      {expandedId === app.id ? 'Sembunyikan Detail' : 'Lihat Detail'}
                      {expandedId === app.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>

                    {expandedId === app.id && (
                      <div className="mt-4 space-y-4">
                        {/* Form Data */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-xs font-bold text-gray-700 mb-2">Data Pengajuan</h4>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {Object.entries(app.form_data || {}).map(([key, value]) => (
                              <div key={key} className="text-xs">
                                <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>{' '}
                                <span className="font-medium text-gray-800">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Admin Actions */}
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium text-gray-700 mb-1 block">Catatan Admin</label>
                            <Textarea
                              value={adminNotes[app.id] || app.admin_notes || ''}
                              onChange={(e) =>
                                setAdminNotes((prev) => ({ ...prev, [app.id]: e.target.value }))
                              }
                              placeholder="Tambahkan catatan..."
                              rows={2}
                              className="text-xs"
                            />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {app.status !== 'APPROVED' && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-xs"
                                onClick={() => updateStatus(app.id, 'APPROVED')}
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Setujui
                              </Button>
                            )}
                            {app.status !== 'PROCESSING' && app.status !== 'COMPLETED' && (
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-xs"
                                onClick={() => updateStatus(app.id, 'PROCESSING')}
                              >
                                <AlertCircle className="h-3 w-3 mr-1" /> Proses
                              </Button>
                            )}
                            {app.status !== 'COMPLETED' && (
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-xs"
                                onClick={() => updateStatus(app.id, 'COMPLETED')}
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Selesai
                              </Button>
                            )}
                            {app.status !== 'REJECTED' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
                                onClick={() => updateStatus(app.id, 'REJECTED')}
                              >
                                <XCircle className="h-3 w-3 mr-1" /> Tolak
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
