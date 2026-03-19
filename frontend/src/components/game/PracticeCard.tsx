import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { ActiveCard } from '../../engine/types';

type PracticeData = {
  id: string;
  titre: string;
  texte_court: string;
  famille: string;
  delayYears: number;
  effets_indicateurs: Record<string, { delta: number; delayYears: number }>;
};

type Props = {
  practice: PracticeData;
};

export default function PracticeCard({ practice }: Props) {
  const { activePractices, activatePractice } = useGameStore();
  const isActive = activePractices.includes(practice.id);

  const handleActivate = () => {
    if (isActive) return;
    const cards: ActiveCard[] = [
      {
        cardId: practice.id,
        activatedAt: 0,
        effects: Object.entries(practice.effets_indicateurs).map(([indicatorId, eff]) => ({
          indicatorId: indicatorId as any,
          delta: eff.delta,
          delayYears: eff.delayYears,
          duration: 'permanent',
        })),
      },
    ];
    activatePractice(practice.id, cards);
  };

  const mainEffect = Object.entries(practice.effets_indicateurs)[0];
  const effectSign = mainEffect && mainEffect[1].delta > 0 ? '+' : '';

  return (
    <motion.div
      whileHover={!isActive ? { scale: 1.02, y: -2 } : {}}
      whileTap={!isActive ? { scale: 0.98 } : {}}
      onClick={handleActivate}
      className={`rounded-xl border-2 p-3 transition-all ${
        isActive
          ? 'border-green-600 bg-green-50 cursor-default'
          : 'border-gray-200 bg-white cursor-pointer hover:border-green-400 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-800 leading-tight">{practice.titre}</h4>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{practice.texte_court}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          {isActive ? (
            <span className="text-green-600 text-lg">✓</span>
          ) : (
            <span className="text-gray-300 text-lg">+</span>
          )}
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: '#1A5C2A20', color: '#1A5C2A' }}
        >
          Délai : {practice.delayYears} ans
        </span>
        {mainEffect && (
          <span className="text-xs text-gray-500">
            {effectSign}{Math.round(mainEffect[1].delta * 100)}% {mainEffect[0]}
          </span>
        )}
      </div>
    </motion.div>
  );
}
