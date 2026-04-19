import React from 'react';
import { Sun, Moon, Flame } from 'lucide-react';
import { useTheme, THEMES } from '../../context/ThemeContext';

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
        aria-label="Use light theme"
      >
        <Sun size={20} aria-hidden />
      </button>
      <button
        type="button"
        className={`theme-switcher-btn ${theme === THEMES.DARK ? 'active' : ''}`}
        onClick={() => setTheme(THEMES.DARK)}
        title="Dark theme"
        aria-pressed={theme === THEMES.DARK}
        aria-label="Use dark theme"
      >
        <Moon size={20} aria-hidden />
      </button>
      <button
        type="button"
        className={`theme-switcher-btn ${theme === THEMES.CRIMSON_NIGHT ? 'active' : ''}`}
        onClick={() => setTheme(THEMES.CRIMSON_NIGHT)}
        title="Crimson Night theme"
        aria-pressed={theme === THEMES.CRIMSON_NIGHT}
        aria-label="Use crimson night theme"
      >
        <Flame size={20} aria-hidden />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
