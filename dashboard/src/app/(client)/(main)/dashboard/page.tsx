import React from 'react';
import { Posts } from '../_components/posts';
import { PostsSkeleton } from './_components/posts-skeleton';

const DashboardPage = () => {
  return (
    <div className="py-10 md:py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold md:text-4xl">Websites</h1>
        <p className="text-sm text-muted-foreground">Manage your websites here</p>
      </div>
      <React.Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </React.Suspense>
    </div>
  );
};

export default DashboardPage;
