import React, { createContext, useContext, useState } from 'react';

interface HideValuesContextType {
  hidden: boolean;
  toggle: () => void;
  mask: (value: string) => string;
}

const HideValuesContext = createContext<HideValuesContextType>({
  hidden: false,
  toggle: () => {},
  mask: (v) => v,
});

export function HideValuesProvider({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);

  const toggle = () => setHidden((h) => !h);
  const mask = (value: string) => (hidden ? '••••••' : value);

  return (
    <HideValuesContext.Provider value={{ hidden, toggle, mask }}>
      {children}
    </HideValuesContext.Provider>
  );
}

export function useHideValues() {
  return useContext(HideValuesContext);
}
