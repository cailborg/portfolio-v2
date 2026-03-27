import { AnimatePresence } from 'framer-motion';
import { VinylBookshelf } from './VinylBookshelf';
import AppHeader from '../../components/AppHeader';
import { useSoundCloudPlayer } from './useSoundCloudPlayer';
import { NowPlayingWidget } from './NowPlayingWidget';
import './vinyl.css';

export default function BookshelfApp({ onActiveChange }: { onActiveChange?: (active: boolean) => void }) {
  const { isReady, isPlaying, track, togglePlay, next, prev } = useSoundCloudPlayer();

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <VinylBookshelf
        header={
          <AppHeader
            variant="light"
            className="vinyl-page-header"
            navSlot={
              <AnimatePresence>
                {track && (
                  <NowPlayingWidget
                    isPlaying={isPlaying}
                    track={track}
                    onTogglePlay={togglePlay}
                    onNext={next}
                    onPrev={prev}
                  />
                )}
              </AnimatePresence>
            }
          />
        }
        onActiveChange={onActiveChange}
        onSpeakerClick={togglePlay}
        isPlaying={isPlaying}
        isSpeakerReady={isReady}
      />
    </div>
  );
}
