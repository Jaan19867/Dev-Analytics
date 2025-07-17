import React, { ReactNode, createContext, useContext, useState } from 'react';

type ChartContextType = {
  checked: boolean;
  clicked: string;
  setChartType: React.Dispatch<React.SetStateAction<boolean>>;
  setClicked: React.Dispatch<React.SetStateAction<string>>;
};

const ChartTypeContext = createContext<ChartContextType | undefined>(undefined);

export const ChartTypeProvider = ({ children }: { children: ReactNode }) => {
  const [checked, setChartType] = useState<boolean>(false);
  const [clicked, setClicked] = useState<string>('uniqueVisitors');
  return (
    <ChartTypeContext.Provider value={{ checked, setChartType, clicked, setClicked }}>
      {children}
    </ChartTypeContext.Provider>
  );
};

export const useChartType = () => {
  const context = useContext(ChartTypeContext);
  if (context === null) {
    throw new Error('useChartType must be used within a UserIdProvider');
  }
  return context;
};
