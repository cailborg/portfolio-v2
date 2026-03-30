import CaseStudyTemplate, { CaseStudyData } from '../CaseStudyTemplate';

const data: CaseStudyData = {
  title: 'FOX V1',
  year: '2021',
  client: 'OFX',
  involvement: ['Design Systems', 'Design Ops', 'React', 'Figma', 'Accessibility'],
  overview: 'Repositioned design at OFX from a wireframing function to a strategic discipline — through a React component library, design tokens, and a cross-functional Design Ops working group.',
  siteUrl: 'https://designops.s3.ap-southeast-2.amazonaws.com/storybook/index.html?path=%2Fdocs%2Fguidelines-introduction--page',
  peekImage: { src: '/images/fox/fox-2.jpg', alt: 'FOX V1 — OFX Design System' },
  body: [
    "OFX had an immature and underappreciated design discipline. UX & Design was marginalised as just wireframes in an 'agile' product team — there were no design sprints or discovery research, no digital style guide or source of truth, and a generally fractured brand experience with significant accessibility issues.",
    "I did a global design audit, evangelised the need for a Design System with senior stakeholders, and created a Design Ops cross-functional working group. I created design tokens and components in Figma, and contributed to building a React-based set of shareable components — FOX V1.",
    "To increase collaboration with the marketing team, I also built tools to speed up their workflows, including a Brand Polygon Generator and a drag-and-drop image filter.",
  ],
  impact: [
    'UI component work reduced from ~65% to near-zero of designer time',
    'React component library adopted in production across multiple products',
    'Design repositioned from execution to strategic discipline',
    'Cross-functional Design Ops working group established organisation-wide',
  ],
  gallery: (
    <>
      <figure className="cs-gallery__item">
        <img src="/images/fox/goals.png" alt="FOX contributing to wider organisational goals" />
        <figcaption>FOX needed to contribute to the wider organisation's goals</figcaption>
      </figure>
      <div className="cs-gallery__row cs-gallery__row--2up">
        <figure>
          <img src="/images/fox/icons.png" alt="FOX icon set" />
          <figcaption>The icon set features a clear start and end point, conveying a sense of movement</figcaption>
        </figure>
        <figure>
          <img src="/images/fox/illustrations.png" alt="Custom illustrations" />
          <figcaption>A custom set of illustrations to inject brand personality into the UI</figcaption>
        </figure>
      </div>
      <figure className="cs-gallery__item">
        <img src="/images/fox/motion-guidelines.gif" alt="Motion guidelines" />
        <figcaption>Motion guidelines to enhance the brand identity</figcaption>
      </figure>
      <figure className="cs-gallery__item">
        <img src="/images/fox/mockup-landing.jpg" alt="OFX landing page mockup" />
      </figure>
      <div className="cs-gallery__row cs-gallery__row--2up">
        <figure>
          <img src="/images/fox/mockup-dashboard.jpg" alt="OFX dashboard mockup" />
        </figure>
        <figure>
          <img src="/images/fox/mockup-transfer.jpg" alt="OFX transfer flow mockup" />
        </figure>
      </div>
      <div className="cs-testimonial cs-content">
        <blockquote>
          <p>"Without the FOX components, I would be spending over 60–70% of my UI design time on building components and micro-interactions. Now I can simply drag and drop the components and focus on the high-level designs."</p>
          <cite>Vic Hsieh, UX Lead</cite>
        </blockquote>
        <blockquote>
          <p>"FOX has helped us improve our time-to-market for new features. It's vastly improved the productivity of our front-end teams as they can now easily plug and play components from a common library."</p>
          <cite>Vipin Vijayan, Product Owner</cite>
        </blockquote>
      </div>
    </>
  ),
};

export default function FoxPage() {
  return <CaseStudyTemplate data={data} />;
}
