import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

type Props = {
  beliefId: string;
  titre: string;
  texte_court: string;
  paradigme: 'A' | 'B';
  onActivate?: () => void;
};

export default function BeliefCard({ beliefId, titre, texte_court, paradigme, onActivate }: Props) {
  const { activeBeliefs, activateBelief } = useGameStore();
  const isActive = activeBeliefs.includes(beliefId);

  const handleActivate = () => {
    if (!isActive && paradigme === 'B') {
      activateBelief(beliefId);
      onActivate?.();
    }
  };

  return (
    <motion.div
      whileHover={!isActive && paradigme === 'B' ? { scale: 1.02 } : {}}
      className={`rounded-xl border-2 p-4 transition-all ${
        paradigme === 'A'
          ? 'border-red-200 bg-red-50'
          : isActive
          ? 'border-green-600 bg-green-50'
          : 'border-green-200 bg-white cursor-pointer hover:border-green-400'
      }`}
      onClick={handleActivate}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ backgroundColor: paradigme === 'A' ? '#8B1A1A' : isActive ? '#1A5C2A' : '#6B7280' }}
        >
          {paradigme === 'A' ? 'A' : isActive ? '✓' : 'B'}
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-800 mb-1">{titre}</h4>
          <p className="text-xs text-gray-600 leading-relaxed">{texte_court}</p>
          {paradigme === 'B' && !isActive && (
            <p className="text-xs text-green-600 mt-2 font-medium">
              → Cliquez pour intégrer cette croyance
            </p>
          )}
          {isActive && (
            <p className="text-xs text-green-700 mt-2 font-semibold">✓ Croyance intégrée</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
