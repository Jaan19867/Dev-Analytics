import React, { createContext, useContext, useState, ReactNode } from 'react';

export type website = {
  id: string;
  website: string;
  description: string;
  createdAt: Date;
};

type WebsitesContextType = {
  websites: website[];
  setWebsites: React.Dispatch<React.SetStateAction<website[]>>;
};

const WebsitesContext = createContext<WebsitesContextType | undefined>(undefined);

export const WebsitesProvider = ({ children }: { children: ReactNode }) => {
  const [websites, setWebsites] = useState<website[]>([]);

  return <WebsitesContext.Provider value={{ websites, setWebsites }}>{children}</WebsitesContext.Provider>;
};

export const useWebsites = () => {
  const context = useContext(WebsitesContext);
  if (!context) {
    throw new Error('useWebsites must be used within a WebsitesProvider');
  }
  return context;
};
