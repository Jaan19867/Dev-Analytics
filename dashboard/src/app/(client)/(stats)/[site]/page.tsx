'use client';
import { useEffect } from 'react';
import StatsCard from './_components/stats-card';

export default function SitePage({ params }: { params: { site: string } }) {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return (
    <div className="w-full">
      <div className="max-w-[1200px] mx-auto mt-24">
        <StatsCard name={params.site} />
      </div>
    </div>
  );
}
