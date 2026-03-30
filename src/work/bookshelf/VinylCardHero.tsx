import { useMotionValue, useSpring, motion } from 'framer-motion';
import type { VinylProject } from './types';
import './vinyl.css';

interface Props {
  project: VinylProject;
}

const tiltSpring = { stiffness: 120, damping: 22 };

export function VinylCardHero({ project }: Props) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltY = useSpring(mouseX, tiltSpring);
  const tiltX = useSpring(mouseY, tiltSpring);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    e.currentTarget.style.setProperty('--sheen-x', `${x}%`);
    e.currentTarget.style.setProperty('--sheen-y', `${y}%`);
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    mouseX.set(((e.clientX - cx) / (rect.width  / 2)) * 7);
    mouseY.set(((e.clientY - cy) / (rect.height / 2)) * -5);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--sheen-x', '150%');
    e.currentTarget.style.setProperty('--sheen-y', '150%');
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div style={{ perspective: '800px' }}>
      <motion.div
        className="vinyl-record vinyl-record--hero"
        style={{ rotateX: tiltX, rotateY: tiltY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="vinyl-record__face vinyl-record__face--front">
          <div className="vinyl-record__cover">
            {project.coverImage && (
              <img
                className="vinyl-record__cover-photo"
                src={project.coverImage}
                alt=""
                aria-hidden="true"
              />
            )}
            <div className="vinyl-record__sheen" />
            <div className="vinyl-record__cover-inner">
              <div className="vinyl-record__cover-art" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
