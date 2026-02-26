import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import AppFooter from './AppFooter';
import ThemeSwitcher from './ThemeSwitcher';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <nav className="site-nav">
        <Link to="/" className="site-nav-brand">
          Last Time Since
        </Link>
        <div className="site-nav-right">
          <div className="site-nav-links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>About</NavLink>
            <NavLink to="/privacy" className={({ isActive }) => (isActive ? 'active' : '')}>Privacy</NavLink>
            <NavLink to="/terms" className={({ isActive }) => (isActive ? 'active' : '')}>Terms</NavLink>
          </div>
          <ThemeSwitcher />
        </div>
      </nav>
      <main className="app-main">{children}</main>
      <AppFooter />
    </div>
  );
};

export default Layout;
