import { useState, useEffect } from 'react';
import type { ThemeName } from '../utils/themes';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('sebmc-theme') as ThemeName | null;
    if (savedTheme) {
      return savedTheme;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'midnight';
    }

    return 'chris';
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);

    // Save to localStorage
    localStorage.setItem('sebmc-theme', theme);
  }, [theme]);

  return { theme, setTheme };
}
