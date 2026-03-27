import { useNavigate, useLocation } from 'react-router-dom';
import './SiteNav.css';

const ITEMS = [
  { label: 'Work',    path: '/work' },
  { label: 'About',   path: '/about' },
  { label: 'Contact', path: '/contact' },
];

interface Props {
  variant?: 'dark' | 'light';
  active?: string;
}

export default function SiteNav({ variant = 'dark', active }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className={`site-nav site-nav--${variant}`}>
      {ITEMS.map((item, i) => {
        const isActive = active ? active === item.path : pathname === item.path;
        return (
          <span key={item.path} className="site-nav__item-wrap">
            {i > 0 && <span className="site-nav__sep" />}
            <a
              className={`site-nav__item${isActive ? ' active' : ''}`}
              onClick={() => !isActive && navigate(item.path)}
            >
              {item.label}
            </a>
          </span>
        );
      })}
    </nav>
  );
}
