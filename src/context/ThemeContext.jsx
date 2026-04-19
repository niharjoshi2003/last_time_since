import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  CRIMSON_NIGHT: 'crimson-night',
};

const THEME_STORAGE_KEY = 'lasttimesince_theme';
const THEME_MOOD_VERSION_KEY = 'lasttimesince_theme_mood_version';
const HEARTBREAK_MOOD_VERSION = 'cinematic-red-v1';

const readStoredTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === THEMES.LIGHT || stored === THEMES.DARK || stored === THEMES.CRIMSON_NIGHT) {
      return stored;
    }
    if (stored === 'ultra-love') return THEMES.CRIMSON_NIGHT;
  } catch {
    /* ignore */
  }
  return null;
};

const getInitialTheme = () => {
  const storedTheme = readStoredTheme();
  if (storedTheme === THEMES.CRIMSON_NIGHT) return storedTheme;

  try {
    const migratedMood = localStorage.getItem(THEME_MOOD_VERSION_KEY);
    if (migratedMood !== HEARTBREAK_MOOD_VERSION) {
      localStorage.setItem(THEME_MOOD_VERSION_KEY, HEARTBREAK_MOOD_VERSION);
      return THEMES.CRIMSON_NIGHT;
    }
  } catch {
    /* ignore */
  }

  return storedTheme ?? THEMES.CRIMSON_NIGHT;
};

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const setTheme = (newTheme) => {
    if (
      newTheme === THEMES.LIGHT
      || newTheme === THEMES.DARK
      || newTheme === THEMES.CRIMSON_NIGHT
    ) {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
