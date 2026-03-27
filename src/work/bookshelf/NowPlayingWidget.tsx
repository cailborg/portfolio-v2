import { motion } from 'framer-motion';
import type { NowPlayingTrack } from './useSoundCloudPlayer';
import './NowPlayingWidget.css';

interface Props {
  isPlaying: boolean;
  track: NowPlayingTrack;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const spring = { type: 'spring' as const, stiffness: 280, damping: 30 };

export function NowPlayingWidget({ isPlaying, track, onTogglePlay, onNext, onPrev }: Props) {
  return (
    <motion.div
      className="np-pill"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={spring}
    >
      {track.artworkUrl ? (
        <img className="np-art" src={track.artworkUrl} alt="" aria-hidden="true" />
      ) : (
        <div className="np-art" />
      )}

      <div className="np-info">
        <span className="np-track" title={track.title}>{track.title}</span>
        <span className="np-artist" title={track.artist}>{track.artist}</span>
      </div>

      <div className="np-controls">
        <button className="np-btn" onClick={onPrev} aria-label="Previous track">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2v8M10 2L5 6l5 4V2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>

        <button className="np-btn np-btn--play" onClick={onTogglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="2" y="2" width="3" height="8" rx="1" fill="currentColor" />
              <rect x="7" y="2" width="3" height="8" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 2l7 4-7 4V2z" fill="currentColor" />
            </svg>
          )}
        </button>

        <button className="np-btn" onClick={onNext} aria-label="Next track">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M10 2v8M2 2l5 4-5 4V2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
