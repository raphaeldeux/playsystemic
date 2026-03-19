import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import BeliefCard from '../game/BeliefCard';
import PracticeCard from '../game/PracticeCard';
import { detectInconsistencies, detectSynergies } from '../../engine/coherence';

import croyancesB from '../../data/cards/lot7_croyances_B.json';
import pratiques from '../../data/cards/lot9_pratiques.json';

const FAMILLE_LABELS: Record<string, string> = {
  besoins: '1 — Besoins',
  ressources: '2 — Ressources',
  valeur: '3 — Valeur',
  production: '4 — Production',
  organisation: '5 — Organisation',
  echanges: '6 — Échanges',
};

type Props = {
  onComplete: () => void;
};

type Step = 'beliefs' | 'practices' | 'coherence';

export default function Act4_SystemB({ onComplete }: Props) {
  const [step, setStep] = useState<Step>('beliefs');
  const [activatedBeliefs, setActivatedBeliefs] = useState<Set<string>>(new Set());
  const { completeAct, setAct, familyChoices, activeBeliefs, activePractices } = useGameStore();

  const inconsistencies = detectInconsistencies({ familyChoices } as any);
  const synergies = detectSynergies({ familyChoices } as any);

  const handleBeliefActivated = (id: string) => {
    setActivatedBeliefs((prev) => new Set(Array.from(prev).concat(id)));
  };

  const canProceedToStep2 = activeBeliefs.length >= 3;
  const canFinish = activePractices.length >= 2;

  const handleComplete = () => {
    completeAct(4);
    setAct(5);
    onComplete();
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="text-sm font-semibold uppercase tracking-widest text-green-700 mb-2">Acte 4</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Construire le Système B</h2>
        <p className="text-gray-600 text-sm">
          La transition commence par les croyances — elles déverrouillent les règles,
          qui activent les pratiques régénératives.
        </p>
      </motion.div>

      {/* Step tabs */}
      <div className="flex rounded-xl overflow-hidden border border-gray-200">
        {(['beliefs', 'practices', 'coherence'] as Step[]).map((s, i) => (
          <button
            key={s}
            onClick={() => {
              if (s === 'practices' && !canProceedToStep2) return;
              if (s === 'coherence' && !canFinish) return;
              setStep(s);
            }}
            className={`flex-1 py-2 text-xs font-semibold transition-all ${
              step === s
                ? 'bg-green-700 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            } ${i > 0 ? 'border-l border-gray-200' : ''}`}
          >
            {i + 1}. {s === 'beliefs' ? 'Croyances B' : s === 'practices' ? 'Pratiques' : 'Cohérence'}
          </button>
        ))}
      </div>

      {/* Step 1: Beliefs */}
      {step === 'beliefs' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
          <p className="text-sm text-gray-600">
            Pour chaque famille, intégrez la croyance actualisée du Système B.
            Ces croyances déverrouilleront le plein effet des règles régénératives.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {croyancesB.map((belief) => (
              <BeliefCard
                key={belief.id}
                beliefId={belief.id}
                titre={belief.titre}
                texte_court={belief.texte_court}
                paradigme="B"
                onActivate={() => handleBeliefActivated(belief.id)}
              />
            ))}
          </div>
          <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
            Croyances intégrées : {activeBeliefs.length}/6
          </div>
          {canProceedToStep2 && (
            <button
              onClick={() => setStep('practices')}
              className="px-6 py-2 rounded-xl text-white font-semibold text-sm mx-auto"
              style={{ backgroundColor: 'var(--color-regen)' }}
            >
              Passer aux pratiques régénératives →
            </button>
          )}
        </motion.div>
      )}

      {/* Step 2: Practices */}
      {step === 'practices' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
          <p className="text-sm text-gray-600">
            Activez les pratiques régénératives (Lot 9). Chacune a un délai de latence visible dans les courbes.
          </p>
          <div className="text-xs text-gray-500">
            Activées : {activePractices.length}/{pratiques.length} (minimum 2 requis)
          </div>

          {Object.keys(FAMILLE_LABELS).map((famille) => {
            const familePratiques = pratiques.filter((p: any) => p.famille === famille);
            return (
              <div key={famille}>
                <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wide mb-2">
                  Famille {FAMILLE_LABELS[famille]}
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {familePratiques.map((p: any) => (
                    <PracticeCard key={p.id} practice={p} />
                  ))}
                </div>
              </div>
            );
          })}

          {canFinish && (
            <button
              onClick={() => setStep('coherence')}
              className="px-6 py-2 rounded-xl text-white font-semibold text-sm mx-auto mt-2"
              style={{ backgroundColor: 'var(--color-regen)' }}
            >
              Vérifier la cohérence systémique →
            </button>
          )}
        </motion.div>
      )}

      {/* Step 3: Coherence analysis */}
      {step === 'coherence' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
          <h3 className="font-bold text-gray-800">Analyse de cohérence systémique</h3>

          {inconsistencies.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-amber-700 mb-2">⚠ Tensions détectées</h4>
              {inconsistencies.map((inc) => (
                <div key={inc.id} className="rounded-lg bg-amber-50 border border-amber-200 p-3 mb-2">
                  <p className="text-sm text-amber-800">{inc.message}</p>
                </div>
              ))}
            </div>
          )}

          {synergies.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-green-700 mb-2">✦ Synergies activées</h4>
              {synergies.map((syn) => (
                <div key={syn.id} className="rounded-lg bg-green-50 border border-green-200 p-3 mb-2">
                  <p className="text-sm text-green-800">{syn.message}</p>
                </div>
              ))}
            </div>
          )}

          {inconsistencies.length === 0 && synergies.length === 0 && (
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 text-sm text-gray-600 text-center">
              Pas d'analyse de cohérence disponible — complétez plus de familles en Choix C pour activer des synergies.
            </div>
          )}

          {/* Summary table */}
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 text-xs font-semibold text-gray-600">Famille</th>
                  <th className="text-center p-2 text-xs font-semibold text-gray-600">Choix</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(familyChoices).map(([famille, choice]) => (
                  <tr key={famille} className="border-t border-gray-100">
                    <td className="p-2 text-gray-700">{FAMILLE_LABELS[famille]}</td>
                    <td className="p-2 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          choice === 'C'
                            ? 'bg-green-100 text-green-700'
                            : choice === 'B'
                            ? 'bg-amber-100 text-amber-700'
                            : choice === 'A'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {choice ?? '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleComplete}
            className="px-8 py-3 rounded-xl text-white font-bold text-base shadow-md hover:shadow-lg transition-all mx-auto"
            style={{ backgroundColor: 'var(--color-regen)' }}
          >
            Passer à l'Acte 5 : Mon rôle →
          </button>
        </motion.div>
      )}
    </div>
  );
}
