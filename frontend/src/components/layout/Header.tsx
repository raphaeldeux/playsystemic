import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useUIStore } from '../../store/uiStore';

const ACT_LABELS = [
  'L\'enquête systémique',
  'Les 3 grands systèmes',
  'Déconstruire le Système A',
  'Construire le Système B',
  'Mon rôle dans la transition',
];

export default function Header() {
  const { currentAct, completedActs, score } = useGameStore();
  const { toggleGlossary, toggleScenarios, showScenarios } = useUIStore();

  const progress = ((currentAct - 1) / 5) * 100;

  return (
    <header
      className="flex flex-col gap-0 shadow-sm z-10"
      style={{ backgroundColor: 'var(--color-accent)' }}
    >
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="text-white">
            <div className="font-bold text-base leading-tight">PlaySystemic</div>
            <div className="text-blue-200 text-xs">Fresque Systémique interactive</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-center">
          <div className="hidden sm:flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((act) => (
              <div
                key={act}
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
                  completedActs.includes(act)
                    ? 'bg-green-500 text-white'
                    : act === currentAct
                    ? 'bg-white text-blue-800'
                    : 'bg-blue-700 text-blue-300'
                }`}
              >
                {completedActs.includes(act) ? '✓' : act}
              </div>
            ))}
          </div>
          <div className="text-white text-xs sm:hidden font-medium">
            Acte {currentAct}/5
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleScenarios}
            className={`px-2 py-1 rounded text-xs font-medium transition-all ${
              showScenarios ? 'bg-blue-300 text-blue-900' : 'bg-blue-700 text-blue-200 hover:bg-blue-600'
            }`}
          >
            Scénarios
          </button>
          <button
            onClick={toggleGlossary}
            className="px-2 py-1 rounded text-xs font-medium bg-blue-700 text-blue-200 hover:bg-blue-600 transition-all"
          >
            Glossaire
          </button>
          <div className="hidden sm:flex items-center gap-1 bg-blue-700 rounded px-2 py-1">
            <span className="text-blue-200 text-xs">Score</span>
            <span className="text-white text-xs font-bold">{score.coherence}</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-blue-900">
        <div
          className="h-full bg-green-400 transition-all duration-500"
          style={{ width: `${Math.max(5, progress)}%` }}
        />
      </div>

      {/* Current act label */}
      <div className="px-4 py-1 bg-blue-800 text-blue-100 text-xs">
        <span className="font-semibold">Acte {currentAct} :</span> {ACT_LABELS[currentAct - 1]}
      </div>
    </header>
  );
}
