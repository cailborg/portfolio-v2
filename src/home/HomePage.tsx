import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import Logo from '../components/Logo';
import * as THREE from 'three';
import waveSimSrc from '../shaders/wave-sim.frag.glsl?raw';
import waveDisplaySrc from '../shaders/wave-display.frag.glsl?raw';
import './home.css';
import '../components/AppHeader.css';

const SIM_RES = 512;

const SIM_VERT = `void main() { gl_Position = vec4(position, 1.0); }`;
const DISPLAY_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

type Ctx = CanvasRenderingContext2D & { letterSpacing: string };

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const word of words) {
    const test = cur ? `${cur} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && cur) {
      lines.push(cur);
      cur = word;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function drawTypography(
  ctx: CanvasRenderingContext2D,
  tex: THREE.CanvasTexture,
  bgColor: string,
  textColor: string,
  w: number,
  h: number,
) {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = textColor;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  if (h > w) {
    // Mobile portrait — scale from 393×852 Figma reference
    const scale = w / 393;
    const size = Math.round(64 * scale);
    const x = Math.round(40 * scale);
    const topY = Math.round(h * (259 / 852));
    const maxW = Math.round(311 * scale);
    const lineH = size * 0.957;
    (ctx as Ctx).letterSpacing = `${(-1.92 * scale).toFixed(2)}px`;
    ctx.font = `900 ${size}px "Inter", sans-serif`;
    const lines = ["Hi i'm Cail,", 'a Product Designer', 'from Sydney']
      .flatMap(l => wrapText(ctx, l, maxW));
    lines.forEach((l, i) => ctx.fillText(l, x, topY + i * lineH));
  } else {
    // Desktop landscape — scale from 1920×1080 Figma reference
    const scale = w / 1920;
    const size = Math.round(180 * scale);
    const x = Math.round(120 * scale);
    const topY = Math.round(h * (259 / 1080));
    const lineH = size * 0.791;
    (ctx as Ctx).letterSpacing = `${(-5.4 * scale).toFixed(2)}px`;
    ctx.font = `900 ${size}px "Inter", sans-serif`;
    ctx.fillText("Hi i'm Cail,", x, topY);
    ctx.fillText('a Product Designer', x, topY + lineH);
    ctx.fillText('from Sydney', x, topY + lineH * 2);
  }

  (ctx as Ctx).letterSpacing = '0px';
  tex.needsUpdate = true;
}

const FORK_ANGLE = 0.32; // radians (~18°) — spread of each tail from back direction

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  life: number;   // 0–1, starts at 1
  size: number;
};

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas      = canvasRef.current!;
    const trailCanvas = trailCanvasRef.current!;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    renderer.setPixelRatio(1);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    // Size trail canvas to match
    trailCanvas.width  = canvas.clientWidth;
    trailCanvas.height = canvas.clientHeight;
    const trailCtx = trailCanvas.getContext('2d')!;
    const textColor = '#fff6be';

    // Ping-pong render targets
    const rtA = new THREE.WebGLRenderTarget(SIM_RES, SIM_RES, {
      type: THREE.FloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
    });
    const rtB = new THREE.WebGLRenderTarget(SIM_RES, SIM_RES, {
      type: THREE.FloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
    });

    // Background canvas — sized to match viewport (2× for sharpness)
    const bgCanvas    = document.createElement('canvas');
    bgCanvas.width    = canvas.clientWidth * 2;
    bgCanvas.height   = canvas.clientHeight * 2;
    const bgCtx       = bgCanvas.getContext('2d')!;
    const bgTexture   = new THREE.CanvasTexture(bgCanvas);
    const redraw = () => drawTypography(bgCtx, bgTexture, '#ffa719', '#fff6be', bgCanvas.width, bgCanvas.height);
    redraw();
    document.fonts.ready.then(redraw);

    const simMat = new THREE.ShaderMaterial({
      vertexShader: SIM_VERT,
      fragmentShader: waveSimSrc,
      uniforms: {
        prevFrame:     { value: rtA.texture },
        resolution:    { value: new THREE.Vector2(SIM_RES, SIM_RES) },
        mouse:         { value: new THREE.Vector2(-9999, -9999) },
        mouseRadius:   { value: 14 },
        mouseStrength: { value: 4 },
        velDamping:    { value: 0.018 },
        presDamping:   { value: 0.999 },
      },
    });
    const displayMat = new THREE.ShaderMaterial({
      vertexShader: DISPLAY_VERT,
      fragmentShader: waveDisplaySrc,
      uniforms: {
        simTexture: { value: rtB.texture },
        bgTexture:  { value: bgTexture },
        strength:   { value: 0.155 },
        time:       { value: 0 },
        mouseUV:    { value: new THREE.Vector2(0.5, 0.5) },
      },
    });
    const plane = new THREE.PlaneGeometry(2, 2);
    const simScene = new THREE.Scene();
    simScene.add(new THREE.Mesh(plane, simMat));
    const displayScene = new THREE.Scene();
    displayScene.add(new THREE.Mesh(plane, displayMat));
    const ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Mouse state
    const mousePixels = new THREE.Vector2(-9999, -9999);
    const targetUV    = new THREE.Vector2(0.5, 0.5);
    const particles: Particle[] = [];
    const mousePx     = { x: -9999, y: -9999 }; // canvas CSS coords for trail
    const prevPx      = { x: -9999, y: -9999 };
    const vel         = { x: 0, y: 0 };
    const smoothVel   = { x: 0, y: 0 };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      const cx = e.clientX - r.left;
      const cy = e.clientY - r.top;

      mousePixels.set(nx * SIM_RES, (1.0 - ny) * SIM_RES);
      targetUV.set(nx, 1.0 - ny);

      if (prevPx.x > -9000) {
        vel.x = cx - prevPx.x;
        vel.y = cy - prevPx.y;
      }
      prevPx.x = cx;
      prevPx.y = cy;
      mousePx.x = cx;
      mousePx.y = cy;
    };

    const onDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      onMove(e);
    };

    const onLeave = () => {
      mousePixels.set(-9999, -9999);
      targetUV.set(0.5, 0.5);
      prevPx.x = -9999;
      vel.x = 0; vel.y = 0;
      smoothVel.x = 0; smoothVel.y = 0;
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onLeave);
    canvas.addEventListener('pointercancel', onLeave);
    canvas.addEventListener('pointerleave', onLeave);

    let pingPong = false;
    let rafId: number;

    const tick = () => {
      displayMat.uniforms.time.value += 1.0 / 60.0;
      displayMat.uniforms.mouseUV.value.lerp(targetUV, 0.07);

      // ── Trail canvas ──────────────────────────────────────────
      // Smooth velocity — gradual direction changes, no snapping
      smoothVel.x += (vel.x - smoothVel.x) * 0.14;
      smoothVel.y += (vel.y - smoothVel.y) * 0.14;

      // ── Particle emission ──────────────────────────────────────
      const speed = Math.hypot(smoothVel.x, smoothVel.y);
      if (speed > 0.8 && mousePx.x > -9000) {
        const nx = -smoothVel.x / speed;
        const ny = -smoothVel.y / speed;

        for (const forkAngle of [FORK_ANGLE, -FORK_ANGLE]) {
          const cos = Math.cos(forkAngle);
          const sin = Math.sin(forkAngle);
          const fx = nx * cos - ny * sin;
          const fy = nx * sin + ny * cos;

          // 2 particles per fork per frame
          for (let i = 0; i < 2; i++) {
            const spread = (Math.random() - 0.5) * 0.25;
            const sc = Math.cos(spread), ss = Math.sin(spread);
            const pSpeed = speed * (1.4 + Math.random() * 0.8);
            particles.push({
              x: mousePx.x, y: mousePx.y,
              vx: (fx * sc - fy * ss) * pSpeed,
              vy: (fx * ss + fy * sc) * pSpeed,
              life: 0.85 + Math.random() * 0.15,
              size: 1.2 + Math.random() * 1.8,
            });
          }
        }
      }

      // ── Particle update + draw ─────────────────────────────────
      trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      const tc = textColor;
      trailCtx.shadowColor = tc;
      trailCtx.fillStyle   = tc;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x   += p.vx;
        p.y   += p.vy;
        p.vx  *= 0.91;
        p.vy  *= 0.91;
        p.life -= 0.012;

        if (p.life <= 0) { particles.splice(i, 1); continue; }

        trailCtx.globalAlpha = Math.min(p.life + 0.2, 1.0);
        trailCtx.beginPath();
        trailCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        trailCtx.fill();
      }

      trailCtx.globalAlpha = 1;

      // ── WebGL simulation + display ────────────────────────────
      const src = pingPong ? rtA : rtB;
      const dst = pingPong ? rtB : rtA;
      pingPong = !pingPong;

      simMat.uniforms.prevFrame.value = src.texture;
      simMat.uniforms.mouse.value.copy(mousePixels);
      renderer.setRenderTarget(dst);
      renderer.render(simScene, ortho);

      displayMat.uniforms.simTexture.value = dst.texture;
      renderer.setRenderTarget(null);
      renderer.render(displayScene, ortho);

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onResize = () => {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      trailCanvas.width  = canvas.clientWidth;
      trailCanvas.height = canvas.clientHeight;
      bgCanvas.width  = canvas.clientWidth * 2;
      bgCanvas.height = canvas.clientHeight * 2;
      redraw();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onLeave);
      canvas.removeEventListener('pointercancel', onLeave);
      canvas.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
      rtA.dispose();
      rtB.dispose();
      bgTexture.dispose();
      simMat.dispose();
      displayMat.dispose();
      renderer.dispose();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="home-scene">
      <canvas ref={canvasRef} className="home-canvas" />
      <canvas ref={trailCanvasRef} className="home-trail" />
      <div className="home-chrome">
        <header className="app-header">
          <Logo className="app-logo" style={{ color: '#7b500d' }} />
          <SiteNav variant="dark" />
          <button className="home-hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="2" y="5" width="20" height="2.5" rx="1.25"/>
              <rect x="2" y="10.75" width="20" height="2.5" rx="1.25"/>
              <rect x="2" y="16.5" width="20" height="2.5" rx="1.25"/>
            </svg>
          </button>
        </header>
      </div>
      <div className={`home-menu${menuOpen ? ' open' : ''}`}>
        <button className="home-menu-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        <nav className="home-menu-items">
          <a onClick={() => { setMenuOpen(false); navigate('/work'); }}>Work</a>
          <a onClick={() => { setMenuOpen(false); navigate('/about'); }}>About</a>
          <a onClick={() => { setMenuOpen(false); navigate('/contact'); }}>Contact</a>
        </nav>
      </div>
    </div>
  );
}
