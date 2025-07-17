import React, { ReactNode, createContext, useContext, useState } from 'react';

type TimelineType = {
  timeline: string;
  setTimeline: React.Dispatch<React.SetStateAction<string>>;
};

const TimelineTypeContext = createContext<TimelineType | undefined>(undefined);

export const TimelineTypeProvider = ({ children }: { children: ReactNode }) => {
  const [timeline, setTimeline] = useState<string>('today');
  return <TimelineTypeContext.Provider value={{ timeline, setTimeline }}>{children}</TimelineTypeContext.Provider>;
};

export const useTimeline = () => {
  const context = useContext(TimelineTypeContext);
  if (context === null) {
    throw new Error('useTimeline must be used within a UserIdProvider');
  }
  return context;
};
