/// <reference types="vite/client" />

interface Window {
  SC?: {
    Widget: SCWidgetConstructor & { Events: SCWidgetEvents };
  };
}

interface SCWidgetConstructor {
  (iframe: HTMLIFrameElement): SCWidget;
}

interface SCWidgetEvents {
  READY: string;
  PLAY: string;
  PAUSE: string;
  FINISH: string;
  PLAY_PROGRESS: string;
}

interface SCWidget {
  bind(eventName: string, callback: () => void): void;
  unbind(eventName: string): void;
  play(): void;
  pause(): void;
  next(): void;
  prev(): void;
  getCurrentSound(callback: (sound: SCSound) => void): void;
}

interface SCSound {
  title: string;
  artwork_url: string | null;
  user: { username: string };
}
