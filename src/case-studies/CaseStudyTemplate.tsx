import { useEffect, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppHeader from '../components/AppHeader';
import './case-study.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export interface CaseStudyData {
  title: string;
  year: string;
  client: string;
  involvement: string[];
  overview: string;
  siteUrl?: string;
  peekImage: { src: string; alt: string };
  body: string[];
  impact: string[];
  gallery?: ReactNode;
}

interface Props {
  data: CaseStudyData;
}

export default function CaseStudyTemplate({ data }: Props) {
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

      {/* Cover */}
      <div className="cs-cover">
        <AppHeader variant="light" />
        <motion.div
          className="cs-cover__content"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.h1 className="cs-cover__title" variants={fadeUp}>
            {data.title}
          </motion.h1>
          <motion.div className="cs-cover__meta" variants={fadeUp}>
            <div className="cs-meta-col">
              <p className="cs-meta-col__label">Year</p>
              <p className="cs-meta-col__value">{data.year}</p>
            </div>
            <div className="cs-meta-col">
              <p className="cs-meta-col__label">Client</p>
              <p className="cs-meta-col__value">{data.client}</p>
            </div>
            <div className="cs-meta-col">
              <p className="cs-meta-col__label">Involvement</p>
              <ul className="cs-meta-tags">
                {data.involvement.map(tag => <li key={tag}>{tag}</li>)}
              </ul>
            </div>
            <div className="cs-meta-col">
              <p className="cs-meta-col__label">Overview</p>
              <p className="cs-meta-col__value cs-meta-col__value--body">{data.overview}</p>
              {data.siteUrl && (
                <a className="cs-meta-link" href={data.siteUrl} target="_blank" rel="noopener noreferrer">
                  Visit site ↗
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Gallery */}
      <div className="cs-gallery">

        {/* Peek image */}
        <motion.figure
          className="cs-gallery__item--peek"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <img src={data.peekImage.src} alt={data.peekImage.alt} />
        </motion.figure>

        {/* Body + Impact */}
        <motion.div
          className="cs-content cs-body"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div className="cs-body__copy" variants={fadeUp}>
            {data.body.map((para, i) => <p key={i}>{para}</p>)}
          </motion.div>
          <motion.div className="cs-impact" variants={fadeUp}>
            <h2 className="cs-impact__heading">Impact</h2>
            <ul className="cs-impact__list">
              {data.impact.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </motion.div>
        </motion.div>

        {/* Project-specific gallery content */}
        {data.gallery}

      </div>

      {/* Footer */}
      <footer className="cs-footer">
        <div className="cs-content">
          <Link to="/work" className="cs-back">← Back to work</Link>
        </div>
      </footer>
    </div>
  );
}
