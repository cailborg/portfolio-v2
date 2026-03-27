import { useState } from 'react';

const BOOKS = [
  { title: 'hiphop',        color: '#3a1e28', pages: false, thickness: 20, width: 122 },
  { title: null,            color: null,      pages: true,  thickness: 18, width: 116 },
  { title: 'Skateboarding', color: '#1e3822', pages: false, thickness: 24, width: 128 },
];

function Speaker({ onClick, isPlaying, isReady }: { onClick: () => void; isPlaying: boolean; isReady: boolean }) {
  const [hovered, setHovered] = useState(false);
  const showPlaying = isPlaying || hovered;
  return (
    <div
      className={`tbs-speaker-wrapper${showPlaying ? ' tbs-speaker-wrapper--playing' : ''}${!isReady ? ' tbs-speaker-wrapper--loading' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Music I'm listening to"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="tbs-speaker-notes">
        <span className="tbs-note">♪</span>
        <span className="tbs-note">♫</span>
        <span className="tbs-note">♪</span>
      </div>
      <div className="tbs-speaker">
        <div className="tbs-speaker__tweeter" />
        <div className="tbs-speaker__woofer">
          <div className="tbs-speaker__woofer-ring" />
          <div className="tbs-speaker__woofer-cap" />
        </div>
      </div>
    </div>
  );
}

export function VinylTrinketBooks({ onOpen, onSpeakerClick, isPlaying = false, isSpeakerReady = false }: {
  onOpen?: () => void;
  onSpeakerClick?: () => void;
  isPlaying?: boolean;
  isSpeakerReady?: boolean;
}) {
  return (
    <div className="trinket-wrapper">
      <div className="trinket-books-group">
        <Speaker onClick={onSpeakerClick ?? (() => {})} isPlaying={isPlaying} isReady={isSpeakerReady} />
        <div
          className="trinket-books-stack"
          role="button"
          tabIndex={0}
          aria-label="Books I'm reading"
          onClick={() => onOpen?.()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpen?.();
            }
          }}
        >
          {BOOKS.map((book, i) => (
            <div
              key={i}
              className={`tbs-book${book.pages ? ' tbs-book--pages' : ''}`}
              style={{
                height: `${book.thickness}px`,
                width: `${book.width}px`,
                ...(book.color ? { background: book.color } : {}),
              }}
            >
              {book.title && <span className="tbs-book__title">{book.title}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
