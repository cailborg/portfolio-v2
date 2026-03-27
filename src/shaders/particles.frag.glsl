#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2  u_resolution;
uniform float u_gridDensity;
uniform float u_particleSize;
uniform int   u_waveBands;
uniform float u_waveFrequency;
uniform float u_waveAmplitude;
uniform float u_waveSpeed;
uniform float u_scatter;
uniform float u_densityFalloff;
uniform float u_brightness;
uniform vec3  u_color;
uniform vec3  u_bgColor;
uniform float u_noiseAmount;
uniform float u_symmetry;

// --- Hash functions for pseudo-random particle placement ---
float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

vec2 hash22(vec2 p) {
    float n = hash21(p);
    return vec2(n, hash21(p + n * 100.0));
}

// --- Simplex noise for organic displacement ---
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 10.0) * x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

// --- Wave displacement for a given x position and band index ---
float waveDisplacement(float x, float bandIndex, float time) {
    float displacement = 0.0;
    // Layer multiple sine waves for organic curves
    displacement += sin(x * u_waveFrequency + time * u_waveSpeed + bandIndex * 1.5) * u_waveAmplitude;
    displacement += sin(x * u_waveFrequency * 2.3 + time * u_waveSpeed * 0.7 + bandIndex * 2.8) * u_waveAmplitude * 0.4;
    displacement += sin(x * u_waveFrequency * 0.5 + time * u_waveSpeed * 1.3 + bandIndex * 0.7) * u_waveAmplitude * 0.6;
    return displacement;
}

void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;

    // Aspect-corrected coordinates centered at origin
    vec2 st = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

    float totalBrightness = 0.0;
    float cellSize = 1.0 / u_gridDensity;

    // Grid coordinates for this fragment
    vec2 gridPos = st / cellSize;
    vec2 baseCell = floor(gridPos);

    float time = u_time;
    float numBands = float(u_waveBands);

    // Search 5×5 neighborhood for nearby particles
    for (int dx = -2; dx <= 2; dx++) {
        for (int dy = -2; dy <= 2; dy++) {
            vec2 cellIndex = baseCell + vec2(float(dx), float(dy));

            // Random position offset within cell
            vec2 randOffset = hash22(cellIndex);
            vec2 particleGridPos = cellIndex + randOffset;
            vec2 particlePos = particleGridPos * cellSize;

            // Determine which wave band this particle belongs to
            // Map particle's base y-position to a band
            float baseY = particlePos.y + 0.5; // 0..1 range
            float bandSpacing = 1.0 / (numBands + 1.0);

            // Find closest band
            float closestBandDist = 1.0;
            float bestBandY = 0.0;
            float bestBandIndex = 0.0;

            for (int b = 0; b < 8; b++) {
                if (b >= u_waveBands) break;
                float bandY = bandSpacing * (float(b) + 1.0) - 0.5;
                float d = abs(particlePos.y - bandY);
                if (d < closestBandDist) {
                    closestBandDist = d;
                    bestBandY = bandY;
                    bestBandIndex = float(b);
                }
            }

            // Wave displacement for this particle's x-position
            float waveY = waveDisplacement(particlePos.x, bestBandIndex, time);

            // Noise displacement for organic scatter
            float noiseX = snoise(vec2(particlePos.x * 3.0 + time * 0.2, bestBandIndex * 7.0)) * u_noiseAmount;
            float noiseY = snoise(vec2(particlePos.x * 5.0 + time * 0.15 + 100.0, bestBandIndex * 13.0)) * u_noiseAmount;

            // Random scatter perpendicular to wave
            float scatterY = (hash21(cellIndex + 999.0) - 0.5) * u_scatter;

            // Final particle position
            vec2 finalPos = vec2(
                particlePos.x + noiseX,
                bestBandY + waveY + scatterY + noiseY
            );

            // Apply symmetry: blend original with vertically mirrored position
            if (u_symmetry > 0.0) {
                vec2 mirrorPos = vec2(finalPos.x, -finalPos.y);
                // Each particle renders at both positions when symmetry > 0
                float distOrig = length(st - finalPos);
                float distMirror = length(st - mirrorPos);

                // Density: particles closer to their band center are brighter
                float density = exp(-closestBandDist * closestBandDist * u_densityFalloff * u_densityFalloff);

                // Dot brightness (Gaussian falloff)
                float dotSize = cellSize * u_particleSize;
                float brightOrig = density * exp(-distOrig * distOrig / (dotSize * dotSize));
                float brightMirror = density * exp(-distMirror * distMirror / (dotSize * dotSize));

                totalBrightness += brightOrig + brightMirror * u_symmetry;
            } else {
                float dist = length(st - finalPos);
                float density = exp(-closestBandDist * closestBandDist * u_densityFalloff * u_densityFalloff);
                float dotSize = cellSize * u_particleSize;
                totalBrightness += density * exp(-dist * dist / (dotSize * dotSize));
            }
        }
    }

    totalBrightness *= u_brightness;
    totalBrightness = clamp(totalBrightness, 0.0, 1.0);

    vec3 color = mix(u_bgColor, u_color, totalBrightness);
    fragColor = vec4(color, 1.0);
}
