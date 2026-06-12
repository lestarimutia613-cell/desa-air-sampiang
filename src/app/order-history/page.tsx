'use client';

import PublicLayout from '@/components/layout/PublicLayout';
import OrderHistoryPage from '@/components/pages/OrderHistoryPage';

export default function OrderHistoryRoute() {
  return (
    <PublicLayout>
      <OrderHistoryPage />
    </PublicLayout>
  );
}
