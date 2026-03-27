import type { WaveParams } from './types';
import { hexToVec3 } from '../gl/uniforms';

export const WAVE_UNIFORM_NAMES = [
  'u_time',
  'u_resolution',
  'u_waveFrequency',
  'u_waveAmplitude',
  'u_waveSpeed',
  'u_waveLayers',
  'u_distortion',
  'u_noiseScale',
  'u_colorA',
  'u_colorB',
  'u_colorAccent',
  'u_colorMix',
  'u_grainAmount',
  'u_vignetteStrength',
] as const;

export function setWaveUniforms(
  gl: WebGL2RenderingContext,
  locs: Map<string, WebGLUniformLocation>,
  params: WaveParams,
  time: number,
  resolution: [number, number]
) {
  const f = (name: string, val: number) => {
    const loc = locs.get(name);
    if (loc) gl.uniform1f(loc, val);
  };
  const i = (name: string, val: number) => {
    const loc = locs.get(name);
    if (loc) gl.uniform1i(loc, val);
  };
  const v2 = (name: string, a: number, b: number) => {
    const loc = locs.get(name);
    if (loc) gl.uniform2f(loc, a, b);
  };
  const v3 = (name: string, val: [number, number, number]) => {
    const loc = locs.get(name);
    if (loc) gl.uniform3f(loc, val[0], val[1], val[2]);
  };

  f('u_time', time);
  v2('u_resolution', resolution[0], resolution[1]);
  f('u_waveFrequency', params.waveFrequency);
  f('u_waveAmplitude', params.waveAmplitude);
  f('u_waveSpeed', params.waveSpeed);
  i('u_waveLayers', params.waveLayers);
  f('u_distortion', params.distortion);
  f('u_noiseScale', params.noiseScale);
  v3('u_colorA', hexToVec3(params.colorA));
  v3('u_colorB', hexToVec3(params.colorB));
  v3('u_colorAccent', hexToVec3(params.colorAccent));
  f('u_colorMix', params.colorMix);
  f('u_grainAmount', params.grainAmount);
  f('u_vignetteStrength', params.vignetteStrength);
}
