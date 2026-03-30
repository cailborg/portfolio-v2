import CaseStudyTemplate, { CaseStudyData } from '../CaseStudyTemplate';

const data: CaseStudyData = {
  title: 'Try Before You Buy',
  year: '2022',
  client: 'Limepay',
  involvement: ['Brand Identity', 'Product Design', 'UX Research', 'Prototyping'],
  overview: 'Brand, product, and service design for a new retail TBYB offering — from competitor analysis and service blueprints through to high-fidelity prototypes.',
  peekImage: { src: '/images/tbyb/hero3.png', alt: 'Try Before You Buy — Limepay' },
  body: [
    "As part of the Innovation Team at Limepay, I was tasked with creating and building out new product experiences.",
    "Try Before You Buy is an upcoming retail product powered by Limepay technology. I created a custom brand — injecting a bit more of an energetic, fresh feel aimed at a younger audience.",
    "I worked with a Creative Director and a UX Designer to map out the user journeys, create a brand identity, and design a high-fidelity prototype ready for user testing.",
  ],
  impact: [
    'End-to-end brand identity created from scratch',
    'Service blueprint mapping full customer and logistics flows',
    'High-fidelity prototype ready for user testing',
    'Competitor analysis informing value proposition and market fit',
  ],
  gallery: (
    <>
      <div className="cs-gallery__row cs-gallery__row--2up">
        <figure>
          <img src="/images/tbyb/mockup1.jpg" alt="TBYB app mockup" />
        </figure>
        <figure>
          <img src="/images/tbyb/mockup2.jpg" alt="TBYB app mockup" />
        </figure>
      </div>
      <figure className="cs-gallery__item">
        <img src="/images/tbyb/mockup3.jpg" alt="TBYB app mockup — checkout flow" />
      </figure>
      <figure className="cs-gallery__item">
        <img src="/images/tbyb/ui-screens.jpg" alt="TBYB UI screens spread" />
      </figure>
      <div className="cs-gallery__row cs-gallery__row--2up">
        <figure>
          <img src="/images/tbyb/service-blueprint.jpg" alt="Service blueprint" />
          <figcaption>Brainstorming the service blueprint</figcaption>
        </figure>
        <figure>
          <img src="/images/tbyb/returns.jpg" alt="Returns flow brainstorm" />
          <figcaption>Brainstorming solutions to complex logistics flows</figcaption>
        </figure>
      </div>
      <figure className="cs-gallery__item">
        <img src="/images/tbyb/competitor-analysis.jpg" alt="Competitor analysis" />
        <figcaption>Competitor analysis to determine market fit for value propositions</figcaption>
      </figure>
    </>
  ),
};

export default function TbybPage() {
  return <CaseStudyTemplate data={data} />;
}
