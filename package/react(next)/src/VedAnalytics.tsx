'use client';

import { useEffect } from 'react';

interface VedAnalyticsProps {
  project: string;
  apiKey: string;
}

const VedAnalytics: React.FC<VedAnalyticsProps> = ({ project, apiKey }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://scripts.vedanalytics.in/bundle.js';
    script.dataset.project = project;
    script.dataset.apiKey = apiKey;
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [project, apiKey]);

  return null;
};

export default VedAnalytics;
