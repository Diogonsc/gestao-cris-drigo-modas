import { createContext, useContext, useState, useEffect } from 'react';

type ThemeSettingsContextType = {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
};

const ThemeSettingsContext = createContext<ThemeSettingsContextType | undefined>(undefined);

export function ThemeSettingsProvider({ children }: { children: React.ReactNode }) {
  const [primaryColor, setPrimaryColorState] = useState(() => {
    // Tenta recuperar a cor do localStorage, se não existir usa a cor padrão
    if (typeof window !== 'undefined') {
      return localStorage.getItem('primaryColor') || '#00A3E0';
    }
    return '#00A3E0';
  });

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color);
    localStorage.setItem('primaryColor', color);
  };

  return (
    <ThemeSettingsContext.Provider value={{ primaryColor, setPrimaryColor }}>
      {children}
    </ThemeSettingsContext.Provider>
  );
}

export function useThemeSettings() {
  const context = useContext(ThemeSettingsContext);
  if (context === undefined) {
    throw new Error('useThemeSettings must be used within a ThemeSettingsProvider');
  }
  return context;
} 