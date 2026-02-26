import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <nav className="site-footer-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </nav>
        <p className="site-footer-copyright">
          © {currentYear} Last Time Since. Made with <Heart size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> for tracking what matters.
        </p>
      </div>
    </footer>
  );
};

export default AppFooter;
