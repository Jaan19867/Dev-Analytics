'use client';
import React from 'react';
import '@/styles/globals.css';
import { WebsitesProvider } from '@/store/website.context';
import { TimelineTypeProvider } from '@/store/timeline.context';
import { ChartTypeProvider } from '@/store/chart.context';
import { UserProvider } from '@/store/userId.context';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <WebsitesProvider>
      <TimelineTypeProvider>
        <ChartTypeProvider>
          <UserProvider>{children}</UserProvider>
        </ChartTypeProvider>
      </TimelineTypeProvider>
    </WebsitesProvider>
  );
}
