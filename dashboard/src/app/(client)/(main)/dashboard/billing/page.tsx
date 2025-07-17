import React from 'react';
import { BillingSkeleton } from './_components/billing-skeleton';
import { Billing } from './_components/billing';

const BillingPage = () => {
  return (
    <div className="grid gap-1 py-10 md:py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold md:text-4xl text-white">Billing</h1>
        <p className="text-sm text-muted-foreground text-white">Manage your billing and subscription</p>
      </div>
      <React.Suspense fallback={<BillingSkeleton />}>
        <Billing />
      </React.Suspense>
    </div>
  );
};

export default BillingPage;
