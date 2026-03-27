uniform sampler2D trailMap;
uniform float strength;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // Compute gradient of the trail brightness in both axes.
  // The edges of each stamped circle have high gradient → maximum lens distortion.
  // The flat center has near-zero gradient → minimal displacement.
  // This creates natural concentric ring / water-surface refraction.
  float e = 0.003;
  float dx = texture2D(trailMap, uv + vec2(e, 0.0)).r
           - texture2D(trailMap, uv - vec2(e, 0.0)).r;
  float dy = texture2D(trailMap, uv + vec2(0.0, e)).r
           - texture2D(trailMap, uv - vec2(0.0, e)).r;

  vec2 displaced = clamp(uv + vec2(dx, dy) * strength, 0.0, 1.0);
  outputColor = texture2D(inputBuffer, displaced);
}
