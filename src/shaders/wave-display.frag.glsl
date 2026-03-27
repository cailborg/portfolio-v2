// Water ripple display pass
// Uses pre-computed gradients from simulation for UV displacement + specular + grain

uniform sampler2D simTexture;  // ping-pong result: vec4(pressure, pVel, dx, dy)
uniform sampler2D bgTexture;   // background to distort
uniform float strength;
uniform float time;
uniform vec2 mouseUV;          // smoothed mouse in [0,1] UV space; (-9,-9) when inactive

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec4 data = texture2D(simTexture, vUv);

  // X-axis rotation only: mouse Y drives forward/backward tilt, no left-right
  vec2 pivot = (mouseUV.x > -2.0) ? mouseUV : vec2(0.5);
  float rotX = (pivot.y - 0.5) * 0.02;
  vec2 bgUV = vec2(
    vUv.x + rotX * (vUv.y - 0.5) * 1.5,
    vUv.y
  );

  // Displacement grows with distance from mouse — cone opening outward
  float distFromMouse = length(vUv - mouseUV);
  float cone = clamp(distFromMouse * 2.5, 0.0, 3.5);
  vec2 offset = data.zw * strength * cone;
  gl_FragColor = texture2D(bgTexture, clamp(bgUV + offset, 0.0, 1.0));

  // Animated film grain (applied before specular so highlights stay clean)
  float grain = (hash(vUv + fract(time * 0.071)) - 0.5) * 0.09;
  gl_FragColor.rgb += grain;

}
