import { createContext, useState, useEffect, type ReactNode, useContext } from 'react';

export type TextSize = 'STANDARD' | 'LARGE' | 'EXTRA_LARGE';

interface AccessibilityState {
  highContrast: boolean;
  textSize: TextSize;
}

interface AccessibilityContextType extends AccessibilityState {
  setHighContrast: (val: boolean) => void;
  setTextSize: (val: TextSize) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('invictus_a11y_contrast') === 'true';
  });

  const [textSize, setTextSize] = useState<TextSize>(() => {
    return (localStorage.getItem('invictus_a11y_textsize') as TextSize) || 'STANDARD';
  });

  useEffect(() => {
    localStorage.setItem('invictus_a11y_contrast', highContrast.toString());
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('theme-high-contrast');
    } else {
      root.classList.remove('theme-high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('invictus_a11y_textsize', textSize);
    const root = document.documentElement;
    root.classList.remove('text-size-standard', 'text-size-large', 'text-size-extra-large');
    
    if (textSize === 'LARGE') {
      root.classList.add('text-size-large');
    } else if (textSize === 'EXTRA_LARGE') {
      root.classList.add('text-size-extra-large');
    } else {
      root.classList.add('text-size-standard');
    }
  }, [textSize]);

  return (
    <AccessibilityContext.Provider value={{ highContrast, textSize, setHighContrast, setTextSize }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
