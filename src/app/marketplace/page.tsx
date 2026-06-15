'use client';

import { Suspense } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import MarketplacePage from '@/components/pages/MarketplacePage';

export default function MarketplaceRoute() {
  return (
    <PublicLayout>
      <Suspense fallback={<div className="py-20 text-center text-gray-400">Memuat marketplace...</div>}>
        <MarketplacePage />
      </Suspense>
    </PublicLayout>
  );
}
