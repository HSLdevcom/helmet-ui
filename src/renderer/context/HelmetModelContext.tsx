import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';

interface HelmetModelContextProps {
  helmetModelSystemVersion: string | undefined;
  setHelmetModelSystemVersion: (version: string | undefined) => void;
  majorVersion: number | undefined;
}

interface HelmetModelProviderProps {
  children: ReactNode;
}

const HelmetModelContext = createContext<HelmetModelContextProps | undefined>(undefined);

export const HelmetModelProvider: React.FC<HelmetModelProviderProps> = ({ children }) => {
  const [helmetModelSystemVersion, setHelmetModelSystemVersion] = useState<string | undefined>(undefined);

  // Derived state for the major version
  const majorVersion = useMemo(() => {
    if (helmetModelSystemVersion) {
      const major = parseInt(helmetModelSystemVersion.split('.')[0], 10);
      return isNaN(major) ? undefined : major;
    }
    return undefined;
  }, [helmetModelSystemVersion]);

  return (
    <HelmetModelContext.Provider value={{ helmetModelSystemVersion, setHelmetModelSystemVersion, majorVersion }}>
      {children}
    </HelmetModelContext.Provider>
  );
};

export const useHelmetModelContext = (): HelmetModelContextProps => {
  const context = useContext(HelmetModelContext);
  if (!context) {
    throw new Error('useHelmetModelContext must be used within a HelmetModelProvider');
  }
  return context;
};
