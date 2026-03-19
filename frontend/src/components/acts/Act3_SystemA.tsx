import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import ChoiceCard from '../game/ChoiceCard';
import BeliefCard from '../game/BeliefCard';

import choicesBesoins from '../../data/choices/famille1_besoins.json';
import choicesRessources from '../../data/choices/famille2_ressources.json';
import choicesValeur from '../../data/choices/famille3_valeur.json';
import choicesProduction from '../../data/choices/famille4_production.json';
import choicesOrganisation from '../../data/choices/famille5_organisation.json';
import choicesEchanges from '../../data/choices/famille6_echanges.json';
import croyancesA from '../../data/cards/lot6_croyances_A.json';

const ALL_CHOICES = [
  { famille: 'besoins', data: choicesBesoins },
  { famille: 'ressources', data: choicesRessources },
  { famille: 'valeur', data: choicesValeur },
  { famille: 'production', data: choicesProduction },
  { famille: 'organisation', data: choicesOrganisation },
  { famille: 'echanges', data: choicesEchanges },
];

const FAMILLE_LABELS: Record<string, string> = {
  besoins: 'Famille 1 — Besoins',
  ressources: 'Famille 2 — Ressources',
  valeur: 'Famille 3 — Valeur',
  production: 'Famille 4 — Conception & Production',
  organisation: 'Famille 5 — Organisation & Gouvernance',
  echanges: 'Famille 6 — Échanges & Usage',
};

const FAMILLE_QUESTIONS: Record<string, string> = {
  besoins: 'À quels besoins humains répondons-nous prioritairement ?',
  ressources: 'Quelles sont les principales ressources de l\'activité économique ?',
  valeur: 'Quelle valeur cherche-t-on à créer ?',
  production: 'Par quels systèmes obtenons-nous nos biens et services ?',
  organisation: 'Comment s\'organiser pour produire le bien ou service ?',
  echanges: 'Comment chacun obtient ce dont il a besoin ?',
};

type Props = {
  onComplete: () => void;
};

export default function Act3_SystemA({ onComplete }: Props) {
  const [currentFamilyIndex, setCurrentFamilyIndex] = useState(0);
  const [showEmotionPause, setShowEmotionPause] = useState(false);
  const [emotionPauseDone, setEmotionPauseDone] = useState(false);
  const { completeAct, setAct, familyChoices } = useGameStore();

  const currentFamily = ALL_CHOICES[currentFamilyIndex];
  const totalFamilies = ALL_CHOICES.length;
  const completedChoices = Object.values(familyChoices).filter((v) => v !== null).length;

  const handleChoiceComplete = () => {
    if (currentFamilyIndex === 2 && !emotionPauseDone) {
      setShowEmotionPause(true);
      return;
    }
    if (currentFamilyIndex < totalFamilies - 1) {
      setCurrentFamilyIndex((i) => i + 1);
    } else {
      completeAct(3);
      setAct(4);
      onComplete();
    }
  };

  const handleEmotionContinue = () => {
    setShowEmotionPause(false);
    setEmotionPauseDone(true);
    setCurrentFamilyIndex((i) => i + 1);
  };

  // Croyance for current family
  const familyCroyanceA = croyancesA.find(
    (c) => c.famille === currentFamily?.famille
  );

  if (showEmotionPause) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-xl mx-auto text-center flex flex-col gap-6 py-8"
      >
        <div className="text-4xl">🤔</div>
        <h3 className="text-xl font-bold text-gray-800">Pause — Intégration émotionnelle</h3>
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-5">
          <p className="text-gray-700 leading-relaxed mb-4">
            Vous avez exploré les 3 premières familles de règles du Système A.
          </p>
          <p className="text-lg font-semibold text-amber-800 italic">
            "Que ressentez-vous face à ces règles et croyances ?"
          </p>
          <p className="text-gray-600 text-sm mt-3">
            Frustration, colère, résignation, curiosité ? Toutes ces réponses sont valides.
            La pensée systémique n'efface pas les émotions — elle aide à les comprendre.
          </p>
        </div>
        <p className="text-gray-600 text-sm">
          Ces règles ne sont pas des fatalités. Elles ont été construites, et elles peuvent être reconstruites.
          C'est l'objet de l'Acte 4.
        </p>
        <button
          onClick={handleEmotionContinue}
          className="mx-auto px-8 py-3 rounded-xl text-white font-bold shadow-md hover:shadow-lg transition-all"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          Continuer avec les familles 4, 5, 6 →
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="text-sm font-semibold uppercase tracking-widest text-red-700 mb-2">Acte 3</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Déconstruire le Système A</h2>
        <p className="text-gray-600 text-sm">
          Pour chaque famille de règles, faites votre choix. Observez les effets sur les indicateurs.
        </p>
      </motion.div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {ALL_CHOICES.map((f, i) => {
          const isDone = familyChoices[f.famille as keyof typeof familyChoices] !== null;
          const isCurrent = i === currentFamilyIndex;
          return (
            <div
              key={f.famille}
              className={`flex-1 h-2 rounded-full transition-all ${
                isDone ? 'bg-blue-500' : isCurrent ? 'bg-blue-200' : 'bg-gray-200'
              }`}
            />
          );
        })}
      </div>

      {/* Current family */}
      <motion.div
        key={currentFamilyIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-3"
      >
        <div>
          <h3 className="font-bold text-gray-800">
            {FAMILLE_LABELS[currentFamily.famille]}
          </h3>
          <p className="text-sm text-gray-500 italic">{FAMILLE_QUESTIONS[currentFamily.famille]}</p>
        </div>

        {familyCroyanceA && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-xs font-semibold text-red-700 uppercase mb-1">Croyance sous-jacente (Système A)</p>
            <p className="text-sm font-medium text-gray-800">{familyCroyanceA.titre}</p>
            <p className="text-xs text-gray-600 mt-1">{familyCroyanceA.texte_court}</p>
          </div>
        )}

        {currentFamily.data.map((choice: any) => (
          <ChoiceCard key={choice.id} choice={choice} onComplete={handleChoiceComplete} />
        ))}
      </motion.div>

      {completedChoices > 0 && completedChoices < totalFamilies && (
        <p className="text-xs text-gray-400 text-center">
          {completedChoices}/{totalFamilies} familles explorées
        </p>
      )}
    </div>
  );
}
