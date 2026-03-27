import { useControls, folder, button } from 'leva';
import { useCallback, useEffect, useRef } from 'react';
import { ShaderCanvas } from '../components/ShaderCanvas';
import { wavePresets } from './presets';
import { setWaveUniforms, WAVE_UNIFORM_NAMES } from './uniforms';
import type { WaveParams } from './types';
import fragmentSrc from '../shaders/wave.frag.glsl?raw';

const presetNames = Object.keys(wavePresets);

function formatParams(p: WaveParams): string {
  return `{
  waveFrequency: ${p.waveFrequency}, waveAmplitude: ${p.waveAmplitude}, waveSpeed: ${p.waveSpeed}, waveLayers: ${p.waveLayers},
  distortion: ${p.distortion}, noiseScale: ${p.noiseScale},
  colorA: '${p.colorA}', colorB: '${p.colorB}', colorAccent: '${p.colorAccent}',
  colorMix: ${p.colorMix}, grainAmount: ${p.grainAmount}, vignetteStrength: ${p.vignetteStrength},
}`;
}

export default function WaveApp() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setRef = useRef<any>(null);
  const paramsRef = useRef<WaveParams | null>(null);

  const [params, set] = useControls('Wave Shader', () => ({
    Preset: {
      value: 'Ocean',
      options: presetNames,
    },
    Wave: folder({
      waveFrequency: { value: 6, min: 1, max: 20, step: 0.1, label: 'Frequency' },
      waveAmplitude: { value: 0.3, min: 0, max: 1, step: 0.01, label: 'Amplitude' },
      waveSpeed: { value: 1.0, min: 0, max: 5, step: 0.05, label: 'Speed' },
      waveLayers: { value: 4, min: 1, max: 8, step: 1, label: 'Layers' },
    }),
    Noise: folder({
      distortion: { value: 0.15, min: 0, max: 1, step: 0.01, label: 'Distortion' },
      noiseScale: { value: 3.0, min: 0.5, max: 10, step: 0.1, label: 'Noise Scale' },
    }),
    Colors: folder({
      colorA: { value: '#0a0a2e', label: 'Color A' },
      colorB: { value: '#0c2d48', label: 'Color B' },
      colorAccent: { value: '#2196f3', label: 'Accent' },
      colorMix: { value: 0.45, min: 0, max: 1, step: 0.01, label: 'Accent Mix' },
    }),
    'Post-Processing': folder({
      grainAmount: { value: 0.02, min: 0, max: 0.1, step: 0.001, label: 'Grain' },
      vignetteStrength: { value: 0.8, min: 0, max: 2, step: 0.05, label: 'Vignette' },
    }),
    'Copy Params': button(() => {
      if (paramsRef.current) {
        navigator.clipboard.writeText(formatParams(paramsRef.current));
      }
    }),
  }));

  setRef.current = set;

  const shaderParams: WaveParams = {
    waveFrequency: params.waveFrequency as number,
    waveAmplitude: params.waveAmplitude as number,
    waveSpeed: params.waveSpeed as number,
    waveLayers: params.waveLayers as number,
    distortion: params.distortion as number,
    noiseScale: params.noiseScale as number,
    colorA: params.colorA as string,
    colorB: params.colorB as string,
    colorAccent: params.colorAccent as string,
    colorMix: params.colorMix as number,
    grainAmount: params.grainAmount as number,
    vignetteStrength: params.vignetteStrength as number,
  };
  paramsRef.current = shaderParams;

  const prevPreset = useRef(params.Preset);
  const applyPreset = useCallback((name: string) => {
    const p = wavePresets[name];
    if (p && setRef.current) {
      setRef.current(p);
    }
  }, []);

  useEffect(() => {
    if (params.Preset !== prevPreset.current) {
      prevPreset.current = params.Preset as string;
      applyPreset(params.Preset as string);
    }
  }, [params.Preset, applyPreset]);

  return (
    <ShaderCanvas
      params={shaderParams}
      fragmentSrc={fragmentSrc}
      uniformNames={WAVE_UNIFORM_NAMES}
      setUniforms={setWaveUniforms}
    />
  );
}
