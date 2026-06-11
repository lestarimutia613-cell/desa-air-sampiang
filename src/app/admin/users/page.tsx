'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Loader2, Mail, Phone, MapPin } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string | null;
  address: string | null;
  created_at: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const admin = localStorage.getItem('desa_admin');
    if (!admin) { router.replace('/admin/login'); return; }
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola Pengguna</h2>
          <p className="text-sm text-gray-500">{users.length} pengguna terdaftar</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400"><Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" /> Memuat...</div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id} className="border-gray-200">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{user.name}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {user.email}</span>
                    {user.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {user.phone}</span>}
                  </div>
                  {user.address && (
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {user.address}
                    </p>
                  )}
                </div>
                <Badge className="bg-blue-100 text-blue-700">{user.role}</Badge>
              </CardContent>
            </Card>
          ))}
          {users.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Belum ada pengguna terdaftar</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
