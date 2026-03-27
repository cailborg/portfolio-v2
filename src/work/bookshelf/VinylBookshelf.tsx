import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { projects } from './data';
import { VinylRecord } from './VinylRecord';
import { VinylShelf } from './VinylShelf';
import { VinylOverlay } from './VinylOverlay';
import { VinylTrinket } from './VinylTrinket';
import { VinylTrinketBooks } from './VinylTrinketBooks';
import { ReadingListDrawer } from './ReadingListDrawer';
import type { VinylProject } from './types';

type Slot =
  | { type: 'record'; project: VinylProject }
  | { type: 'plant' }
  | { type: 'books' };

function buildSlots(row: VinylProject[], perShelf: number): Slot[] {
  if (row.length === perShelf) {
    return row.map((project) => ({ type: 'record', project }));
  }
  const empty = perShelf - row.length;
  const leftCount = Math.floor(empty / 2);
  const rightCount = empty - leftCount;
  return [
    ...Array.from({ length: leftCount }, () => ({ type: 'plant' as const })),
    ...row.map((project) => ({ type: 'record' as const, project })),
    ...Array.from({ length: rightCount }, () => ({ type: 'books' as const })),
  ];
}

export function VinylBookshelf({ header, onActiveChange, onSpeakerClick, isPlaying = false, isSpeakerReady = false }: {
  header?: ReactNode;
  onActiveChange?: (active: boolean) => void;
  onSpeakerClick?: () => void;
  isPlaying?: boolean;
  isSpeakerReady?: boolean;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [showReadingList, setShowReadingList] = useState(false);

  useEffect(() => {
    onActiveChange?.(activeId !== null);
  }, [activeId, onActiveChange]);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 600,
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 600px)');
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const recordsPerShelf = isMobile ? 2 : 3;

  const activeIndex = activeId
    ? projects.findIndex((p) => p.id === activeId)
    : -1;

  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    if (flipped) {
      setFlipped(false);
      dismissTimer.current = setTimeout(() => {
        setActiveId(null);
        dismissTimer.current = null;
      }, 350);
    } else {
      setActiveId(null);
    }
  }, [flipped]);

  const select = useCallback((id: string) => {
    setActiveId(id);
    setFlipped(true);
  }, []);

  const flip = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      const idx = activeIndex + dir;
      const wrapped = (idx + projects.length) % projects.length;
      setActiveId(projects[wrapped].id);
      setFlipped(false);
    },
    [activeIndex],
  );

  useEffect(() => {
    if (!activeId && !showReadingList) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showReadingList) setShowReadingList(false);
        else dismiss();
      } else if (activeId) {
        if (e.key === 'ArrowLeft') navigate(-1);
        else if (e.key === 'ArrowRight') navigate(1);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeId, showReadingList, dismiss, navigate]);

  const shelves: typeof projects[] = [];
  for (let i = 0; i < projects.length; i += recordsPerShelf) {
    shelves.push(projects.slice(i, i + recordsPerShelf));
  }

  return (
    <div className="vinyl-container">
      {header}
      <header className="vinyl-header">
        <span className="vinyl-header__title">Selected Works</span>
        <span className="vinyl-header__meta">{projects.length} projects</span>
      </header>

      {shelves.map((row, shelfIdx) => {
        const baseSlots = buildSlots(row, recordsPerShelf);
        const slots: Slot[] = isMobile
          ? baseSlots
          : shelfIdx === 0
            ? [...baseSlots, { type: 'books' }]
            : [{ type: 'plant' }, ...baseSlots];
        return (
          <div key={shelfIdx}>
            <div className="vinyl-shelf-row">
              {slots.map((slot, i) => {
                if (slot.type === 'plant') return <VinylTrinket key={`plant-${i}`} />;
                if (slot.type === 'books') return <VinylTrinketBooks key={`books-${i}`} onOpen={() => setShowReadingList(true)} onSpeakerClick={onSpeakerClick} isPlaying={isPlaying} isSpeakerReady={isSpeakerReady} />;
                if (slot.project.id === activeId) {
                  return (
                    <div
                      key={slot.project.id}
                      style={{ width: isMobile ? 150 : 200, height: isMobile ? 150 : 200, flexShrink: 0 }}
                    />
                  );
                }
                return (
                  <VinylRecord
                    key={slot.project.id}
                    project={slot.project}
                    state="resting"
                    onSelect={() => select(slot.project.id)}
                    onFlip={flip}
                  />
                );
              })}
            </div>
            <VinylShelf />
            <div className="vinyl-label-row">
              {slots.map((slot, i) =>
                slot.type === 'record' ? (
                  <div key={slot.project.id} className="vinyl-label">
                    <span className="vinyl-label__year">{slot.project.year}</span>
                    <span className="vinyl-label__title">{slot.project.title}</span>
                    <span className="vinyl-label__subtitle">{slot.project.subtitle}</span>
                  </div>
                ) : (
                  <div key={`empty-${i}`} className="vinyl-label" />
                )
              )}
            </div>
          </div>
        );
      })}

      {isMobile && (
        <div className="experiments-hint experiments-hint--inline">
          <span className="experiments-hint__label">Experiments</span>
          <svg className="experiments-hint__arrow" width="32" height="44" viewBox="0 0 32 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2 C16 2, 26 10, 24 22 C22 32, 10 34, 14 42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <path d="M10 37 L14 42 L19 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
      )}

      <AnimatePresence>
        {showReadingList && (
          <ReadingListDrawer onDismiss={() => setShowReadingList(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeId && activeIndex >= 0 && (
          <VinylOverlay
            activeIndex={activeIndex}
            total={projects.length}
            links={projects[activeIndex].links}
            onDismiss={dismiss}
            onPrev={() => navigate(-1)}
            onNext={() => navigate(1)}
          >
            <VinylRecord
              key={projects[activeIndex].id}
              project={projects[activeIndex]}
              state={flipped ? 'flipped' : 'selected'}
              onSelect={() => {}}
              onFlip={flip}
            />
          </VinylOverlay>
        )}
      </AnimatePresence>
    </div>
  );
}
