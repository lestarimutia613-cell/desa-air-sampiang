'use client';

import PublicLayout from '@/components/layout/PublicLayout';
import LoginPage from '@/components/pages/LoginPage';

export default function LoginRoute() {
  return (
    <PublicLayout>
      <LoginPage />
    </PublicLayout>
  );
}
