import React, { createContext, useContext, useState } from 'react';

const MASK_LETTER_SPACING = 2;

interface HideValuesContextType {
  hidden: boolean;
  toggle: () => void;
  mask: (value: string) => string;
  maskStyle: { letterSpacing: number } | object;
}

const HideValuesContext = createContext<HideValuesContextType>({
  hidden: false,
  toggle: () => {},
  mask: (v) => v,
  maskStyle: {},
});

export function HideValuesProvider({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);

  const toggle = () => setHidden((h) => !h);
  const mask = (value: string) => (hidden ? '••••••' : value);
  const maskStyle = hidden ? { letterSpacing: MASK_LETTER_SPACING } : {};

  return (
    <HideValuesContext.Provider value={{ hidden, toggle, mask, maskStyle }}>
      {children}
    </HideValuesContext.Provider>
  );
}

export function useHideValues() {
  return useContext(HideValuesContext);
}
