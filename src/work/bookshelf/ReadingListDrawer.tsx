import { motion } from 'framer-motion';

interface Book {
  title: string;
  author: string;
  cover: string;
  blurb: string;
}

const READING: Book[] = [
  {
    title: 'Chronicles of DOOM',
    author: 'S.H. Fernando Jr.',
    cover: '/images/books/chronicles-of-doom.jpg',
    blurb:
      'An authorised biography tracing the rise, mystique, and mythology of MF DOOM — hip-hop\'s most enigmatic villain and one of its most technically gifted MCs and producers.',
  },
  {
    title: 'Dilla Time',
    author: 'Dan Charnas',
    cover: '/images/books/dilla-time.jpg',
    blurb:
      'The definitive account of James Dewitt Yancey\'s life and genius — exploring how the Detroit producer quietly rewired the rhythm of modern music and why his influence only deepens after death.',
  },
];

const panelSpring = { type: 'spring' as const, stiffness: 280, damping: 30 };

interface Props {
  onDismiss: () => void;
}

export function ReadingListDrawer({ onDismiss }: Props) {
  return (
    <motion.div
      className="rl-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="rl-backdrop" onClick={onDismiss} aria-hidden="true" />
      <motion.div
        className="rl-panel"
        initial={{ x: 420 }}
        animate={{ x: 0 }}
        exit={{ x: 420 }}
        transition={panelSpring}
        role="dialog"
        aria-label="Currently reading"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rl-panel__header">
          <span className="rl-panel__label">Currently Reading</span>
          <button
            className="rl-close"
            onClick={onDismiss}
            aria-label="Close reading list"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="rl-panel__books">
          {READING.map((book) => (
            <div key={book.title} className="rl-book">
              <div className="rl-book__cover">
                <img src={book.cover} alt={`Cover of ${book.title}`} />
              </div>
              <div className="rl-book__info">
                <p className="rl-book__author">{book.author}</p>
                <h3 className="rl-book__title">{book.title}</h3>
                <p className="rl-book__blurb">{book.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
