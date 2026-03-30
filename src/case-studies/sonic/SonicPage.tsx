import CaseStudyTemplate, { CaseStudyData } from '../CaseStudyTemplate';

const data: CaseStudyData = {
  title: 'Sonic',
  year: '2023',
  client: 'Cochlear',
  involvement: ['Design Systems', 'Design Tokens', 'Multi-platform', 'Figma', 'Strategy'],
  overview: "Led expansion of Cochlear's design system from a web-only component library to a multi-platform solution — covering web, iOS, Android, and professional software.",
  peekImage: { src: '/images/sonic/header-image.png', alt: 'Sonic — Cochlear Design System' },
  body: [
    "Cochlear's unique challenges as a large global organisation with legacy software required crafting product principles to guide the design system team in architecture decisions. A strategic decision was made to leverage native platforms as enablers rather than blockers.",
    "I led the expansion of Sonic from a web-only component library into a comprehensive multi-platform design system. I collected feedback on the existing web design token solution, reworked the tokens, and tested comprehension across platforms — using the latest Figma features to create a source-of-truth bridging the design and development gap.",
    "I organised regular feedback sessions and communication with product teams to encourage involvement and integration planning with Sonic — creating unified component blueprints to help platform teams build their libraries faster and with greater consistency.",
  ],
  impact: [
    'Color styles reduced from 250+ to 64 tokens covering 99% of UI design needs',
    'Design token system integrated across all platform component libraries',
    'Sonic adopted by 2 large greenfield projects within the first 6 months',
    'Figma-to-GitLab pipeline established as single source of truth',
  ],
  gallery: (
    <>
      <figure className="cs-gallery__item">
        <img src="/images/sonic/process-1.png" alt="Systems thinking and stakeholder engagement" />
        <figcaption>Sonic required systems thinking and stakeholder engagement for effective structure</figcaption>
      </figure>
      <figure className="cs-gallery__item">
        <img src="/images/sonic/sonic-structure.png" alt="Sonic architecture — native platform conventions" />
        <figcaption>Resource limitations addressed by leveraging native platform conventions as an enabler</figcaption>
      </figure>
      <div className="cs-gallery__row cs-gallery__row--2up">
        <figure>
          <img src="/images/sonic/pipeline.png" alt="Figma to GitLab pipeline" />
          <figcaption>Figma to GitLab pipeline — consistent source of truth with unified styling language</figcaption>
        </figure>
        <figure>
          <img src="/images/sonic/documentation.png" alt="Searchable documentation" />
          <figcaption>Comprehensive searchable documentation tested with different information architecture variations</figcaption>
        </figure>
      </div>
      <figure className="cs-gallery__item">
        <img src="/images/sonic/component-blueprints.png" alt="Component blueprints" />
        <figcaption>Component blueprints introduced for fast library building while maintaining organisational consistency</figcaption>
      </figure>
      <div className="cs-testimonial cs-content">
        <blockquote>
          <p>"Amazing and streamlined design token setup. Thanks for taking us to new heights!"</p>
          <cite>Sharon Varley, UX Director</cite>
        </blockquote>
        <blockquote>
          <p>"Sonic has made my life as a UX designer so much easier. It's one of the few design systems that feels built for real teams doing real work."</p>
          <cite>Kyrillos Samaan, Senior Product Designer</cite>
        </blockquote>
      </div>
    </>
  ),
};

export default function SonicPage() {
  return <CaseStudyTemplate data={data} />;
}
