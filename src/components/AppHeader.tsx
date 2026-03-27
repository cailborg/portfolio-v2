import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import SiteNav from './SiteNav';
import MobileNav from './MobileNav';
import './AppHeader.css';

interface Props {
  variant: 'dark' | 'light';
  className?: string;
  navSlot?: ReactNode;
}

export default function AppHeader({ variant, className, navSlot }: Props) {
  const navigate = useNavigate();
  const logoColor = variant === 'dark' ? 'var(--color-brown)' : 'var(--color-sand)';

  return (
    <header className={`app-header${className ? ` ${className}` : ''}`}>
      <Logo className="app-logo" style={{ color: logoColor, cursor: 'pointer' }} onClick={() => navigate('/')} />
      <div className="app-header__right">
        {navSlot}
        <span className="desktop-only-nav"><SiteNav variant={variant} /></span>
        <MobileNav />
      </div>
    </header>
  );
}
