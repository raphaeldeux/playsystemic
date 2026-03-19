import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import Header from './Header';
import Footer from './Footer';
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

export default function AppShell() {
  const { currentAct } = useGameStore();
  const [_actKey, setActKey] = useState(0);

  const handleActComplete = () => {
    setActKey((k) => k + 1);
  };

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
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-light)' }}>
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Main game area */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderAct()}
        </div>

        {/* Curves panel — sidebar on desktop */}
        <div
          className="hidden lg:flex w-[420px] border-l border-gray-200 bg-white overflow-hidden"
          style={{ borderColor: '#E5E7EB' }}
        >
          <div className="flex-1 p-3 overflow-hidden flex flex-col">
            <CurvesPanel />
          </div>
        </div>
      </div>

      <Footer />
      <Glossary />
    </div>
  );
}
