import CaseStudyTemplate, { CaseStudyData } from '../CaseStudyTemplate';

const data: CaseStudyData = {
  title: 'FRED',
  year: '2018',
  client: 'AGL',
  involvement: ['Design Language', 'WCAG', 'Component Library', 'Illustration', 'Documentation'],
  overview: "AGL's end-to-end design language system — from accessibility standards and tokens through to a Sketch component library, illustrations, and a dedicated documentation microsite.",
  peekImage: { src: '/images/fred/agl-dog.png', alt: 'FRED — AGL Design Language System' },
  body: [
    "AGL had a problem with design and branding consistency among their numerous design teams. My agency was commissioned to audit every consumer-facing touch point and create a Design Language System to make it easy for new team members to integrate into the AGL methodology — and for existing team members to work together for the first time.",
    "I worked with a UX designer to write guidelines, create a colour palette specifically for digital projects that was WCAG 2.0 AA compliant, and implement a standardised system for spacing and type. I built a comprehensive Sketch component library, designed a microsite to house the information, and created a suite of illustrations to make FRED (Foundational Rules of Experience Design) a little more welcoming to new users.",
  ],
  impact: [
    'Full consumer touchpoint audit completed across all AGL products',
    'WCAG 2.0 AA colour palette established for all digital touchpoints',
    'Comprehensive Sketch component library delivered to design teams',
    'Dedicated documentation microsite launched for ongoing team adoption',
  ],
  gallery: (
    <>
      <figure className="cs-gallery__item">
        <img src="/images/fred/building-blocks.gif" alt="FRED component building blocks" />
        <figcaption>Foundational building blocks — spacing, type, and colour system</figcaption>
      </figure>
      <div className="cs-gallery__row cs-gallery__row--2up">
        <figure>
          <img src="/images/fred/screen1.jpg" alt="FRED — documentation microsite" />
        </figure>
        <figure>
          <img src="/images/fred/icons.png" alt="FRED icon library" />
        </figure>
      </div>
      <div className="cs-gallery__row cs-gallery__row--2up">
        <figure>
          <img src="/images/fred/screen2.jpg" alt="FRED — component documentation" />
        </figure>
        <figure>
          <img src="/images/fred/screen3.jpg" alt="FRED — colour palette" />
        </figure>
      </div>
      <div className="cs-testimonial cs-content">
        <blockquote>
          <p>"A brilliant and pragmatic solution."</p>
          <cite>AGL Experience Design Manager</cite>
        </blockquote>
      </div>
    </>
  ),
};

export default function FredPage() {
  return <CaseStudyTemplate data={data} />;
}
