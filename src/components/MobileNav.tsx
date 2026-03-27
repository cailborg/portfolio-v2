import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MobileNav.css';

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <button className="mobile-nav-trigger" onClick={() => setOpen(true)} aria-label="Open menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <rect x="2" y="5" width="20" height="2.5" rx="1.25"/>
          <rect x="2" y="10.75" width="20" height="2.5" rx="1.25"/>
          <rect x="2" y="16.5" width="20" height="2.5" rx="1.25"/>
        </svg>
      </button>

      <div className={`mobile-nav-overlay${open ? ' open' : ''}`}>
        <button className="mobile-nav-close" onClick={() => setOpen(false)} aria-label="Close menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        <nav className="mobile-nav-items">
          <a onClick={() => { setOpen(false); navigate('/work'); }}>Work</a>
          <a onClick={() => { setOpen(false); navigate('/about'); }}>About</a>
          <a onClick={() => { setOpen(false); navigate('/contact'); }}>Contact</a>
        </nav>
      </div>
    </>
  );
}
