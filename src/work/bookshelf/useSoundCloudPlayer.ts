import { useRef, useState, useEffect, useCallback } from 'react';

const EMBED_SRC =
  'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/nohze/sets/beats' +
  '&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false';
const API_SCRIPT_SRC = 'https://w.soundcloud.com/player/api.js';

export interface NowPlayingTrack {
  title: string;
  artist: string;
  artworkUrl: string | null;
}

export interface UseSoundCloudPlayerReturn {
  isReady: boolean;
  isPlaying: boolean;
  track: NowPlayingTrack | null;
  start: () => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
}

export function useSoundCloudPlayer(): UseSoundCloudPlayerReturn {
  const widgetRef = useRef<SCWidget | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [track, setTrack] = useState<NowPlayingTrack | null>(null);

  useEffect(() => {
    const iframe = document.createElement('iframe');
    iframe.src = EMBED_SRC;
    iframe.allow = 'autoplay';
    iframe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;border:none;';
    document.body.appendChild(iframe);

    const initWidget = () => {
      const SC = window.SC!;
      const widget = SC.Widget(iframe);
      widgetRef.current = widget;

      widget.bind(SC.Widget.Events.READY, () => {
        setIsReady(true);
      });

      widget.bind(SC.Widget.Events.PLAY, () => {
        setIsPlaying(true);
        widget.getCurrentSound((sound) => {
          setTrack({
            title: sound.title,
            artist: sound.user.username,
            artworkUrl: sound.artwork_url
              ? sound.artwork_url.replace('-large', '-t500x500')
              : null,
          });
        });
      });

      widget.bind(SC.Widget.Events.PAUSE, () => setIsPlaying(false));
      widget.bind(SC.Widget.Events.FINISH, () => setIsPlaying(false));
    };

    if (window.SC) {
      // Script already loaded (e.g. HMR re-mount)
      initWidget();
    } else {
      if (!document.getElementById('sc-api')) {
        const script = document.createElement('script');
        script.id = 'sc-api';
        script.src = API_SCRIPT_SRC;
        script.onload = initWidget;
        document.head.appendChild(script);
      } else {
        // Script tag exists but may still be loading — poll until SC is available
        const poll = setInterval(() => {
          if (window.SC) {
            clearInterval(poll);
            initWidget();
          }
        }, 100);
      }
    }

    return () => {
      widgetRef.current = null;
      setIsReady(false);
      setIsPlaying(false);
      iframe.remove();
    };
  }, []);

  const start = useCallback(() => {
    widgetRef.current?.play();
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      widgetRef.current?.pause();
    } else {
      widgetRef.current?.play();
    }
  }, [isPlaying]);

  const next = useCallback(() => {
    widgetRef.current?.next();
  }, []);

  const prev = useCallback(() => {
    widgetRef.current?.prev();
  }, []);

  return { isReady, isPlaying, track, start, togglePlay, next, prev };
}
