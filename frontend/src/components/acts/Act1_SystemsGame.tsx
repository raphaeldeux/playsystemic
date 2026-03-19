import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

type Concept = 'elements' | 'regles' | 'emergences' | 'boucles';

const CONCEPTS: Record<Concept, { label: string; icon: string; color: string; description: string; example: string }> = {
  elements: {
    label: 'Éléments',
    icon: '⬡',
    color: '#2563EB',
    description: 'Les parties constitutives d\'un système : acteurs, ressources, stocks.',
    example: 'Forêt : arbres, sol, eau, animaux, champignons, microorganismes.',
  },
  regles: {
    label: 'Règles',
    icon: '⚙',
    color: '#9333EA',
    description: 'Les flux et interactions qui relient les éléments entre eux.',
    example: 'Les arbres captent le carbone. Les champignons échangent des nutriments avec les racines.',
  },
  emergences: {
    label: 'Émergences',
    icon: '✦',
    color: '#16A34A',
    description: 'Propriétés du système absentes de chaque élément pris séparément.',
    example: 'La résilience d\'une forêt face aux incendies — aucun arbre seul ne l\'a.',
  },
  boucles: {
    label: 'Boucles',
    icon: '↻',
    color: '#C87A2A',
    description: 'Les effets qui reviennent influencer leurs propres causes.',
    example: 'Plus d\'arbres → plus d\'évapotranspiration → plus de pluie → plus d\'arbres.',
  },
};

const BOUCLES_EXAMPLES = [
  { type: 'dég.', text: 'Sécheresse → moins de zones humides → moins de rétention → plus de sécheresse', color: '#DC2626' },
  { type: 'rég.', text: 'Restauration → meilleure rétention → moins de sécheresses → plus de zones humides', color: '#16A34A' },
];

type Props = { onComplete: () => void };

export default function Act1_SystemsGame({ onComplete }: Props) {
  const [unlocked, setUnlocked] = useState<Set<Concept>>(new Set());
  const [active, setActive] = useState<Concept | null>(null);
  const { completeAct, setAct } = useGameStore();

  const unlock = (c: Concept) => {
    setUnlocked(prev => new Set(Array.from(prev).concat(c)));
    setActive(c);
  };

  const allDone = unlocked.size === 4;

  return (
    <div className="flex flex-col gap-6">
      {/* Act header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">Acte 1</div>
        <h2 className="text-2xl font-black text-white mb-2">L'enquête systémique</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Maîtrisez les 4 concepts de la pensée systémique sur un exemple concret avant de jouer avec les grands systèmes.
        </p>
      </motion.div>

      {/* Concept grid */}
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(CONCEPTS) as Concept[]).map(c => {
          const info = CONCEPTS[c];
          const isActive = active === c;
          const isDone = unlocked.has(c);
          return (
            <motion.button
              key={c}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => unlock(c)}
              className={`
                rounded-2xl border-2 p-4 text-left transition-all relative overflow-hidden
                ${isActive
                  ? 'border-transparent shadow-lg'
                  : isDone
                  ? 'border-slate-700/80'
                  : 'border-slate-700/40 hover:border-slate-600 bg-slate-800/30'}
              `}
              style={isDone ? {
                backgroundColor: `${info.color}18`,
                borderColor: `${info.color}50`,
                boxShadow: isActive ? `0 0 20px ${info.color}30` : undefined,
              } : {}}
            >
              {isDone && isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              )}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{info.icon}</span>
                <span
                  className={`font-bold text-sm ${isDone ? '' : 'text-slate-400'}`}
                  style={isDone ? { color: info.color } : {}}
                >
                  {info.label}
                </span>
                {isDone && <span className="ml-auto text-xs" style={{ color: info.color }}>✓</span>}
              </div>
              {!isDone && <p className="text-xs text-slate-500">Cliquez pour explorer →</p>}
              {isDone && <p className="text-xs text-slate-400 leading-snug">{info.description}</p>}
            </motion.button>
          );
        })}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border p-5"
            style={{
              backgroundColor: `${CONCEPTS[active].color}12`,
              borderColor: `${CONCEPTS[active].color}40`,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{CONCEPTS[active].icon}</span>
              <h4 className="font-bold text-base text-white">{CONCEPTS[active].label}</h4>
            </div>
            <p className="text-sm text-slate-300 mb-3">{CONCEPTS[active].description}</p>
            <div className="rounded-xl bg-slate-900/60 p-3">
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Exemple — Système eau d'un territoire</p>
              {active === 'boucles' ? (
                <div className="flex flex-col gap-2">
                  {BOUCLES_EXAMPLES.map((b, i) => (
                    <div key={i} className="rounded-lg p-2 text-xs" style={{ backgroundColor: `${b.color}18` }}>
                      <span className="font-bold" style={{ color: b.color }}>{b.type} </span>
                      <span className="text-slate-300">{b.text}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-300">{CONCEPTS[active].example}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress + CTA */}
      <div className="flex items-center gap-3">
        {(Object.keys(CONCEPTS) as Concept[]).map(c => (
          <div
            key={c}
            className="flex-1 h-1 rounded-full transition-all duration-500"
            style={{ backgroundColor: unlocked.has(c) ? CONCEPTS[c].color : '#1e293b' }}
          />
        ))}
      </div>

      {allDone && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="rounded-2xl bg-emerald-950/40 border border-emerald-700/40 p-4 mb-4">
            <p className="text-emerald-400 font-bold mb-1">✓ Vocabulaire systémique maîtrisé</p>
            <p className="text-emerald-300/80 text-sm">
              Ces 4 concepts sont vos outils pour comprendre comment le monde fonctionne — et comment il pourrait fonctionner autrement.
            </p>
          </div>
          <button
            onClick={() => { completeAct(1); setAct(2); onComplete(); }}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/50"
          >
            Acte 2 : Les 3 grands systèmes →
          </button>
        </motion.div>
      )}
    </div>
  );
}
