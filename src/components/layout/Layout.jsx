import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Clock } from 'lucide-react';
import AppFooter from './AppFooter';
// import ThemeSwitcher from './ThemeSwitcher';

const Layout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-layout">
      <nav className={`site-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="site-nav-brand">
            <div className="brand-icon">
              <Clock size={28} strokeWidth={2.5} />
            </div>
            <div className="brand-text">
              <span className="brand-main">Last Time Since</span>
              <span className="brand-sub">Track Important Moments</span>
            </div>
          </Link>

          <div className="nav-menu-desktop">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              About
            </NavLink>
            <NavLink to="/privacy" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Privacy
            </NavLink>
            <NavLink to="/terms" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Terms
            </NavLink>
          </div>

          <div className="nav-controls">
            {/* <ThemeSwitcher /> */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/about" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
            About
          </NavLink>
          <NavLink to="/privacy" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
            Privacy
          </NavLink>
          <NavLink to="/terms" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
            Terms
          </NavLink>
        </div>
      </nav>
      <main className="app-main">{children}</main>
      <AppFooter />
    </div>
  );
};

export default Layout;
