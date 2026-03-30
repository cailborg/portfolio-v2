import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppHeader from '../../components/AppHeader';
import '../case-study.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

const images: GalleryImage[] = [
  {
    src: '/images/cosmic/iphone-mockup.jpg',
    alt: 'Cosmic design system — iPhone 11 Pro dark mockup',
  },
  {
    src: '/images/cosmic/discovery.jpg',
    alt: 'Cosmic component library in use',
    caption: 'Cosmic makes creating and testing new products much easier and more efficient',
  },
  {
    src: '/images/cosmic/illustrations.png',
    alt: 'Custom illustrations created for Limepay UI',
    caption: 'I created a set of illustrations to add some of the brand character to UI interfaces',
  },
  {
    src: '/images/cosmic/workflow.png',
    alt: 'Design system workflow diagram',
    caption: 'Design system workflow',
  },
  {
    src: '/images/cosmic/checkout.jpg',
    alt: 'Cosmic checkout with merchant theming',
    caption: 'Cosmic was built to control theming for merchants while maintaining strict accessibility standards',
  },
];

export default function CosmicPage() {
  useEffect(() => {
    const root = document.getElementById('root');
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    if (root) { root.style.overflow = 'auto'; root.style.height = 'auto'; }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      if (root) { root.style.overflow = ''; root.style.height = ''; }
    };
  }, []);

  return (
    <div className="cs-page">

      {/* Cover — full viewport, image peeks from bottom */}
      <div className="cs-cover">
        <AppHeader variant="light" />

        <motion.div
          className="cs-cover__content"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.h1 className="cs-cover__title" variants={fadeUp}>
            Cosmic
          </motion.h1>

          <motion.div className="cs-cover__meta" variants={fadeUp}>
            <div className="cs-meta-col">
              <p className="cs-meta-col__label">Year</p>
              <p className="cs-meta-col__value">2022</p>
            </div>
            <div className="cs-meta-col">
              <p className="cs-meta-col__label">Client</p>
              <p className="cs-meta-col__value">Limepay</p>
            </div>
            <div className="cs-meta-col">
              <p className="cs-meta-col__label">Involvement</p>
              <ul className="cs-meta-tags">
                <li>Design Systems</li>
                <li>Tokenisation</li>
                <li>Accessibility</li>
                <li>UI Design</li>
              </ul>
            </div>
            <div className="cs-meta-col">
              <p className="cs-meta-col__label">Overview</p>
              <p className="cs-meta-col__value cs-meta-col__value--body">
                A flexible design system enabling hundreds of merchant brands to theme the Limepay
                checkout without breaking accessibility standards.
              </p>
              <a
                className="cs-meta-link"
                href="https://cosmic.limepay.com.au"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit site ↗
              </a>
            </div>
          </motion.div>
        </motion.div>

      </div>

      {/* Gallery */}
      <div className="cs-gallery">

        {/* Peek image — constrained to header margins, pulls up into viewport */}
        <motion.figure
          className="cs-gallery__item--peek"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <img src={images[0].src} alt={images[0].alt} />
        </motion.figure>

        {/* Body copy */}
        <motion.div
          className="cs-content cs-body"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div className="cs-body__copy" variants={fadeUp}>
            <p>
              Limepay needed to scale product development across hundreds of merchants — without
              breaking consistency, accessibility, or speed.
            </p>
            <p>
              I led the creation of "Cosmic", a design system that enabled rapid product iteration
              while maintaining a unified experience across all merchant implementations.
            </p>
          </motion.div>

          <motion.div className="cs-impact" variants={fadeUp}>
            <h2 className="cs-impact__heading">Impact</h2>
            <ul className="cs-impact__list">
              <li>Reduced design-to-dev handoff time by X%</li>
              <li>Enabled reuse across X+ merchants</li>
              <li>Improved accessibility compliance across core flows</li>
              <li>Increased speed of launching new product features</li>
            </ul>
          </motion.div>
        </motion.div>

        {/* 2-up: Discovery + Illustrations */}
        <div className="cs-content">
          <motion.div
            className="cs-gallery__row"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          >
            <motion.figure variants={fadeUp}>
              <img src={images[1].src} alt={images[1].alt} />
              {images[1].caption && <figcaption>{images[1].caption}</figcaption>}
            </motion.figure>
            <motion.figure variants={fadeUp}>
              <img src={images[2].src} alt={images[2].alt} />
              {images[2].caption && <figcaption>{images[2].caption}</figcaption>}
            </motion.figure>
          </motion.div>
        </div>

        {/* Testimonial 1 — Sharon Tam */}
        <div className="cs-content">
          <motion.blockquote
            className="cs-quote"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <span className="cs-quote__mark">"</span>
            <p className="cs-quote__text">
              First time working in a company with a design system properly set up and it has made
              all the difference. It has been a game changer to our workflow. Every component is
              clearly defined with a purpose and Cail has ensured that all accessibility
              considerations have been made to design products that will work for everyone. I can
              just plug and play.
            </p>
            <cite className="cs-quote__attribution">Sharon Tam — UX Designer</cite>
          </motion.blockquote>
        </div>

        {/* Full bleed: Workflow diagram */}
        <motion.figure
          className="cs-gallery__item--full"
          style={{ marginTop: 'clamp(32px, 4vw, 64px)' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <img src={images[3].src} alt={images[3].alt} />
          {images[3].caption && <figcaption>{images[3].caption}</figcaption>}
        </motion.figure>

        {/* Contained: Testimonial 2 — Kim Janson */}
        <div className="cs-content">
          <motion.blockquote
            className="cs-quote"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <span className="cs-quote__mark">"</span>
            <p className="cs-quote__text">
              Cosmic completely changed the way we approached design. All our product components
              and assets were beautifully organised in a cohesive and robust ecosystem from Design
              through to Development.
            </p>
            <cite className="cs-quote__attribution">
              Kim Janson — Creative Director of Product Design, Innovation and Brand
            </cite>
          </motion.blockquote>
        </div>

        {/* Contained: Checkout */}
        <div className="cs-content">
          <motion.figure
            className="cs-gallery__item--contained"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <img src={images[4].src} alt={images[4].alt} />
            {images[4].caption && <figcaption>{images[4].caption}</figcaption>}
          </motion.figure>
        </div>

      </div>

      {/* Footer */}
      <footer className="cs-footer">
        <div className="cs-content">
          <Link to="/work" className="cs-back">
            ← Back to work
          </Link>
        </div>
      </footer>
    </div>
  );
}
