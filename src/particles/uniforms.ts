import type { ParticleParams } from './types';
import { hexToVec3 } from '../gl/uniforms';

export const PARTICLE_UNIFORM_NAMES = [
  'u_time',
  'u_resolution',
  'u_gridDensity',
  'u_particleSize',
  'u_waveBands',
  'u_waveFrequency',
  'u_waveAmplitude',
  'u_waveSpeed',
  'u_scatter',
  'u_densityFalloff',
  'u_brightness',
  'u_color',
  'u_bgColor',
  'u_noiseAmount',
  'u_symmetry',
] as const;

export function setParticleUniforms(
  gl: WebGL2RenderingContext,
  locs: Map<string, WebGLUniformLocation>,
  params: ParticleParams,
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
  f('u_gridDensity', params.gridDensity);
  f('u_particleSize', params.particleSize);
  i('u_waveBands', params.waveBands);
  f('u_waveFrequency', params.waveFrequency);
  f('u_waveAmplitude', params.waveAmplitude);
  f('u_waveSpeed', params.waveSpeed);
  f('u_scatter', params.scatter);
  f('u_densityFalloff', params.densityFalloff);
  f('u_brightness', params.brightness);
  v3('u_color', hexToVec3(params.color));
  v3('u_bgColor', hexToVec3(params.bgColor));
  f('u_noiseAmount', params.noiseAmount);
  f('u_symmetry', params.symmetry);
}
