# Portfolio — Claude Context

## What this is

A personal portfolio site for Cail, a Product Designer based in Sydney. Built with React + TypeScript + Vite. The home page is an interactive WebGL ripple simulation; the work page is a vinyl record bookshelf showcasing case studies. The site prioritises visual craft over content at this stage.

## Commands

```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # TypeScript check + Vite production build
npm run preview    # Preview the production build
npm run scrape     # Download images from Tumblr into public/shuffle/
```

## Project structure

```
src/
├── main.tsx                  # Router entry — all routes defined here
├── styles/tokens.css         # Color design tokens (import via main.tsx)
├── vite-env.d.ts             # Vite import.meta.env types
│
├── home/                     # / — interactive ripple home page
│   ├── HomePage.tsx          # WebGL ripple simulation + particle trail
│   └── home.css              # home-* CSS classes
│
├── work/                     # /work — work page with peek/slide interaction
│   ├── WorkView.tsx          # Stacked layout: bookshelf over experiments
│   ├── WorkView.css          # work-view, experiments-hint, work-hint classes
│   └── bookshelf/            # Vinyl record bookshelf (the work page visual)
│       ├── BookshelfApp.tsx  # Entry point — passes AppHeader as prop
│       ├── VinylBookshelf.tsx# Main shelf component — accepts header?: ReactNode
│       ├── VinylRecord.tsx   # 3D flip card with hover animation
│       ├── VinylRecordBack.tsx
│       ├── VinylShelf.tsx    # One shelf row
│       ├── VinylOverlay.tsx  # Expanded project detail modal
│       ├── VinylCoverWave.tsx# Wave shader used as record cover art
│       ├── VinylTrinket.tsx  # Decorative potted plant SVG
│       ├── VinylTrinketBooks.tsx
│       ├── data.ts           # Project entries (title, description, tags, links)
│       ├── types.ts          # VinylProject, RecordState types
│       └── vinyl.css         # vinyl-* CSS classes; uses --color-dark/--color-sand
│
├── experiments/              # Reached via peek-down from work page
│   ├── ExperimentsApp.tsx    # Image gallery with shuffle + wave bg
│   └── experiments.css       # experiments__* BEM classes
│
├── pages/                    # Static info pages (orange bg, coming soon)
│   ├── AboutPage.tsx         # → <PageShell eyebrow="Coming soon" title="About" />
│   ├── ContactPage.tsx       # → <PageShell eyebrow="Coming soon" title="Contact" />
│   └── page.css              # .page, .page-content, .page-heading, .page-eyebrow
│
├── components/               # Shared UI components
│   ├── AppHeader.tsx         # Header: Logo + SiteNav + MobileNav, variant prop
│   ├── AppHeader.css         # .app-header, .app-logo layout
│   ├── Logo.tsx              # SVG logo mark (72×72, fill="currentColor")
│   ├── SiteNav.tsx           # Flat text nav, variant="dark|light", active via router
│   ├── SiteNav.css           # site-nav--dark/light, site-nav__item
│   ├── MobileNav.tsx         # Hamburger + clip-path overlay (position: fixed)
│   ├── MobileNav.css         # mobile-nav-*, .desktop-only-nav
│   ├── PageShell.tsx         # Shared layout for orange info pages
│   └── ShaderCanvas.tsx      # Reusable WebGL2 canvas for fragment shaders
│
├── wave/                     # Wave shader system (shared across bookshelf + experiments)
│   ├── WaveApp.tsx           # Dev-only standalone at /dev/wave
│   ├── uniforms.ts           # setWaveUniforms, WAVE_UNIFORM_NAMES
│   ├── types.ts              # WaveParams type
│   └── presets.ts            # Named parameter presets
│
├── particles/                # Particle grid shader (dev only)
│   ├── ParticlesApp.tsx      # Dev-only standalone at /dev/particles
│   ├── uniforms.ts
│   ├── types.ts
│   └── presets.ts
│
├── shaders/                  # Raw GLSL files (imported with ?raw)
│   ├── fullscreen.vert.glsl  # Shared vertex shader for ShaderCanvas
│   ├── wave.frag.glsl        # Wave pattern shader
│   ├── wave-sim.frag.glsl    # Ripple physics simulation (ping-pong)
│   ├── wave-display.frag.glsl# Ripple display pass (background text warp)
│   ├── particles.frag.glsl   # Particle grid
│   └── water-trail.frag.glsl # (currently unused — kept for reference)
│
└── gl/                       # Raw WebGL2 utilities (used by ShaderCanvas)
    ├── createProgram.ts
    ├── fullscreenQuad.ts
    └── uniforms.ts

public/
├── fonts/CalSans-SemiBold.woff2   # Used in home page overlay typography
├── images/                        # Portfolio case study cover images
│   └── *.webp / *.png / *.jpg
└── shuffle/                       # Experiments gallery images + manifest
    ├── manifest.json
    └── *.png / *.jpg / *.gif      # ~90 images scraped from Tumblr
```

## Routes

| Path | Component | Notes |
|---|---|---|
| `/` | `HomePage` | WebGL ripple sim, always visible |
| `/work` | `WorkView` | Bookshelf on top, experiments below |
| `/about` | `AboutPage` (via `PageShell`) | Orange bg, coming soon |
| `/contact` | `ContactPage` (via `PageShell`) | Orange bg, coming soon |
| `/dev/wave` | `WaveApp` | Dev only — not in production build |
| `/dev/particles` | `ParticlesApp` | Dev only — not in production build |

## Color tokens

Defined in `src/styles/tokens.css`, imported once in `main.tsx`.

| Token | Value | Use |
|---|---|---|
| `--color-orange` | `#ffa719` | Page background (home, about, contact) |
| `--color-cream` | `#fff6be` | Nav pill, mobile menu background |
| `--color-brown` | `#7b500d` | Text and icons on orange/cream |
| `--color-dark` | `#0e0e0e` | Page background (work/bookshelf) |
| `--color-sand` | `#f5f0e8` | Text and logo on dark backgrounds |

**Important:** canvas/WebGL drawing code (e.g. in `HomePage.tsx`) cannot use CSS variables — use the raw hex values there.

## Header pattern

All pages use a consistent `app-header` layout defined in `AppHeader.css`:
- Desktop: `padding: 40px 56px`, flex row, `pointer-events: none` on container
- Mobile: `padding: 40px 32px`
- Logo is `40×40px` via `.app-logo`

Use `<AppHeader variant="dark" />` on orange pages (home, about, contact) and `<AppHeader variant="light" />` on dark pages (work). The bookshelf passes it as a prop since it must scroll with the content on mobile:

```tsx
// BookshelfApp.tsx
<VinylBookshelf header={<AppHeader variant="light" className="vinyl-page-header" />} />
```

`.vinyl-page-header` is `position: absolute` on desktop (overlays the scroll container) and `position: static` on mobile (flows with scroll content).

The home page (`HomePage.tsx`) has its own mobile menu built in (`home-hamburger`, `home-menu`) rather than using `MobileNav`, because the overlay must sit within the ripple scene.

## Nav

`SiteNav` renders Work | About | Contact as plain text links. Active state is derived from `useLocation()` automatically. Add new nav items by updating the `ITEMS` array in `src/components/SiteNav.tsx` and `MobileNav.tsx`.

## Work page interaction

`WorkView` stacks two full-screen layers:
1. **Experiments** layer (bottom) — `ExperimentsApp`
2. **Bookshelf** panel (top, `position: absolute`) — `BookshelfApp`, animated with framer-motion

Hovering within 35px of the bottom edge peeks the experiments layer (reveals 35px). Clicking the revealed strip expands it. Hovering the top 35px when expanded peeks the bookshelf back. `PEEK_PX` and `THRESHOLD` are both 35 and defined at the top of `WorkView.tsx`.

## Adding a new project to the bookshelf

Edit `src/work/bookshelf/data.ts`. Each entry is a `VinylProject`:

```ts
{
  id: 'project-slug',
  title: 'Project Name',
  description: 'Short description of the work.',
  tags: ['Tag1', 'Tag2'],
  coverColor: '#hex',        // Record label background
  wavePreset: 'preset-name', // Wave shader preset for cover art (see wave/presets.ts)
  image: '/images/cover.webp',
  link: 'https://...',       // Optional — external case study link
}
```

## Dev-only experiments

Wave and particles experiments are lazy-loaded and only routed in development (`import.meta.env.DEV`). They produce separate chunks in the build output but those routes don't exist in production. To access them locally: `/dev/wave`, `/dev/particles`.

## Design taste when creating new pages

When building new pages or UI surfaces, first study what already exists in the project — tokens, component patterns, spacing, animation style — and stay consistent with those. Then apply the [taste-skill](https://github.com/Leonxlnx/taste-skill) framework to make design decisions. Key principles from that skill that apply here:

- **No generic layouts** — avoid symmetric 3-column cards, default padding, or obvious AI-generated compositions. Favour asymmetry and considered hierarchy.
- **One accent color maximum** — the token palette already defines this; don't introduce additional accent hues.
- **Hardware-accelerated motion only** — animate via `transform` and `opacity`, never layout properties (`width`, `height`, `top`, etc.). Framer Motion spring animations are already established; match that feel.
- **Typography hierarchy** — establish clear size contrast between headings and body; don't use more than two weights on a single surface.
- **Interactive states must be complete** — every interactive element needs hover, focus, and active states. Don't leave any half-finished.
- **No emojis, no neon glows, no pure black** — `--color-dark: #0e0e0e` is the darkest value; respect that.
- **Materiality** — surfaces should feel like they have weight. Use shadows, layering, and subtle gradients rather than flat fills.

The existing pages (home ripple, vinyl bookshelf, experiments) set the bar. New pages should feel like they belong to the same creative system.

## Key conventions

- **No CSS modules** — global class names, prefixed by component (`home-*`, `vinyl-*`, `experiments__*`)
- **BEM-ish for experiments** (`experiments__frame`, `experiments__btn-front`)
- **Kebab for most components** (`vinyl-container`, `app-header`, `site-nav__item`)
- **Tokens in CSS, raw hex in JS** — CSS custom properties can't be used in canvas/WebGL drawing contexts
- **`pointer-events: none` on headers** — restored selectively on interactive children via `pointer-events: all`
- **GLSL imported as strings** — `import src from './shader.frag.glsl?raw'`
- Fonts loaded from Google Fonts (Inter) + local woff2 (Cal Sans)
