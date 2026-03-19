import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { INDICATORS } from '../../engine/indicators';

const BERKANA_ROLES = [
  { id: 'nommer', label: 'Nommer', icon: '🔍', color: '#2563EB',
    description: 'Identifier et mettre des mots sur ce qui émerge de nouveau.',
    question: 'Qu\'est-ce que vous voyez émerger autour de vous qui mérite d\'être nommé ?' },
  { id: 'relier', label: 'Relier', icon: '🕸', color: '#9333EA',
    description: 'Tisser des liens entre les initiatives, les personnes, les idées.',
    question: 'Qui ou quoi avez-vous envie de connecter ?' },
  { id: 'nourrir', label: 'Nourrir', icon: '🌱', color: '#16A34A',
    description: 'Prendre soin de ce qui émerge. Protéger les initiatives fragiles.',
    question: 'Qu\'est-ce qui a besoin de votre soin pour grandir ?' },
  { id: 'illuminer', label: 'Illuminer', icon: '✨', color: '#C87A2A',
    description: 'Rendre visible ce qui fonctionne. Célébrer, partager, inspirer.',
    question: 'Qu\'est-ce que vous avez envie de rendre plus visible ?' },
];

const BADGES = [
  { id: 'systemic_thinker', label: 'Penseur·euse systémique', icon: '🧠',
    desc: 'Compréhension des interconnexions systémiques.',
    cond: (s: any) => s.coherence > 60 },
  { id: 'commons_weaver', label: 'Tisseuse de communs', icon: '🕸',
    desc: 'Gouvernance des communs choisie pour les échanges.',
    cond: (_s: any, c: any) => c.echanges === 'C' },
  { id: 'resilience_builder', label: 'Architecte de la résilience', icon: '🏗',
    desc: 'Indicateurs sur trajectoire régénérative.',
    cond: (s: any) => s.transition > 50 },
  { id: 'careful', label: 'Gardien·ne du vivant', icon: '🌿',
    desc: 'Boucles équilibrantes activées.',
    cond: (s: any) => s.systemic > 50 },
];

type Props = { onComplete: () => void };

export default function Act5_MyRole({ onComplete }: Props) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showBilan, setShowBilan] = useState(false);
  const { score, familyChoices, indicators, completeAct, resetGame } = useGameStore();

  const unlockedBadges = BADGES.filter(b => b.cond(score, familyChoices));
  const getVal = (id: string, y: number) => {
    const arr = indicators[id as keyof typeof indicators] as number[];
    return arr?.[y] ?? arr?.[arr.length - 1] ?? 0.4;
  };

  const nbC = Object.values(familyChoices).filter(c => c === 'C').length;
  const nbB = Object.values(familyChoices).filter(c => c === 'B').length;
  const nbA = Object.values(familyChoices).filter(c => c === 'A').length;

  if (showBilan) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
        <div className="text-center py-2">
          <div className="text-5xl mb-3">🌍</div>
          <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">Bilan final</div>
          <h2 className="text-2xl font-black text-white">Votre trajectoire systémique</h2>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Cohérence', value: score.coherence, color: '#2B4C7E' },
            { label: 'Transition', value: score.transition, color: '#1A5C2A' },
            { label: 'Systémique', value: score.systemic, color: '#9333EA' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl bg-slate-800/60 border border-slate-700/40 p-3 text-center">
              <div className="text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Indicator table */}
        <div className="rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="grid grid-cols-4 bg-slate-800/60 px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
            <span>Indicateur</span><span className="text-center">Initial</span>
            <span className="text-center">An 50</span><span className="text-center">An 100</span>
          </div>
          {INDICATORS.map(ind => {
            const v0 = getVal(ind.id, 0);
            const v50 = getVal(ind.id, 50);
            const v100 = getVal(ind.id, 100);
            const up = v100 > v0;
            return (
              <div key={ind.id} className="grid grid-cols-4 px-3 py-2 border-t border-slate-800/60 items-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ind.color }} />
                  <span className="text-xs text-slate-300 leading-tight">{ind.label.split(' ')[0]}</span>
                </div>
                <span className="text-center text-xs font-mono text-slate-500">{Math.round(v0 * 100)}%</span>
                <span className="text-center text-xs font-mono text-slate-400">{Math.round(v50 * 100)}%</span>
                <span className={`text-center text-xs font-black font-mono ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {Math.round(v100 * 100)}% {up ? '↑' : '↓'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Badges */}
        {unlockedBadges.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Badges débloqués</p>
            <div className="grid grid-cols-2 gap-2">
              {unlockedBadges.map(b => (
                <motion.div
                  key={b.id} initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="rounded-xl bg-blue-950/40 border border-blue-800/40 p-3 flex items-center gap-2"
                >
                  <span className="text-xl">{b.icon}</span>
                  <div>
                    <div className="font-bold text-xs text-blue-300">{b.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{b.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Narrative */}
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/40 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Récit de votre session</p>
          <p className="text-sm text-slate-300 leading-relaxed">
            {nbC} choix régénératifs · {nbB} réformes · {nbA} maintiens du Système A.
            {nbC >= 4
              ? " Votre trajectoire dessine une transition systémique significative. Les boucles équilibrantes activées produiront leurs effets sur le long terme."
              : nbC >= 2
              ? " Transition partielle engagée. Les réformes ralentissent la dégradation sans l'inverser. Chaque famille basculée en C amplifie l'effet des autres."
              : " La trajectoire reste majoritairement Système A. Les émergences dégénératives en sont la conséquence logique. Le changement commence par les croyances."
            }
          </p>
        </div>

        <button onClick={resetGame}
          className="w-full py-3 rounded-2xl text-slate-300 font-bold text-sm border border-slate-700 hover:border-slate-500 hover:text-white transition-all"
        >
          ↺ Rejouer
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">Acte 5</div>
        <h2 className="text-2xl font-black text-white mb-2">Mon rôle dans la transition</h2>
        <p className="text-slate-400 text-sm">Quel est votre rôle dans ce mouvement de transition ?</p>
      </motion.div>

      {/* Berkana */}
      <div className="rounded-2xl bg-slate-800/40 border border-slate-700/40 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Double boucle de l'Institut Berkana</p>
        <p className="text-sm text-slate-400 mb-4">4 rôles pour faire grandir les initiatives régénératives.</p>
        <div className="grid grid-cols-2 gap-2">
          {BERKANA_ROLES.map(role => {
            const isSelected = selectedRole === role.id;
            return (
              <motion.button
                key={role.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRole(isSelected ? null : role.id)}
                className={`rounded-xl border-2 p-3 text-left transition-all ${
                  isSelected ? 'border-transparent shadow-md' : 'border-slate-700/50 bg-slate-900/30 hover:border-slate-600'
                }`}
                style={isSelected ? { backgroundColor: `${role.color}20`, borderColor: `${role.color}60`, boxShadow: `0 0 16px ${role.color}25` } : {}}
              >
                <div className="text-xl mb-1">{role.icon}</div>
                <div className="font-bold text-sm text-white mb-1">{role.label}</div>
                <p className="text-xs text-slate-400 leading-tight">{role.description}</p>
                {isSelected && (
                  <p className="text-xs font-semibold mt-2 italic" style={{ color: role.color }}>
                    {role.question}
                  </p>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Badges preview */}
      {unlockedBadges.length > 0 && (
        <div className="rounded-2xl bg-slate-800/40 border border-slate-700/40 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
            {unlockedBadges.length} badge{unlockedBadges.length > 1 ? 's' : ''} débloqué{unlockedBadges.length > 1 ? 's' : ''}
          </p>
          <div className="flex gap-2 flex-wrap">
            {unlockedBadges.map(b => <span key={b.id} className="text-sm">{b.icon} {b.label}</span>)}
          </div>
        </div>
      )}

      <button
        onClick={() => { completeAct(5); setShowBilan(true); }}
        className="w-full py-3.5 rounded-2xl text-white font-bold text-sm bg-blue-700 hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/50"
      >
        Voir mon bilan final →
      </button>
    </div>
  );
}
