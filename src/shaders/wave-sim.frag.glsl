// Physics-based water ripple simulation (Shadertoy wdtyDH - Buffer A)
// Stores: vec4(pressure, pVelocity, x_gradient, y_gradient)

uniform sampler2D prevFrame;
uniform vec2 resolution;
uniform vec2 mouse; // pixel coords, (-9999,-9999) when inactive
uniform float mouseRadius;
uniform float mouseStrength;
uniform float velDamping;
uniform float presDamping;

const float delta = 1.0;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  float pressure = texture2D(prevFrame, uv).x;
  float pVel     = texture2D(prevFrame, uv).y;

  // Clamped neighbours = reflecting boundary
  vec2 r = vec2(min(gl_FragCoord.x + 1.0, resolution.x - 1.0), gl_FragCoord.y) / resolution;
  vec2 l = vec2(max(gl_FragCoord.x - 1.0, 0.0),                gl_FragCoord.y) / resolution;
  vec2 u = vec2(gl_FragCoord.x, min(gl_FragCoord.y + 1.0, resolution.y - 1.0)) / resolution;
  vec2 d = vec2(gl_FragCoord.x, max(gl_FragCoord.y - 1.0, 0.0))                / resolution;

  float p_right = texture2D(prevFrame, r).x;
  float p_left  = texture2D(prevFrame, l).x;
  float p_up    = texture2D(prevFrame, u).x;
  float p_down  = texture2D(prevFrame, d).x;

  pVel += delta * (-2.0 * pressure + p_right + p_left) / 4.0;
  pVel += delta * (-2.0 * pressure + p_up    + p_down) / 4.0;
  pressure += delta * pVel;
  pVel     -= 0.005 * delta * pressure; // spring restoring force
  pVel     *= 1.0 - velDamping * delta;
  pressure *= presDamping;

  // Gaussian pressure input — smooth falloff creates big low-frequency waves
  if (mouse.x > -100.0) {
    float dist = length(gl_FragCoord.xy - mouse);
    float influence = exp(-dist * dist / (mouseRadius * mouseRadius));
    pressure += influence * mouseStrength;
  }

  // Store gradients in ZW — used directly in display pass
  gl_FragColor = vec4(pressure, pVel, (p_right - p_left) / 2.0, (p_up - p_down) / 2.0);
}
