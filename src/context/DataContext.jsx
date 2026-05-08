import React, { createContext, useContext } from 'react';
import { useISSData } from '../hooks/useISSData';
import { useNewsData } from '../hooks/useNewsData';
import { useAstros } from '../hooks/useAstros';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const issData = useISSData();
  const newsData = useNewsData();
  const astroData = useAstros();

  return (
    <DataContext.Provider value={{ issData, newsData, astroData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDashboardData = () => useContext(DataContext);
