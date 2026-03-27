import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppHeader from '../../components/AppHeader';
import './cosmic-page.css';

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
      <AppHeader variant="light" />

      {/* Hero */}
      <div className="cs-hero">
        <img
          className="cs-hero__img"
          src="/images/cosmic.png"
          alt="Cosmic — Limepay Design System"
        />
        <div className="cs-hero__fade" />
      </div>

      {/* Intro */}
      <motion.div
        className="cs-intro"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div className="cs-intro__meta" variants={fadeUp}>
          <p className="cs-eyebrow">2022</p>
          <p className="cs-eyebrow">Limepay</p>
          <ul className="cs-tags">
            <li>Design Systems</li>
            <li>UI Design</li>
            <li>Experience Design</li>
          </ul>
          <a
            className="cs-external-link"
            href="https://cosmic.limepay.com.au"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cosmic Design System ↗
          </a>
        </motion.div>

        <motion.div className="cs-intro__body" variants={fadeUp}>
          <h1 className="cs-title">Cosmic</h1>
          <div className="cs-body-copy">
            <p>
              Limepay is a Buy-Now-Pay-Later startup that was looking to scale its design team
              and expand its suite of products.
            </p>
            <p>
              As the UI Design Lead in the Innovation Team, my role was to create a design system
              that was flexible enough to be themed for each of our hundreds of merchant brands
              while uplifting the standard of accessibility and usability in our products. I also
              needed to evangelise and educate stakeholders, including the engineering team, on the
              benefits of using a design system. As a result I created Cosmic, the Limepay design
              system, which has begun to roll out in production whenever we create new core product
              features.
            </p>
            <p>
              At the same time we used the principles, tokens and components of Cosmic to redesign
              our brand website, and quickly iterate and test new products which will be in market
              in 2022.
            </p>
            <p>
              I also worked with a UX Designer to rethink our core checkout product to utilise our
              freshly built Design System and to accommodate a complex set of user flows and
              flexible payment options.
            </p>
            <p>
              You can view V1 of Cosmic{' '}
              <a href="https://cosmic.limepay.com.au" target="_blank" rel="noopener noreferrer">
                here
              </a>
              .
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Gallery */}
      <div className="cs-gallery">

        {/* Full bleed: iPhone mockup */}
        <motion.figure
          className="cs-gallery__item--full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <img src={images[0].src} alt={images[0].alt} />
        </motion.figure>

        {/* Contained: Testimonial 1 — Sharon Tam */}
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

        {/* Contained 2-up: Discovery + Illustrations */}
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
