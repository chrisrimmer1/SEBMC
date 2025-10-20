export type ThemeName = 'chris' | 'olly' | 'midnight' | 'minimal' | 'ocean' | 'sunset';

export interface ThemeConfig {
  id: ThemeName;
  name: string;
  icon: string;
  description: string;
}

export const themes: ThemeConfig[] = [
  {
    id: 'chris',
    name: 'Chris',
    icon: '☀️',
    description: 'Original yellow & black design'
  },
  {
    id: 'olly',
    name: 'Olly',
    icon: '💗',
    description: 'Vibrant pink theme'
  },
  {
    id: 'midnight',
    name: 'Midnight',
    icon: '🌙',
    description: 'Dark mode'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    icon: '⬛',
    description: 'Black & white monochrome'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    icon: '🌊',
    description: 'Cool blue & teal'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    icon: '🌅',
    description: 'Warm coral & orange'
  }
];

export function getThemeConfig(themeName: ThemeName): ThemeConfig {
  return themes.find(t => t.id === themeName) || themes[0];
}
