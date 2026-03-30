import { StrictMode, lazy, Suspense } from 'react';
import './styles/tokens.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './home/HomePage';
import WorkView from './work/WorkView';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CosmicPage from './case-studies/cosmic/CosmicPage';
import SonicPage from './case-studies/sonic/SonicPage';
import TbybPage from './case-studies/tbyb/TbybPage';
import FoxPage from './case-studies/fox/FoxPage';
import FredPage from './case-studies/fred/FredPage';
import FanterpreterPage from './case-studies/fanterpreter/FanterpreterPage';

const WaveApp = lazy(() => import('./wave/WaveApp'));
const ParticlesApp = lazy(() => import('./particles/ParticlesApp'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkView />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/work/cosmic" element={<CosmicPage />} />
        <Route path="/work/sonic" element={<SonicPage />} />
        <Route path="/work/tbyb" element={<TbybPage />} />
        <Route path="/work/fox" element={<FoxPage />} />
        <Route path="/work/fred" element={<FredPage />} />
        <Route path="/work/fanterpreter" element={<FanterpreterPage />} />
        {import.meta.env.DEV && (
          <Route path="/dev/wave" element={<Suspense><WaveApp /></Suspense>} />
        )}
        {import.meta.env.DEV && (
          <Route path="/dev/particles" element={<Suspense><ParticlesApp /></Suspense>} />
        )}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
