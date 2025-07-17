'use client';
import React from 'react';
import StatDetails from '../_components/details';
import { useSearchParams } from 'next/navigation';
import { useParams } from 'next/navigation';

const Pages = () => {
  const searchParams = useSearchParams();
  const paramValue = searchParams.get('key');
  const params = useParams();
  const site = params.site;
  return <StatDetails defaultValue={paramValue ? paramValue : 'pages'} site={site as string} />;
};

export default Pages;
