import { useEffect, useRef } from 'react';
import { createProgram } from '../gl/createProgram';
import { createFullscreenQuad } from '../gl/fullscreenQuad';
import { cacheUniformLocations } from '../gl/uniforms';
import vertexSrc from '../shaders/fullscreen.vert.glsl?raw';

interface ShaderCanvasProps<P> {
  params: P;
  fragmentSrc: string;
  uniformNames: readonly string[];
  setUniforms: (
    gl: WebGL2RenderingContext,
    locs: Map<string, WebGLUniformLocation>,
    params: P,
    time: number,
    resolution: [number, number]
  ) => void;
}

export function ShaderCanvas<P>({
  params,
  fragmentSrc,
  uniformNames,
  setUniforms,
}: ShaderCanvasProps<P>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext('webgl2', { antialias: false });
    if (!gl) {
      console.error('WebGL2 not supported');
      return;
    }

    let program: WebGLProgram;
    try {
      program = createProgram(gl, vertexSrc, fragmentSrc);
    } catch (e) {
      console.error(e);
      return;
    }

    const vao = createFullscreenQuad(gl);
    gl.useProgram(program);
    const locs = cacheUniformLocations(gl, program, [...uniformNames]);

    let rafId: number;
    const startTime = performance.now();

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    function render() {
      resize();
      gl!.viewport(0, 0, canvas.width, canvas.height);

      const time = (performance.now() - startTime) / 1000;
      setUniforms(gl!, locs, paramsRef.current, time, [canvas.width, canvas.height]);

      gl!.bindVertexArray(vao);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);

      rafId = requestAnimationFrame(render);
    }

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      gl.deleteProgram(program);
    };
  }, [fragmentSrc, uniformNames, setUniforms]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
