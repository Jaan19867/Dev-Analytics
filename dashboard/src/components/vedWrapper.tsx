'use client';

import { VedAnalytics } from 'ved-analytics';

const VedWrapper: React.FC = () => {
  return (
    <VedAnalytics
      project={process.env.NEXT_PUBLIC_VED_PROJECT_ID as string}
      apiKey={process.env.NEXT_PUBLIC_VED_API_KEY as string}
    />
  );
};

export default VedWrapper;
