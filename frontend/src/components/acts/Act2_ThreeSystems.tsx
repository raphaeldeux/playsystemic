import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

const SYSTEMS = [
  {
    id: 'terre', label: 'Système Terre', icon: '🌍', color: '#2563EB',
    description: 'Atmosphère, hydrosphère, biosphère, lithosphère.',
    emergences: ['Dérèglement climatique', 'Acidification des océans', 'Érosion des sols'],
  },
  {
    id: 'ecosystemes', label: 'Écosystèmes', icon: '🌿', color: '#16A34A',
    description: 'Êtres vivants en interaction avec leur milieu abiotique.',
    emergences: ['Effondrement biodiversité', 'Perturbations hydrologiques', 'Déforestation'],
  },
  {
    id: 'socioeconomique', label: 'Système socio-éco.', icon: '🏙', color: '#9333EA',
    description: 'Économie, institutions, culture, technologies.',
    emergences: ['Inégalités croissantes', 'Fragilité financière', 'Perte de sens'],
  },
];

const EMERGENCES = [
  { id: 'e1', label: 'Dérèglement climatique', system: 'terre', sev: 2 },
  { id: 'e2', label: 'Effondrement biodiversité', system: 'ecosystemes', sev: 2 },
  { id: 'e3', label: 'Inégalités extrêmes', system: 'socioeconomique', sev: 1 },
  { id: 'e4', label: 'Épuisement des ressources', system: 'terre', sev: 1 },
  { id: 'e5', label: 'Crises sanitaires', system: 'socioeconomique', sev: 0 },
  { id: 'e6', label: 'Fragmentation sociale', system: 'socioeconomique', sev: 0 },
];

type Props = { onComplete: () => void };

export default function Act2_ThreeSystems({ onComplete }: Props) {
  const [mapped, setMapped] = useState<Set<string>>(new Set());
  const [identified, setIdentified] = useState<Set<string>>(new Set());
  const { completeAct, setAct } = useGameStore();

  const canComplete = mapped.size === 3 && identified.size >= 3;

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">Acte 2</div>
        <h2 className="text-2xl font-black text-white mb-2">Les 3 grands systèmes</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Le monde repose sur 3 systèmes imbriqués. Cartographiez-les, puis identifiez leurs émergences indésirables.
        </p>
      </motion.div>

      {/* Step 1 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-purple-900/60 border border-purple-700/50 flex items-center justify-center text-xs font-bold text-purple-300">1</div>
          <span className="text-slate-300 text-sm font-semibold">Cartographiez les 3 systèmes</span>
        </div>
        <div className="flex flex-col gap-2">
          {SYSTEMS.map(sys => {
            const isMapped = mapped.has(sys.id);
            return (
              <motion.div
                key={sys.id}
                whileHover={!isMapped ? { scale: 1.005 } : {}}
                onClick={() => setMapped(prev => new Set(Array.from(prev).concat(sys.id)))}
                className={`
                  rounded-2xl border-2 p-4 cursor-pointer transition-all
                  ${isMapped ? 'border-transparent' : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600'}
                `}
                style={isMapped ? {
                  backgroundColor: `${sys.color}15`,
                  borderColor: `${sys.color}50`,
                  boxShadow: `0 0 20px ${sys.color}18`,
                } : {}}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{sys.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white text-sm">{sys.label}</span>
                      {isMapped && <span className="text-xs font-semibold" style={{ color: sys.color }}>✓ Cartographié</span>}
                    </div>
                    <p className="text-xs text-slate-400">{sys.description}</p>
                    {isMapped && (
                      <div className="flex gap-1.5 flex-wrap mt-2">
                        {sys.emergences.map(e => (
                          <span key={e} className="text-xs px-2 py-0.5 rounded-full bg-red-950/50 text-red-400 border border-red-900/40">
                            {e}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Step 2 */}
      {mapped.size === 3 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-red-900/60 border border-red-700/50 flex items-center justify-center text-xs font-bold text-red-300">2</div>
            <span className="text-slate-300 text-sm font-semibold">Identifiez les émergences indésirables <span className="text-slate-500">(min. 3)</span></span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {EMERGENCES.map(em => {
              const isSelected = identified.has(em.id);
              const sys = SYSTEMS.find(s => s.id === em.system)!;
              const sevLabel = em.sev === 2 ? 'Critique' : em.sev === 1 ? 'Élevé' : 'Modéré';
              const sevColor = em.sev === 2 ? '#DC2626' : em.sev === 1 ? '#C87A2A' : '#6B7280';
              return (
                <motion.button
                  key={em.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIdentified(prev => {
                    const n = new Set(prev);
                    n.has(em.id) ? n.delete(em.id) : n.add(em.id);
                    return n;
                  })}
                  className={`
                    rounded-xl border-2 p-3 text-left transition-all
                    ${isSelected ? 'border-red-600/60 bg-red-950/30' : 'border-slate-700/50 bg-slate-800/20 hover:border-slate-600'}
                  `}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm">{sys.icon}</span>
                    <span className="text-sm text-slate-200 font-medium">{em.label}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: sevColor }}>{sevLabel}</span>
                  {isSelected && <span className="float-right text-red-400">⚠</span>}
                </motion.button>
              );
            })}
          </div>
          <p className="text-xs text-slate-600 mt-2">{identified.size}/6 identifiées</p>
        </motion.div>
      )}

      {/* Insight */}
      {identified.size >= 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl bg-amber-950/30 border border-amber-800/40 p-4"
        >
          <p className="text-amber-400 font-bold text-sm mb-2">💡 Observation clé</p>
          <p className="text-amber-300/80 text-sm leading-relaxed">
            Ces émergences ne sont pas des accidents — elles sont la conséquence logique des règles du Système A.
            Pour changer les émergences, il faut changer les règles. Pour changer les règles durablement, il faut changer les croyances.
          </p>
        </motion.div>
      )}

      {canComplete && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button
            onClick={() => { completeAct(2); setAct(3); onComplete(); }}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm bg-purple-700 hover:bg-purple-600 transition-all shadow-lg shadow-purple-900/50"
          >
            Acte 3 : Déconstruire le Système A →
          </button>
        </motion.div>
      )}
    </div>
  );
}
