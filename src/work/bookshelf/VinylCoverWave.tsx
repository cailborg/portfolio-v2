import { ShaderCanvas } from '../../components/ShaderCanvas';
import { setWaveUniforms, WAVE_UNIFORM_NAMES } from '../../wave/uniforms';
import type { WaveParams } from '../../wave/types';
import fragmentSrc from '../../shaders/wave.frag.glsl?raw';

interface Props {
  params: WaveParams;
  opacity?: number;
}

export function VinylCoverWave({ params, opacity = 0.75 }: Props) {
  return (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      <ShaderCanvas
        params={params}
        fragmentSrc={fragmentSrc}
        uniformNames={WAVE_UNIFORM_NAMES}
        setUniforms={setWaveUniforms}
      />
    </div>
  );
}
