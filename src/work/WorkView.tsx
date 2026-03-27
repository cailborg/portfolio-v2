import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import BookshelfApp from './bookshelf/BookshelfApp';
import ExperimentsApp from '../experiments/ExperimentsApp';
import './WorkView.css';

const PEEK_PX = 35;
const THRESHOLD = 120;

export default function WorkView() {
  const [expanded, setExpanded] = useState(false);
  const [peeking, setPeeking] = useState(false);
  const [peekingBack, setPeekingBack] = useState(false);
  const [projectActive, setProjectActive] = useState(false);
  const hintHovered = useRef(false);

  // Bottom-of-screen peek (bookshelf → experiments)
  useEffect(() => {
    if (expanded || projectActive) { setPeeking(false); return; }
    const onMove = (e: MouseEvent) => {
      if (!hintHovered.current) setPeeking(e.clientY > window.innerHeight - THRESHOLD);
    };
    const onLeave = () => setPeeking(false);
    window.addEventListener('mousemove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [expanded, projectActive]);

  // Top-of-screen peek (experiments → bookshelf)
  useEffect(() => {
    if (!expanded) { setPeekingBack(false); return; }
    const onMove = (e: MouseEvent) => setPeekingBack(e.clientY < THRESHOLD);
    const onLeave = () => setPeekingBack(false);
    window.addEventListener('mousemove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [expanded]);

  const panelY = expanded
    ? peekingBack ? `calc(-100% + ${PEEK_PX}px)` : '-100%'
    : peeking ? -PEEK_PX : 0;

  return (
    <div className="work-view">

      {/* Experiments layer */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <ExperimentsApp />
        {/* Capture clicks on revealed strip to expand */}
        {peeking && !expanded && (
          <div
            style={{ position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 10 }}
            onClick={() => setExpanded(true)}
          />
        )}
        {/* Work affordance hint — visible when experiments is revealed */}
        <div className={`work-hint${expanded ? ' visible' : ''}`}>
          <svg className="work-hint__arrow" width="32" height="44" viewBox="0 0 32 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 42 C16 42, 26 34, 24 22 C22 12, 10 10, 14 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <path d="M10 7 L14 2 L19 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <span className="work-hint__label">Work</span>
        </div>
      </div>

      {/* Bookshelf panel */}
      <motion.div
        className="work-vinyl-panel"
        animate={{ y: panelY }}
        transition={{ type: 'spring', stiffness: 280, damping: 36 }}
      >
        {/* Capture clicks on peeked bookshelf strip to collapse */}
        {peekingBack && expanded && (
          <div
            style={{ position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 10 }}
            onClick={() => { setExpanded(false); setPeekingBack(false); }}
          />
        )}

        <BookshelfApp onActiveChange={setProjectActive} />

        {!projectActive && (
          <div
            className="experiments-hint"
            onMouseEnter={() => { hintHovered.current = true; setPeeking(true); }}
            onMouseLeave={() => { hintHovered.current = false; setPeeking(false); }}
            onClick={() => setExpanded(true)}
          >
            <span className="experiments-hint__label">Experiments</span>
            <svg className="experiments-hint__arrow" width="32" height="44" viewBox="0 0 32 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2 C16 2, 26 10, 24 22 C22 32, 10 34, 14 42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M10 37 L14 42 L19 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
        )}
      </motion.div>

    </div>
  );
}
