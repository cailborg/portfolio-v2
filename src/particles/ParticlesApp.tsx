import { useControls, folder } from 'leva';
import { useCallback, useEffect, useRef } from 'react';
import { ShaderCanvas } from '../components/ShaderCanvas';
import { particlePresets } from './presets';
import { setParticleUniforms, PARTICLE_UNIFORM_NAMES } from './uniforms';
import type { ParticleParams } from './types';
import fragmentSrc from '../shaders/particles.frag.glsl?raw';

const presetNames = Object.keys(particlePresets);

export default function ParticlesApp() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setRef = useRef<any>(null);

  const [params, set] = useControls('Particle Field', () => ({
    Preset: {
      value: 'Silk',
      options: presetNames,
    },
    Particles: folder({
      gridDensity: { value: 200, min: 50, max: 500, step: 10, label: 'Density' },
      particleSize: { value: 1.2, min: 0.1, max: 5, step: 0.1, label: 'Size' },
      brightness: { value: 1.5, min: 0.1, max: 3, step: 0.05, label: 'Brightness' },
    }),
    Waves: folder({
      waveBands: { value: 5, min: 1, max: 8, step: 1, label: 'Bands' },
      waveFrequency: { value: 4.0, min: 1, max: 15, step: 0.1, label: 'Frequency' },
      waveAmplitude: { value: 0.2, min: 0.05, max: 0.5, step: 0.01, label: 'Amplitude' },
      waveSpeed: { value: 0.5, min: 0, max: 3, step: 0.05, label: 'Speed' },
    }),
    Scatter: folder({
      scatter: { value: 0.15, min: 0, max: 0.5, step: 0.01, label: 'Scatter' },
      noiseAmount: { value: 0.1, min: 0, max: 0.5, step: 0.01, label: 'Noise' },
      densityFalloff: { value: 8.0, min: 1, max: 20, step: 0.5, label: 'Falloff' },
    }),
    Style: folder({
      color: { value: '#ffffff', label: 'Color' },
      bgColor: { value: '#000000', label: 'Background' },
      symmetry: { value: 0.8, min: 0, max: 1, step: 0.05, label: 'Symmetry' },
    }),
  }));

  setRef.current = set;

  const shaderParams: ParticleParams = {
    gridDensity: params.gridDensity as number,
    particleSize: params.particleSize as number,
    waveBands: params.waveBands as number,
    waveFrequency: params.waveFrequency as number,
    waveAmplitude: params.waveAmplitude as number,
    waveSpeed: params.waveSpeed as number,
    scatter: params.scatter as number,
    densityFalloff: params.densityFalloff as number,
    brightness: params.brightness as number,
    color: params.color as string,
    bgColor: params.bgColor as string,
    noiseAmount: params.noiseAmount as number,
    symmetry: params.symmetry as number,
  };

  const prevPreset = useRef(params.Preset);
  const applyPreset = useCallback((name: string) => {
    const p = particlePresets[name];
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
      uniformNames={PARTICLE_UNIFORM_NAMES}
      setUniforms={setParticleUniforms}
    />
  );
}
