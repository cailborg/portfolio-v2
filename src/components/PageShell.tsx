import AppHeader from './AppHeader';
import '../pages/page.css';

interface Props {
  eyebrow: string;
  title: string;
}

export default function PageShell({ eyebrow, title }: Props) {
  return (
    <div className="page">
      <AppHeader variant="dark" />
      <div className="page-content">
        <p className="page-eyebrow">{eyebrow}</p>
        <h1 className="page-heading">{title}</h1>
      </div>
    </div>
  );
}
