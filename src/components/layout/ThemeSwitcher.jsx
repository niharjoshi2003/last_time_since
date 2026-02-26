import React from 'react';
import { Sun, Moon, Heart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { THEMES } from '../../context/ThemeContext';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-switcher" role="group" aria-label="Theme">
      <button
        type="button"
        className={`theme-switcher-btn ${theme === THEMES.LIGHT ? 'active' : ''}`}
        onClick={() => setTheme(THEMES.LIGHT)}
        title="Light theme"
        aria-pressed={theme === THEMES.LIGHT}
      >
        <Sun size={18} aria-hidden />
      </button>
      <button
        type="button"
        className={`theme-switcher-btn ${theme === THEMES.DARK ? 'active' : ''}`}
        onClick={() => setTheme(THEMES.DARK)}
        title="Dark theme"
        aria-pressed={theme === THEMES.DARK}
      >
        <Moon size={18} aria-hidden />
      </button>
      <button
        type="button"
        className={`theme-switcher-btn ${theme === THEMES.ULTRA_LOVE ? 'active' : ''}`}
        onClick={() => setTheme(THEMES.ULTRA_LOVE)}
        title="Ultra Love theme"
        aria-pressed={theme === THEMES.ULTRA_LOVE}
      >
        <Heart size={18} aria-hidden />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
