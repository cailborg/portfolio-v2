import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Props {
  activeIndex: number;
  total: number;
  links: { label: string; url: string }[];
  onDismiss: () => void;
  onPrev: () => void;
  onNext: () => void;
  children: React.ReactNode;
}

export function VinylOverlay({
  activeIndex,
  total,
  links,
  onDismiss,
  onPrev,
  onNext,
  children,
}: Props) {
  const primaryLink = links[0];
  const isInternal = primaryLink?.url.startsWith('/');

  return (
    <motion.div
      className="vinyl-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onDismiss}
    >
      <button
        className="vinyl-overlay__close"
        onClick={(e) => { e.stopPropagation(); onDismiss(); }}
        aria-label="Close"
      >
        ×
      </button>

      <div className="vinyl-overlay__content" onClick={(e) => e.stopPropagation()}>
        {children}
        {primaryLink && (
          isInternal ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              <Link className="vinyl-overlay__cta" to={primaryLink.url}>
                <span className="vinyl-overlay__cta-shadow" />
                <span className="vinyl-overlay__cta-edge" />
                <span className="vinyl-overlay__cta-front">
                  {primaryLink.label}
                  <span className="vinyl-overlay__cta-arrow">→</span>
                </span>
              </Link>
            </motion.div>
          ) : (
            <motion.a
              className="vinyl-overlay__cta"
              href={primaryLink.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              <span className="vinyl-overlay__cta-shadow" />
              <span className="vinyl-overlay__cta-edge" />
              <span className="vinyl-overlay__cta-front">
                {primaryLink.label}
                <span className="vinyl-overlay__cta-arrow">→</span>
              </span>
            </motion.a>
          )
        )}
      </div>

      <div className="vinyl-overlay__hint">
        Space to flip &middot; Escape to close &middot; Arrows to navigate
      </div>

      <div className="vinyl-overlay__nav" onClick={(e) => e.stopPropagation()}>
        <button
          className="vinyl-overlay__nav-btn"
          onClick={onPrev}
          aria-label="Previous record"
        >
          &#8249;
        </button>
        <span className="vinyl-overlay__counter">
          {activeIndex + 1} / {total}
        </span>
        <button
          className="vinyl-overlay__nav-btn"
          onClick={onNext}
          aria-label="Next record"
        >
          &#8250;
        </button>
      </div>
    </motion.div>
  );
}
