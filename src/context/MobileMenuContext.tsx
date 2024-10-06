import React, { useContext, createContext, useState, ReactNode } from 'react';

interface ContextType {
  showMobileMenu: boolean;
  setShowMobileMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultValue: ContextType = {
  showMobileMenu: false,
  setShowMobileMenu: () => {},
};

const MobileMenuContext = createContext<ContextType>(defaultValue);

export const useMobileMenuConext = () => useContext(MobileMenuContext);

export const MobileMenuContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  return (
    <MobileMenuContext.Provider value={{ showMobileMenu, setShowMobileMenu }}>
      {children}
    </MobileMenuContext.Provider>
  );
};
