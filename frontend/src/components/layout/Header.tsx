import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useUIStore } from '../../store/uiStore';

const ACT_LABELS = [
  { short: 'Enquête', long: 'L\'enquête systémique' },
  { short: '3 Systèmes', long: 'Les 3 grands systèmes' },
  { short: 'Système A', long: 'Déconstruire le Système A' },
  { short: 'Système B', long: 'Construire le Système B' },
  { short: 'Mon rôle', long: 'Mon rôle dans la transition' },
];

const ACT_COLORS: Record<number, string> = {
  1: '#2563EB',
  2: '#7C3AED',
  3: '#DC2626',
  4: '#16A34A',
  5: '#2563EB',
};

type Props = {
  onToggleCurves: () => void;
  showCurves: boolean;
};

export default function Header({ onToggleCurves, showCurves }: Props) {
  const { currentAct, completedActs, score, resetGame } = useGameStore();
  const { toggleGlossary } = useUIStore();

  const actColor = ACT_COLORS[currentAct];

  return (
    <header className="flex-shrink-0 bg-slate-950 border-b border-slate-800">
      <div className="flex items-center gap-4 px-4 h-14">

        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
            style={{ backgroundColor: actColor }}
          >
            FS
          </div>
          <span className="text-white font-bold text-sm hidden sm:block">PlaySystemic</span>
        </div>

        {/* Act stepper */}
        <div className="flex items-center gap-1 flex-1 justify-center">
          {ACT_LABELS.map((act, i) => {
            const actNum = i + 1;
            const isDone = completedActs.includes(actNum);
            const isCurrent = actNum === currentAct;
            return (
              <React.Fragment key={actNum}>
                {i > 0 && (
                  <div
                    className="hidden sm:block h-px flex-1 max-w-6 transition-all duration-500"
                    style={{ backgroundColor: isDone || isCurrent ? actColor : '#334155' }}
                  />
                )}
                <div
                  className={`relative flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300 flex-shrink-0 ${
                    isCurrent
                      ? 'w-7 h-7 text-white shadow-lg shadow-current/30'
                      : isDone
                      ? 'w-6 h-6 text-white'
                      : 'w-6 h-6 text-slate-500'
                  }`}
                  style={{
                    backgroundColor: isCurrent
                      ? actColor
                      : isDone
                      ? actColor + '80'
                      : '#1e293b',
                    boxShadow: isCurrent ? `0 0 12px ${actColor}60` : undefined,
                  }}
                  title={act.long}
                >
                  {isDone ? '✓' : actNum}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Current act label — desktop */}
        <div className="hidden md:flex flex-col items-center flex-shrink-0">
          <span className="text-slate-400 text-xs">Acte {currentAct}</span>
          <span className="text-white text-xs font-semibold leading-tight">
            {ACT_LABELS[currentAct - 1].short}
          </span>
        </div>

        {/* Score chips */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg px-2 py-1">
            <span className="text-slate-400 text-xs">Score</span>
            <span
              className="text-xs font-bold"
              style={{ color: actColor }}
            >
              {score.coherence}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onToggleCurves}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all lg:hidden ${
              showCurves
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            📈 Courbes
          </button>
          <button
            onClick={toggleGlossary}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
          >
            Glossaire
          </button>
          <button
            onClick={resetGame}
            className="px-2 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
            title="Recommencer"
          >
            ↺
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-slate-800">
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.max(2, ((currentAct - 1) / 5) * 100)}%`,
            backgroundColor: actColor,
            boxShadow: `0 0 8px ${actColor}`,
          }}
        />
      </div>
    </header>
  );
}
