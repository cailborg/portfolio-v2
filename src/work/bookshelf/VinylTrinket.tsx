const STEMS = [
  { xPct: 50, height: 118, delay: 0,    leaves: [16, 36, 56, 76] },
  { xPct: 34, height: 102, delay: -0.7, leaves: [18, 42, 64]     },
  { xPct: 66, height: 108, delay: -1.4, leaves: [16, 40, 62]     },
  { xPct: 20, height: 82,  delay: -2.1, leaves: [20, 48, 72]     },
  { xPct: 80, height: 86,  delay: -2.8, leaves: [18, 46, 70]     },
];

export function VinylTrinket() {
  return (
    <div className="trinket-wrapper">
      <div className="trinket-plant">
        <div className="trinket-plant__foliage">
          {STEMS.map((stem, si) => (
            <div
              key={si}
              className="tp-stem"
              style={{
                left: `${stem.xPct}%`,
                height: `${stem.height}px`,
                animationDelay: `${stem.delay}s`,
              }}
            >
              {stem.leaves.map((level, li) => (
                <div key={li} className="tp-leaf-pair" style={{ bottom: `${level}%` }}>
                  <div className="tp-leaf tp-leaf--left" />
                  <div className="tp-leaf tp-leaf--right" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="trinket-plant__pot">
          <div className="trinket-plant__pot-rim" />
          <div className="trinket-plant__pot-body" />
        </div>
      </div>
    </div>
  );
}
