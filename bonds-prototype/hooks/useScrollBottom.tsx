import { createContext, useContext, useState } from 'react';

type ScrollBottomContextType = {
  hasContentBelow: boolean;
  setHasContentBelow: (v: boolean) => void;
  scrolledPastHeader: boolean;
  setScrolledPastHeader: (v: boolean) => void;
};

const ScrollBottomContext = createContext<ScrollBottomContextType>({
  hasContentBelow: true,
  setHasContentBelow: () => {},
  scrolledPastHeader: false,
  setScrolledPastHeader: () => {},
});

export function ScrollBottomProvider({ children }: { children: React.ReactNode }) {
  const [hasContentBelow, setHasContentBelow] = useState(true);
  const [scrolledPastHeader, setScrolledPastHeader] = useState(false);
  return (
    <ScrollBottomContext.Provider value={{ hasContentBelow, setHasContentBelow, scrolledPastHeader, setScrolledPastHeader }}>
      {children}
    </ScrollBottomContext.Provider>
  );
}

export const useScrollBottom = () => useContext(ScrollBottomContext);
