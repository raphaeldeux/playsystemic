import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import ChoiceCard from '../game/ChoiceCard';

import choicesBesoins from '../../data/choices/famille1_besoins.json';
import choicesRessources from '../../data/choices/famille2_ressources.json';
import choicesValeur from '../../data/choices/famille3_valeur.json';
import choicesProduction from '../../data/choices/famille4_production.json';
import choicesOrganisation from '../../data/choices/famille5_organisation.json';
import choicesEchanges from '../../data/choices/famille6_echanges.json';
import croyancesA from '../../data/cards/lot6_croyances_A.json';

const ALL_CHOICES = [
  {
    famille: 'besoins',
    data: choicesBesoins,
    label: 'Besoins',
    icon: '🏥',
    competence: 'Investissement public · Services à la population',
    question: 'Retail park ou maisons de santé ?',
  },
  {
    famille: 'ressources',
    data: choicesRessources,
    label: 'Ressources',
    icon: '💧',
    competence: 'GEMAPI · Eau potable · Assainissement',
    question: 'Forage ou restauration des zones humides ?',
  },
  {
    famille: 'valeur',
    data: choicesValeur,
    label: 'Valeur',
    icon: '📊',
    competence: 'Développement économique · Indicateurs de pilotage',
    question: 'PIB local ou Tableau de Bord Territorial ?',
  },
  {
    famille: 'production',
    data: choicesProduction,
    label: 'Production',
    icon: '🌾',
    competence: 'ZAE · Politique économique locale · PAT',
    question: 'Plateforme logistique ou Pôle Alimentaire Territorial ?',
  },
  {
    famille: 'organisation',
    data: choicesOrganisation,
    label: 'Organisation',
    icon: '🏛',
    competence: 'Gouvernance intercommunale · Démocratie locale',
    question: 'Gouvernance présidentielle ou cercles distribués ?',
  },
  {
    famille: 'echanges',
    data: choicesEchanges,
    label: 'Échanges',
    icon: '🏠',
    competence: 'Habitat · PLH · Foncier',
    question: 'Marché libre ou communs fonciers ?',
  },
];

type Props = { onComplete: () => void };

export default function Act3_SystemA({ onComplete }: Props) {
  const [idx, setIdx] = useState(0);
  const [emotionPause, setEmotionPause] = useState(false);
  const [pauseDone, setPauseDone] = useState(false);
  const { completeAct, setAct, familyChoices } = useGameStore();

  const current = ALL_CHOICES[idx];
  const completedCount = Object.values(familyChoices).filter(v => v !== null).length;
  const croyanceA = croyancesA.find(c => c.famille === current?.famille);

  const handleChoiceComplete = () => {
    if (idx === 2 && !pauseDone) { setEmotionPause(true); return; }
    if (idx < ALL_CHOICES.length - 1) { setIdx(i => i + 1); }
    else { completeAct(3); setAct(4); onComplete(); }
  };

  if (emotionPause) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
        <div className="text-center py-4">
          <div className="text-5xl mb-4">⏸</div>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Pause — mi-parcours</div>
          <h3 className="text-xl font-black text-white mb-4">Que ressentez-vous ?</h3>
        </div>
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/50 p-5">
          <p className="text-slate-300 leading-relaxed mb-4">
            Vous venez de prendre les 3 premières décisions pour Val-Florès. Investissements, eau, indicateurs de valeur.
          </p>
          <p className="text-lg font-semibold text-amber-300 italic text-center py-3">
            "Face aux acteurs réels, aux pressions, aux contraintes budgétaires — qu'avez-vous ressenti ?"
          </p>
          <p className="text-slate-400 text-sm mt-4 leading-relaxed">
            Frustration face aux résistances ? Tentation du compromis ? Soulagement de choisir C ? Inquiétude face aux délais ?
            Ces émotions sont des données systémiques. Elles révèlent les forces qui maintiennent le Système A en place — et celles qui peuvent l'en faire sortir.
          </p>
        </div>
        <button
          onClick={() => { setEmotionPause(false); setPauseDone(true); setIdx(3); }}
          className="w-full py-3.5 rounded-2xl text-white font-bold text-sm bg-slate-700 hover:bg-slate-600 transition-all"
        >
          Continuer avec les familles 4, 5, 6 →
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xs font-bold uppercase tracking-widest text-red-400 mb-1">Acte 3 — Les 6 décisions</div>
        <h2 className="text-2xl font-black text-white mb-1">Quelle trajectoire pour Val-Florès ?</h2>
        <p className="text-slate-400 text-sm">
          6 compétences de votre CA. 3 options à chaque fois. Les effets se voient dans les courbes.
        </p>
      </motion.div>

      {/* Family stepper */}
      <div className="flex gap-1.5">
        {ALL_CHOICES.map((f, i) => {
          const isDone = familyChoices[f.famille as keyof typeof familyChoices] !== null;
          const isCurrent = i === idx;
          return (
            <div key={f.famille} className="flex-1 flex flex-col gap-1">
              <div className={`h-1 rounded-full transition-all duration-500 ${
                isDone ? 'bg-red-500' : isCurrent ? 'bg-red-800' : 'bg-slate-800'
              }`} />
              <span className={`text-center leading-tight transition-all ${
                isCurrent ? 'text-red-400' : isDone ? 'text-slate-500' : 'text-slate-700'
              }`} style={{ fontSize: '0.6rem' }}>
                {f.icon}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current family */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-4"
        >
          {/* Family header */}
          <div className="rounded-2xl bg-red-950/20 border border-red-900/30 px-4 py-3">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xl">{current.icon}</span>
              <div>
                <div className="text-xs text-red-400 font-bold uppercase tracking-wide">
                  Famille {idx + 1} — {current.label}
                </div>
                <p className="text-xs text-slate-500">{current.competence}</p>
              </div>
            </div>
            <p className="text-slate-200 text-sm font-semibold mt-2">{current.question}</p>
          </div>

          {/* Underlying belief */}
          {croyanceA && (
            <div className="rounded-xl bg-slate-800/50 border border-slate-700/30 p-3 flex items-start gap-3">
              <span className="text-xl flex-shrink-0">🧠</span>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-0.5">Croyance sous-jacente du Système A</p>
                <p className="text-sm font-semibold text-red-300 italic">"{croyanceA.titre}"</p>
                <p className="text-xs text-slate-400 mt-1 leading-snug">{croyanceA.texte_court}</p>
              </div>
            </div>
          )}

          {/* Choices */}
          {(current.data as any[]).map((choice: any) => (
            <ChoiceCard key={choice.id} choice={choice} onComplete={handleChoiceComplete} />
          ))}
        </motion.div>
      </AnimatePresence>

      {completedCount > 0 && (
        <p className="text-xs text-slate-600 text-center">{completedCount}/{ALL_CHOICES.length} décisions prises · Observez les courbes →</p>
      )}
    </div>
  );
}
