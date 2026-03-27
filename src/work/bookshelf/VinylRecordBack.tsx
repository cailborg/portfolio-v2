import type { VinylProject } from './types';
import { VinylCoverWave } from './VinylCoverWave';

interface Props {
  project: VinylProject;
}

function hexLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

// Average luminance of all hex colours in the gradient string.
// Returns 'light' when white text would fail WCAG AA (contrast < 4.5:1).
function gradientTheme(gradient: string): 'light' | 'dark' {
  const hexes = [...gradient.matchAll(/#[0-9a-fA-F]{6}/g)].map((m) => m[0]);
  if (!hexes.length) return 'dark';
  const avg = hexes.reduce((sum, h) => sum + hexLuminance(h), 0) / hexes.length;
  // White-on-bg contrast = 1.05 / (avg + 0.05). Fails AA when avg > ~0.18.
  return avg > 0.18 ? 'light' : 'dark';
}

export function VinylRecordBack({ project }: Props) {
  const theme = gradientTheme(project.coverGradient);

  return (
    <div
      className="vinyl-record__face vinyl-record__face--back"
      style={{ background: project.coverGradient }}
    >
      <VinylCoverWave params={project.waveParams} opacity={0.55} />
      <div className="vinyl-back__body" data-theme={theme}>
        <span className="vinyl-back__year">{project.year}</span>
        <h3 className="vinyl-back__title">{project.title}</h3>
        <p className="vinyl-back__description">{project.description}</p>
        <div className="vinyl-back__divider" />
        <div className="vinyl-back__tags">
          {project.tags.map((tag) => (
            <span key={tag} className="vinyl-back__tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
