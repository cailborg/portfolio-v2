import CaseStudyTemplate, { CaseStudyData } from '../CaseStudyTemplate';

const data: CaseStudyData = {
  title: 'Fanterpreter',
  year: '2018',
  client: 'CrownBet',
  involvement: ['Branding', 'Illustration', 'Web Design', 'Animation'],
  overview: 'An interactive tool that matched NRL and AFL fans with their NBA equivalent — generating $1M+ in direct betting revenue at a 16:1 ROI.',
  peekImage: { src: '/images/fanterpreter/hero.jpg', alt: 'Fanterpreter — CrownBet Campaign' },
  body: [
    "Tasked with increasing betting around the NBA Playoffs, I designed a tool to find your equivalent basketball team to root for, based on your favourite NRL or AFL team.",
    "The visual style had to be fun, use no official branding, and be modular to accommodate the thousands of team combinations — with the ability to roll the tool out for other sports. I also created a full set of NRL and AFL jerseys for use on the site and in shareable social images.",
    "This award-winning project generated direct betting revenue of $1,066,400 at an ROI of 16:1. More people made bets, and customers who engaged placed an average of 7× more bets.",
  ],
  impact: [
    '$1,066,400 in direct betting revenue generated',
    '16:1 return on campaign investment',
    'Custom jersey illustrations for every NRL, AFL, and NBA team',
    'Customers who engaged placed an average of 7× more bets',
  ],
  gallery: (
    <>
      <figure className="cs-gallery__item">
        <img src="/images/fanterpreter/website-1.jpg" alt="Fanterpreter — team matching interface" />
      </figure>
      <div className="cs-gallery__row cs-gallery__row--2up">
        <figure>
          <img src="/images/fanterpreter/website-2.jpg" alt="Fanterpreter — result screen" />
        </figure>
        <figure>
          <img src="/images/fanterpreter/website-3.jpg" alt="Fanterpreter — result screen variant" />
        </figure>
      </div>
      <figure className="cs-gallery__item">
        <img src="/images/fanterpreter/website-4.jpg" alt="Fanterpreter — mobile experience" />
      </figure>
      <figure className="cs-gallery__item">
        <img src="/images/fanterpreter/website-5.jpg" alt="Fanterpreter — social share screens" />
      </figure>
      <div className="cs-gallery__row cs-gallery__row--2up">
        <figure>
          <img src="/images/fanterpreter/jerseys.png" alt="Custom jersey illustrations" />
          <figcaption>Custom jersey set — all NRL, AFL, and NBA teams</figcaption>
        </figure>
        <figure>
          <img src="/images/fanterpreter/social.jpg" alt="Shareable social images" />
          <figcaption>Modular visual system for shareable social content</figcaption>
        </figure>
      </div>
      <figure className="cs-gallery__item">
        <img src="/images/fanterpreter/animation.gif" alt="Fanterpreter — animation demo" />
        <figcaption>Motion and animation throughout the experience</figcaption>
      </figure>
    </>
  ),
};

export default function FanterpreterPage() {
  return <CaseStudyTemplate data={data} />;
}
