#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2  u_resolution;
uniform float u_waveFrequency;
uniform float u_waveAmplitude;
uniform float u_waveSpeed;
uniform int   u_waveLayers;
uniform float u_distortion;
uniform float u_noiseScale;
uniform vec3  u_colorA;
uniform vec3  u_colorB;
uniform vec3  u_colorAccent;
uniform float u_colorMix;
uniform float u_grainAmount;
uniform float u_vignetteStrength;

// --- Simplex 2D noise (Ashima Arts / Ian McEwan) ---
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 10.0) * x); }

float snoise(vec2 v) {
    const vec4 C = vec4(
        0.211324865405187,   // (3.0-sqrt(3.0))/6.0
        0.366025403784439,   // 0.5*(sqrt(3.0)-1.0)
       -0.577350269189626,   // -1.0 + 2.0 * C.x
        0.024390243902439    // 1.0 / 41.0
    );

    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;

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

// --- FBM (Fractal Brownian Motion) for richer noise ---
float fbm(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 6; i++) {
        if (i >= octaves) break;
        value += amplitude * snoise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

// --- Hash for grain ---
float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

void main() {
    // Aspect-corrected UV
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 st = vec2(uv.x * aspect, uv.y);

    // Noise-based distortion (scaled by waveSpeed so speed=0 freezes everything)
    float t = u_time * u_waveSpeed * 0.15;
    vec2 distortedSt = st + u_distortion * vec2(
        snoise(st * u_noiseScale + t),
        snoise(st * u_noiseScale + t + 100.0)
    );

    // Layered waves
    float waveValue = 0.0;
    for (int i = 0; i < 8; i++) {
        if (i >= u_waveLayers) break;

        float fi = float(i);
        float layerFreq = u_waveFrequency * (1.0 + fi * 0.7);
        float layerAmp = u_waveAmplitude / (1.0 + fi * 0.5);
        float phase = fi * 1.2566; // ~2PI/5 offset per layer

        // Each layer has a slightly different direction
        float angle = fi * 0.5236; // ~PI/6 rotation per layer
        vec2 dir = vec2(cos(angle), sin(angle));

        waveValue += layerAmp * sin(
            dot(distortedSt, dir) * layerFreq
            + u_time * u_waveSpeed
            + phase
        );
    }

    // Normalize to [0, 1] range
    waveValue = waveValue * 0.5 + 0.5;

    // Add subtle fbm detail
    float noiseDetail = fbm(distortedSt * 2.0 + u_time * u_waveSpeed * 0.1, 3) * 0.15;
    waveValue = clamp(waveValue + noiseDetail, 0.0, 1.0);

    // Color mapping
    vec3 gradientColor = mix(u_colorA, u_colorB, waveValue);

    // Accent color at wave peaks
    float accentMask = smoothstep(0.55, 0.85, waveValue);
    vec3 color = mix(gradientColor, u_colorAccent, accentMask * u_colorMix);

    // Vignette
    vec2 vignetteUV = uv * 2.0 - 1.0;
    float vignette = 1.0 - dot(vignetteUV, vignetteUV) * u_vignetteStrength * 0.3;
    vignette = clamp(vignette, 0.0, 1.0);
    color *= vignette;

    // Film grain
    float grain = (hash(uv * u_resolution + u_time * 1000.0) - 0.5) * u_grainAmount;
    color += grain;

    fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
