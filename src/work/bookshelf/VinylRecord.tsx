import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import type { VinylProject, RecordState } from './types';
import { VinylRecordBack } from './VinylRecordBack';

interface Props {
  project: VinylProject;
  state: RecordState;
  onSelect: () => void;
  onFlip: () => void;
}

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 };
const springSnappy = { type: 'spring' as const, stiffness: 160, damping: 22 };
const tiltSpring = { stiffness: 120, damping: 22 };

const shelfVariants = {
  resting: { translateY: 0,   scale: 1,    opacity: 1, transition: spring },
  hovered: { translateY: -16, scale: 1.03, opacity: 1, transition: springSnappy },
  initial: { translateY: 20,  scale: 0.97, opacity: 0 },
};


export function VinylRecord({ project, state, onSelect, onFlip }: Props) {
  const isActive = state === 'selected' || state === 'flipped';
  const flipCardRef = useRef<HTMLDivElement>(null);

  // Focus the card after it opens — delayed so the Space keyup from the
  // opening press has already fired before this element receives focus,
  // preventing any synthetic click from triggering an immediate flip.
  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => flipCardRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [isActive]);

  // Tilt motion values (always created per hook rules)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltY = useSpring(mouseX, tiltSpring);
  const tiltX = useSpring(mouseY, tiltSpring);

  // Sheen follows mouse instantly (no spring) — light moves crisply while card tilts with inertia
  // mouseX: -10..10, mouseY: -8..8 → invert so highlight moves opposite to tilt direction
  const sheenX = useTransform(mouseX, [-10, 10], [72, 28]);
  const sheenY = useTransform(mouseY, [-8,  8],  [72, 28]);
  const sheenBg = useMotionTemplate`radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 44%, transparent 68%)`;

  // Global pointer tracking for the selected overlay record
  useEffect(() => {
    if (!isActive) {
      mouseX.set(0);
      mouseY.set(0);
      return;
    }

    const onMove = (e: PointerEvent) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      mouseX.set(((e.clientX - cx) / (window.innerWidth  / 2)) * 10);
      mouseY.set(((e.clientY - cy) / (window.innerHeight / 2)) * -8);
    };

    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      mouseX.set(0);
      mouseY.set(0);
    };
  }, [isActive, mouseX, mouseY]);

  const handleClick = () => {
    if (state === 'resting' || state === 'hovered') {
      onSelect();
    } else {
      onFlip();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Track mouse within shelf card — drives sheen CSS vars and subtle tilt
  const handleShelfMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    e.currentTarget.style.setProperty('--sheen-x', `${x}%`);
    e.currentTarget.style.setProperty('--sheen-y', `${y}%`);
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    mouseX.set(((e.clientX - cx) / (rect.width  / 2)) * 7);
    mouseY.set(((e.clientY - cy) / (rect.height / 2)) * -5);
  };
  const handleShelfMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--sheen-x', '150%');
    e.currentTarget.style.setProperty('--sheen-y', '150%');
    mouseX.set(0);
    mouseY.set(0);
  };

  const CoverFront = ({ selected = false }: { selected?: boolean }) => (
    <div className="vinyl-record__face vinyl-record__face--front">
      <div className="vinyl-record__cover">
        {project.coverImage && (
          <img
            className="vinyl-record__cover-photo"
            src={project.coverImage}
            alt=""
            aria-hidden="true"
          />
        )}
        {/* Sheen overlay — driven by Framer Motion values when selected, CSS vars on shelf */}
        {selected ? (
          <motion.div className="vinyl-record__sheen" style={{ background: sheenBg }} />
        ) : (
          <div className="vinyl-record__sheen" />
        )}
        <div className="vinyl-record__cover-inner">
          <div className="vinyl-record__cover-art" />
        </div>
      </div>
      {!selected && (
        <div className="vinyl-record__spine" style={{ background: project.spineColor }} />
      )}
    </div>
  );

  // Detect first overlay mount to delay the flip until the fly-in completes
  const isFirstMount = useRef(true);
  useEffect(() => {
    isFirstMount.current = false;
  }, []);

  // ── Selected / Flipped (overlay) ──────────────────────────────────────────
  if (isActive) {
    const flipDelay = isFirstMount.current ? 0.38 : 0;
    return (
      <div style={{ perspective: '900px' }}>
      <motion.div
        layoutId={project.id}
        className="vinyl-record vinyl-record--selected"
      >
        <motion.div
          style={{
            rotateX: tiltX,
            rotateY: tiltY,
            transformStyle: 'preserve-3d',
            position: 'absolute',
            inset: 0,
          }}
        >
          <motion.div
            ref={flipCardRef}
            style={{ transformStyle: 'preserve-3d', position: 'absolute', inset: 0 }}
            animate={{ rotateY: state === 'flipped' ? 180 : 0 }}
            transition={{ ...spring, delay: flipDelay }}
            tabIndex={0}
            role="button"
            aria-label={`${project.title} — press Space to flip, Escape to close`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
          >
            <CoverFront selected />
            <VinylRecordBack project={project} />
            <div className="vinyl-record__disc" />
          </motion.div>
        </motion.div>
      </motion.div>
      </div>
    );
  }

  // ── Resting on shelf ──────────────────────────────────────────────────────
  return (
    <div style={{ perspective: '600px', flexShrink: 0, zIndex: 1 }}>
      <motion.div
        layoutId={project.id}
        className="vinyl-record"
        variants={shelfVariants}
        initial={false}
        animate="resting"
        whileHover="hovered"
        whileFocus="hovered"
        style={{ rotateX: tiltX, rotateY: tiltY }}
        tabIndex={0}
        role="button"
        aria-label={`${project.title} — press Enter to open`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseMove={handleShelfMouseMove}
        onMouseLeave={handleShelfMouseLeave}
      >
        <CoverFront />
        <div className="vinyl-record__disc" />
      </motion.div>
    </div>
  );
}
