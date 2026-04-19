import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Clock3, Heart } from 'lucide-react';
import AppFooter from './AppFooter';
import ThemeSwitcher from './ThemeSwitcher';

const Layout = ({ children }) => {
  const navLinkClass = ({ isActive }) => (isActive ? 'site-nav-link active' : 'site-nav-link');

  return (
    <div className="app-layout">
      <nav className="site-nav site-nav--sticky">
        <Link to="/" className="site-nav-brand" aria-label="Last Time Since home">
          <span className="site-nav-brand__mark" aria-hidden>
            <Heart className="site-nav-brand__mark-heart" size={13} strokeWidth={2.4} />
            <Clock3 className="site-nav-brand__mark-clock" size={13} strokeWidth={2.2} />
          </span>
          <span className="site-nav-brand__copy">
            <span className="site-nav-brand__name">
              LAST <em>TIME</em> SINCE
            </span>
            <span className="site-nav-brand__tag">for the hearts that still remember</span>
          </span>
        </Link>
        <div className="site-nav-right">
          <div className="site-nav-links">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            <NavLink to="/privacy" className={navLinkClass}>Privacy</NavLink>
            <NavLink to="/terms" className={navLinkClass}>Terms</NavLink>
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
