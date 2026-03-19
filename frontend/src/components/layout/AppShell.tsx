import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import Header from './Header';
import Glossary from './Glossary';
import CurvesPanel from '../dashboard/CurvesPanel';
// eslint-disable-next-line react/jsx-pascal-case
import Act1SystemsGame from '../acts/Act1_SystemsGame';
// eslint-disable-next-line react/jsx-pascal-case
import Act2ThreeSystems from '../acts/Act2_ThreeSystems';
// eslint-disable-next-line react/jsx-pascal-case
import Act3SystemA from '../acts/Act3_SystemA';
// eslint-disable-next-line react/jsx-pascal-case
import Act4SystemB from '../acts/Act4_SystemB';
// eslint-disable-next-line react/jsx-pascal-case
import Act5MyRole from '../acts/Act5_MyRole';

const ACT_BG: Record<number, string> = {
  1: 'from-slate-900 to-blue-950',
  2: 'from-slate-900 to-indigo-950',
  3: 'from-slate-900 to-red-950',
  4: 'from-slate-900 to-green-950',
  5: 'from-slate-900 to-blue-950',
};

export default function AppShell() {
  const { currentAct } = useGameStore();
  const [showCurves, setShowCurves] = useState(false);
  const [_actKey, setActKey] = useState(0);

  const handleActComplete = () => setActKey((k) => k + 1);

  const renderAct = () => {
    switch (currentAct) {
      case 1: return <Act1SystemsGame onComplete={handleActComplete} />;
      case 2: return <Act2ThreeSystems onComplete={handleActComplete} />;
      case 3: return <Act3SystemA onComplete={handleActComplete} />;
      case 4: return <Act4SystemB onComplete={handleActComplete} />;
      case 5: return <Act5MyRole onComplete={handleActComplete} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950">
      <Header onToggleCurves={() => setShowCurves(v => !v)} showCurves={showCurves} />

      <div className="flex flex-1 overflow-hidden">

        {/* ── Panneau gauche : jeu ── */}
        <div
          className={`flex-1 overflow-y-auto bg-gradient-to-br ${ACT_BG[currentAct]} transition-all duration-700`}
        >
          {/* Fond texturé subtil */}
          <div
            className="min-h-full px-4 py-6 sm:px-8 sm:py-8"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.02) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.02) 0%, transparent 60%)',
            }}
          >
            <div className="max-w-2xl mx-auto">
              {renderAct()}
            </div>
          </div>
        </div>

        {/* ── Panneau droit : courbes (desktop toujours visible, mobile drawer) ── */}
        <div
          className={`
            bg-slate-900 border-l border-slate-700/50
            transition-all duration-300 overflow-hidden
            hidden lg:flex flex-col
            ${showCurves ? 'w-[460px]' : 'w-[420px]'}
          `}
        >
          <CurvesPanel />
        </div>

        {/* ── Mobile : drawer courbes ── */}
        {showCurves && (
          <div
            className="lg:hidden fixed inset-0 z-30"
            onClick={() => setShowCurves(false)}
          >
            <div className="absolute inset-0 bg-black/60" />
            <div
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-slate-900 shadow-2xl overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <CurvesPanel />
            </div>
          </div>
        )}
      </div>

      <Glossary />
    </div>
  );
}
