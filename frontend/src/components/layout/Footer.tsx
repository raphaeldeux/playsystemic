import React from 'react';
import { useGameStore } from '../../store/gameStore';

export default function Footer() {
  const { score } = useGameStore();

  return (
    <footer
      className="flex items-center justify-between px-4 py-2 text-xs border-t"
      style={{ backgroundColor: 'var(--color-light)', borderColor: '#E5E7EB', color: 'var(--color-mid)' }}
    >
      <div className="flex items-center gap-4">
        <span>
          Cohérence : <strong>{score.coherence}</strong>
        </span>
        <span>
          Transition : <strong>{score.transition}</strong>
        </span>
        <span>
          Systémique : <strong>{score.systemic}</strong>
        </span>
      </div>
      <div className="text-gray-400">
        Basé sur la{' '}
        <a
          href="https://fresquesystemique.org"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600"
        >
          Fresque Systémique v5.3.1
        </a>{' '}
        · CC BY-NC-ND
      </div>
    </footer>
  );
}
