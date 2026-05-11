import { createContext, useContext, useState } from 'react';

type ScrollBottomContextType = {
  hasContentBelow: boolean;
  setHasContentBelow: (v: boolean) => void;
};

const ScrollBottomContext = createContext<ScrollBottomContextType>({
  hasContentBelow: true,
  setHasContentBelow: () => {},
});

export function ScrollBottomProvider({ children }: { children: React.ReactNode }) {
  const [hasContentBelow, setHasContentBelow] = useState(true);
  return (
    <ScrollBottomContext.Provider value={{ hasContentBelow, setHasContentBelow }}>
      {children}
    </ScrollBottomContext.Provider>
  );
}

export const useScrollBottom = () => useContext(ScrollBottomContext);
