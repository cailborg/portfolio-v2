export function hexToVec3(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

export function cacheUniformLocations(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  names: string[]
): Map<string, WebGLUniformLocation> {
  const map = new Map<string, WebGLUniformLocation>();
  for (const name of names) {
    const loc = gl.getUniformLocation(program, name);
    if (loc !== null) map.set(name, loc);
  }
  return map;
}
