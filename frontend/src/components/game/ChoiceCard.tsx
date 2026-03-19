import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChoiceData, ChoiceOption, FamilyId } from '../../engine/types';
import { useGameStore } from '../../store/gameStore';
import { useUIStore } from '../../store/uiStore';
import { ActiveCard } from '../../engine/types';

type Props = {
  choice: ChoiceData;
  onComplete: () => void;
};

const OPTION_STYLES: Record<ChoiceOption, { border: string; bg: string; label: string; icon: string }> = {
  A: {
    border: 'border-red-700',
    bg: 'bg-red-50 hover:bg-red-100',
    label: 'Système A — Dégénératif',
    icon: '↓',
  },
  B: {
    border: 'border-amber-500',
    bg: 'bg-amber-50 hover:bg-amber-100',
    label: 'Réforme incrémentale',
    icon: '→',
  },
  C: {
    border: 'border-green-700',
    bg: 'bg-green-50 hover:bg-green-100',
    label: 'Système B — Régénératif',
    icon: '↑',
  },
};

export default function ChoiceCard({ choice, onComplete }: Props) {
  const [selected, setSelected] = useState<ChoiceOption | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const { makeChoice, activeBeliefs, familyChoices } = useGameStore();
  const { showFeedbackMessage } = useUIStore();

  const alreadyChosen = familyChoices[choice.famille as FamilyId];

  const handleSelect = (option: ChoiceOption) => {
    if (selected) return;
    setSelected(option);

    const optionData = option === 'A' ? choice.choix_A : option === 'B' ? choice.choix_B : choice.choix_C;

    // Check belief requirement for C
    if (option === 'C' && choice.choix_C.croyance_requise && !activeBeliefs.includes(choice.choix_C.croyance_requise)) {
      // Apply with 50% effectiveness
      const cards: ActiveCard[] = [
        {
          cardId: choice.id,
          activatedAt: 0,
          effects: optionData.effets.map((e) => ({
            indicatorId: e.indicatorId,
            delta: e.delta * 0.5,
            delayYears: e.delayYears,
            duration: 'permanent',
            requiresBeliefId: choice.choix_C.croyance_requise,
          })),
        },
      ];
      makeChoice(choice.famille as FamilyId, option, cards);
    } else {
      const cards: ActiveCard[] = [
        {
          cardId: choice.id,
          activatedAt: 0,
          effects: optionData.effets.map((e) => ({
            indicatorId: e.indicatorId,
            delta: e.delta,
            delayYears: e.delayYears,
            duration: 'permanent',
          })),
        },
      ];
      makeChoice(choice.famille as FamilyId, option, cards);
    }

    showFeedbackMessage(optionData.feedback);
    setShowFeedback(true);
  };

  const handleContinue = () => {
    setShowFeedback(false);
    onComplete();
  };

  if (alreadyChosen && !selected) {
    return (
      <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-4 text-center text-gray-400 text-sm">
        Choix effectué : <strong>{alreadyChosen}</strong> — {OPTION_STYLES[alreadyChosen].label}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Context */}
      <div className="p-4 border-b border-gray-100" style={{ backgroundColor: 'var(--color-accent-light)' }}>
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Situation</p>
        <p className="text-sm text-gray-700 leading-relaxed">{choice.contexte}</p>
        <p className="mt-2 font-semibold text-base" style={{ color: 'var(--color-accent)' }}>
          {choice.question}
        </p>
      </div>

      {/* Options */}
      <div className="p-4 flex flex-col gap-3">
        {(['A', 'B', 'C'] as ChoiceOption[]).map((option) => {
          const data = option === 'A' ? choice.choix_A : option === 'B' ? choice.choix_B : choice.choix_C;
          const style = OPTION_STYLES[option];
          const isSelected = selected === option;
          const isOther = selected !== null && selected !== option;

          return (
            <motion.button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              whileHover={!selected ? { scale: 1.01 } : {}}
              whileTap={!selected ? { scale: 0.99 } : {}}
              className={`w-full text-left rounded-lg border-2 p-3 transition-all ${style.bg} ${style.border} ${
                isSelected ? 'ring-2 ring-offset-1 ring-blue-400' : ''
              } ${isOther ? 'opacity-40' : ''} disabled:cursor-default`}
            >
              <div className="flex items-start gap-3">
                <span
                  className="text-lg font-bold w-6 flex-shrink-0"
                  style={{
                    color: option === 'A' ? '#8B1A1A' : option === 'B' ? '#C87A2A' : '#1A5C2A',
                  }}
                >
                  {style.icon}
                </span>
                <div className="flex-1">
                  <div
                    className="text-xs font-semibold uppercase tracking-wide mb-1"
                    style={{
                      color: option === 'A' ? '#8B1A1A' : option === 'B' ? '#C87A2A' : '#1A5C2A',
                    }}
                  >
                    {style.label}
                  </div>
                  <div className="text-sm font-medium text-gray-800">{data.label}</div>
                  {option === 'A' && data.croyance_id && (
                    <div className="mt-1 text-xs text-gray-400 italic">
                      Croyance sous-jacente : voir Lot 6
                    </div>
                  )}
                  {option === 'C' && data.croyance_requise && (
                    <div className="mt-1 text-xs text-gray-500 italic flex items-center gap-1">
                      {activeBeliefs.includes(data.croyance_requise!) ? (
                        <><span className="text-green-600">✓</span> Croyance B activée — plein effet</>
                      ) : (
                        <><span className="text-amber-500">⚠</span> Croyance B non encore activée — effet ×0.5</>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className={`px-4 pb-4`}
          >
            <div
              className={`rounded-lg p-4 border-l-4 ${
                selected === 'A'
                  ? 'bg-red-50 border-red-600'
                  : selected === 'B'
                  ? 'bg-amber-50 border-amber-500'
                  : 'bg-green-50 border-green-700'
              }`}
            >
              <p className="text-sm font-semibold mb-1 text-gray-700">Analyse systémique</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {selected === 'A'
                  ? choice.choix_A.feedback
                  : selected === 'B'
                  ? choice.choix_B.feedback
                  : choice.choix_C.feedback}
              </p>
              <button
                onClick={handleContinue}
                className="mt-3 px-4 py-2 rounded-lg text-white text-sm font-medium"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                Continuer →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
