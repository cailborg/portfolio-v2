import { useEffect, useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShaderCanvas } from '../components/ShaderCanvas';
import { setWaveUniforms, WAVE_UNIFORM_NAMES } from '../wave/uniforms';
import type { WaveParams } from '../wave/types';
import fragmentSrc from '../shaders/wave.frag.glsl?raw';
import './experiments.css';

const WAVE_PARAMS: WaveParams = {
  waveFrequency: 3.1,
  waveAmplitude: 0.89,
  waveSpeed: 0.4,
  waveLayers: 4,
  distortion: 0.05,
  noiseScale: 4.6,
  colorA: '#ffffff',
  colorB: '#ffffff',
  colorAccent: '#f8ddf8',
  colorMix: 0.45,
  grainAmount: 0.02,
  vignetteStrength: 0,
};

// Fisher-Yates shuffle
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Status = 'loading' | 'ready' | 'error';

export default function ExperimentsApp() {
  const [status, setStatus] = useState<Status>('loading');
  const [current, setCurrent] = useState<string | null>(null);
  const [position, setPosition] = useState(0);
  const [total, setTotal] = useState(0);

  const queue = useRef<string[]>([]);
  const indexRef = useRef(0);

  useEffect(() => {
    fetch('/shuffle/manifest.json')
      .then(r => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json() as Promise<string[]>;
      })
      .then(paths => {
        if (paths.length === 0) throw new Error('empty manifest');
        queue.current = shuffleArray(paths);
        indexRef.current = 0;
        setTotal(paths.length);
        setCurrent(queue.current[0]);
        setPosition(1);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  const next = useCallback(() => {
    const q = queue.current;
    if (q.length === 0) return;

    let nextIndex = indexRef.current + 1;
    if (nextIndex >= q.length) {
      // Reshuffle, avoiding showing same image twice in a row
      const last = q[q.length - 1];
      queue.current = shuffleArray(q);
      if (queue.current[0] === last && queue.current.length > 1) {
        [queue.current[0], queue.current[1]] = [queue.current[1], queue.current[0]];
      }
      nextIndex = 0;
    }

    indexRef.current = nextIndex;
    setCurrent(queue.current[nextIndex]);
    setPosition(nextIndex + 1);
  }, []);

  // Keyboard: Space or ArrowRight
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next]);

  return (
    <div className="experiments">
      <div className="experiments__bg">
        <ShaderCanvas
          params={WAVE_PARAMS}
          fragmentSrc={fragmentSrc}
          uniformNames={WAVE_UNIFORM_NAMES}
          setUniforms={setWaveUniforms}
        />
      </div>
      <p className="experiments__intro">Some things are just too dumb, too weird or too one-off to make the portfolio</p>

      {status === 'loading' && (
        <div className="experiments__frame">
          <div className="experiments__skeleton" />
        </div>
      )}

      {status === 'error' && (
        <p className="experiments__error">
          No images found. Run <code>npm run scrape</code> first to download
          images from your Tumblr blog.
        </p>
      )}

      {status === 'ready' && (
        <div className="experiments__frame">
          <AnimatePresence mode="wait">
            {current && (
              <motion.img
                key={current}
                className="experiments__img"
                src={current}
                alt=""
                draggable={false}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.12, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="experiments__controls">
        <div className="experiments__counter">
          {status === 'loading' ? '— / —' : `${position} / ${total}`}
        </div>
        <button className="experiments__btn" onClick={next} disabled={status !== 'ready'}>
          <span className="experiments__btn-shadow" />
          <span className="experiments__btn-edge" />
          <span className="experiments__btn-front">Shuffle</span>
        </button>
      </div>
    </div>
  );
}
