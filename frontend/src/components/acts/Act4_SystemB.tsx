import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { detectInconsistencies, detectSynergies } from '../../engine/coherence';

import croyancesB from '../../data/cards/lot7_croyances_B.json';
import pratiques from '../../data/cards/lot9_pratiques.json';
import { ActiveCard } from '../../engine/types';

const FAMILLE_LABELS: Record<string, string> = {
  besoins: 'Besoins', ressources: 'Ressources', valeur: 'Valeur',
  production: 'Production', organisation: 'Organisation', echanges: 'Échanges',
};

type Step = 'beliefs' | 'practices' | 'coherence';
type Props = { onComplete: () => void };

export default function Act4_SystemB({ onComplete }: Props) {
  const [step, setStep] = useState<Step>('beliefs');
  const { completeAct, setAct, familyChoices, activeBeliefs, activePractices, activateBelief, activatePractice } = useGameStore();

  const inconsistencies = detectInconsistencies({ familyChoices } as any);
  const synergies = detectSynergies({ familyChoices } as any);

  const canStep2 = activeBeliefs.length >= 3;
  const canFinish = activePractices.length >= 2;

  const STEPS: { id: Step; label: string }[] = [
    { id: 'beliefs', label: 'Croyances B' },
    { id: 'practices', label: 'Pratiques' },
    { id: 'coherence', label: 'Cohérence' },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">Acte 4</div>
        <h2 className="text-2xl font-black text-white mb-2">Construire le Système B</h2>
        <p className="text-slate-400 text-sm">Croyances → Règles → Pratiques régénératives.</p>
      </motion.div>

      {/* Step tabs */}
      <div className="flex rounded-xl overflow-hidden border border-slate-700/50 bg-slate-900/50">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => {
              if (s.id === 'practices' && !canStep2) return;
              if (s.id === 'coherence' && !canFinish) return;
              setStep(s.id);
            }}
            className={`flex-1 py-2.5 text-xs font-bold transition-all ${i > 0 ? 'border-l border-slate-700/50' : ''} ${
              step === s.id
                ? 'bg-emerald-900/60 text-emerald-300'
                : (s.id === 'practices' && !canStep2) || (s.id === 'coherence' && !canFinish)
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* STEP 1: Beliefs */}
        {step === 'beliefs' && (
          <motion.div key="beliefs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            <p className="text-sm text-slate-400 leading-relaxed">
              Intégrez les croyances actualisées du Système B. Elles déverrouilleront le plein effet des pratiques régénératives.
            </p>
            {croyancesB.map(belief => {
              const isActive = activeBeliefs.includes(belief.id);
              return (
                <motion.div
                  key={belief.id}
                  whileHover={!isActive ? { scale: 1.01 } : {}}
                  onClick={() => !isActive && activateBelief(belief.id)}
                  className={`
                    rounded-2xl border-2 p-4 transition-all
                    ${isActive
                      ? 'border-emerald-700/60 bg-emerald-950/30 cursor-default'
                      : 'border-slate-700/50 bg-slate-800/30 cursor-pointer hover:border-emerald-800/60 hover:bg-emerald-950/20'}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${
                      isActive ? 'bg-emerald-700 text-white' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {isActive ? '✓' : 'B'}
                    </div>
                    <div>
                      <p className={`font-semibold text-sm leading-snug ${isActive ? 'text-emerald-300' : 'text-slate-200'}`}>
                        "{belief.titre}"
                      </p>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{belief.texte_court}</p>
                      {!isActive && (
                        <p className="text-xs text-emerald-500 mt-2 font-semibold">→ Cliquez pour intégrer</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div className="rounded-xl bg-slate-800/40 border border-slate-700/30 p-3 flex items-center justify-between">
              <span className="text-sm text-slate-400">Croyances intégrées</span>
              <span className="text-emerald-400 font-bold">{activeBeliefs.length} / 6</span>
            </div>
            {canStep2 && (
              <button onClick={() => setStep('practices')}
                className="w-full py-3 rounded-2xl text-white font-bold text-sm bg-emerald-800 hover:bg-emerald-700 transition-all"
              >
                Passer aux pratiques régénératives →
              </button>
            )}
          </motion.div>
        )}

        {/* STEP 2: Practices */}
        {step === 'practices' && (
          <motion.div key="practices" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Activez les pratiques du Lot 9 (min. 2)</p>
              <span className="text-emerald-400 font-bold text-sm">{activePractices.length}/{(pratiques as any[]).length}</span>
            </div>

            {Object.keys(FAMILLE_LABELS).map(famille => {
              const fps = (pratiques as any[]).filter(p => p.famille === famille);
              return (
                <div key={famille}>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                    {FAMILLE_LABELS[famille]}
                  </p>
                  <div className="flex flex-col gap-2">
                    {fps.map((p: any) => {
                      const isActive = activePractices.includes(p.id);
                      const mainEff = Object.entries(p.effets_indicateurs)[0] as [string, any];
                      return (
                        <motion.div
                          key={p.id}
                          whileHover={!isActive ? { scale: 1.005 } : {}}
                          onClick={() => {
                            if (isActive) return;
                            const cards: ActiveCard[] = [{
                              cardId: p.id, activatedAt: 0,
                              effects: Object.entries(p.effets_indicateurs).map(([indicatorId, eff]: any) => ({
                                indicatorId, delta: eff.delta, delayYears: eff.delayYears, duration: 'permanent',
                              })),
                            }];
                            activatePractice(p.id, cards);
                          }}
                          className={`
                            rounded-xl border p-3 transition-all cursor-pointer
                            ${isActive
                              ? 'border-emerald-700/50 bg-emerald-950/25 cursor-default'
                              : 'border-slate-700/40 bg-slate-800/20 hover:border-emerald-800/50 hover:bg-emerald-950/15'}
                          `}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className={`text-sm font-semibold leading-snug ${isActive ? 'text-emerald-300' : 'text-slate-200'}`}>
                                {p.titre}
                              </p>
                              <p className="text-xs text-slate-500 mt-1 leading-snug">{p.texte_court}</p>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              {isActive
                                ? <span className="text-emerald-400 text-lg">✓</span>
                                : <span className="text-slate-600 text-lg">+</span>
                              }
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900/60 text-slate-500 border border-slate-700/40">
                              Délai {p.delayYears} ans
                            </span>
                            {mainEff && (
                              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                                mainEff[1].delta > 0
                                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40'
                                  : 'bg-red-950/40 text-red-400 border-red-900/40'
                              }`}>
                                {mainEff[1].delta > 0 ? '+' : ''}{Math.round(mainEff[1].delta * 100)}% {mainEff[0]}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {canFinish && (
              <button onClick={() => setStep('coherence')}
                className="w-full py-3 rounded-2xl text-white font-bold text-sm bg-emerald-800 hover:bg-emerald-700 transition-all mt-2"
              >
                Vérifier la cohérence →
              </button>
            )}
          </motion.div>
        )}

        {/* STEP 3: Coherence */}
        {step === 'coherence' && (
          <motion.div key="coherence" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            <h3 className="font-bold text-white text-base">Cohérence systémique</h3>

            {inconsistencies.length > 0 && (
              <div>
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-2">⚠ Tensions détectées</p>
                {inconsistencies.map(inc => (
                  <div key={inc.id} className="rounded-xl bg-amber-950/30 border border-amber-800/40 p-3 mb-2">
                    <p className="text-sm text-amber-300 leading-relaxed">{inc.message}</p>
                  </div>
                ))}
              </div>
            )}

            {synergies.length > 0 && (
              <div>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-2">✦ Synergies activées</p>
                {synergies.map(syn => (
                  <div key={syn.id} className="rounded-xl bg-emerald-950/30 border border-emerald-800/40 p-3 mb-2">
                    <p className="text-sm text-emerald-300 leading-relaxed">{syn.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Summary table */}
            <div className="rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="bg-slate-800/60 px-3 py-2 grid grid-cols-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                <span>Famille</span><span className="text-center">Choix</span>
              </div>
              {Object.entries(familyChoices).map(([famille, choice]) => (
                <div key={famille} className="px-3 py-2 grid grid-cols-2 border-t border-slate-800/60 items-center">
                  <span className="text-sm text-slate-300">{FAMILLE_LABELS[famille]}</span>
                  <div className="flex justify-center">
                    <span className={`px-3 py-0.5 rounded-full text-xs font-black ${
                      choice === 'C' ? 'bg-emerald-900/60 text-emerald-300' :
                      choice === 'B' ? 'bg-amber-900/60 text-amber-300' :
                      choice === 'A' ? 'bg-red-900/60 text-red-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {choice ?? '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => { completeAct(4); setAct(5); onComplete(); }}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-sm bg-emerald-700 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-900/50"
            >
              Acte 5 : Mon rôle dans la transition →
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
