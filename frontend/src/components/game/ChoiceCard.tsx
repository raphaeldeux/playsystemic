import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChoiceData, ChoiceOption, FamilyId, ActiveCard } from '../../engine/types';
import { useGameStore } from '../../store/gameStore';

type Props = {
  choice: ChoiceData;
  onComplete: () => void;
};

type OptionConfig = {
  letter: string;
  tag: string;
  tagColor: string;
  borderColor: string;
  bgColor: string;
  selectedBg: string;
  selectedText: string;
  glowColor: string;
  icon: string;
};

const OPTION_CONFIG: Record<ChoiceOption, OptionConfig> = {
  A: {
    letter: 'A',
    tag: 'Système A — Dégénératif',
    tagColor: 'text-red-400',
    borderColor: 'border-red-900/60',
    bgColor: 'bg-red-950/30',
    selectedBg: 'bg-red-900',
    selectedText: 'text-red-100',
    glowColor: 'shadow-red-900/50',
    icon: '↘',
  },
  B: {
    letter: 'B',
    tag: 'Réforme incrémentale',
    tagColor: 'text-amber-400',
    borderColor: 'border-amber-800/50',
    bgColor: 'bg-amber-950/20',
    selectedBg: 'bg-amber-900',
    selectedText: 'text-amber-100',
    glowColor: 'shadow-amber-900/50',
    icon: '→',
  },
  C: {
    letter: 'C',
    tag: 'Système B — Régénératif',
    tagColor: 'text-emerald-400',
    borderColor: 'border-emerald-800/50',
    bgColor: 'bg-emerald-950/20',
    selectedBg: 'bg-emerald-900',
    selectedText: 'text-emerald-100',
    glowColor: 'shadow-emerald-900/50',
    icon: '↗',
  },
};

export default function ChoiceCard({ choice, onComplete }: Props) {
  const [selected, setSelected] = useState<ChoiceOption | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const { makeChoice, activeBeliefs, familyChoices } = useGameStore();

  const alreadyChosen = familyChoices[choice.famille as FamilyId];

  if (alreadyChosen && !selected) {
    const cfg = OPTION_CONFIG[alreadyChosen];
    return (
      <div className={`rounded-xl border ${cfg.borderColor} ${cfg.bgColor} px-4 py-3 flex items-center gap-3`}>
        <span className={`text-xl ${cfg.tagColor}`}>{cfg.icon}</span>
        <div>
          <span className={`text-xs font-semibold uppercase tracking-wide ${cfg.tagColor}`}>{cfg.tag}</span>
          <p className="text-slate-400 text-xs mt-0.5">Choix enregistré</p>
        </div>
        <span className="ml-auto text-slate-500 text-xs">✓</span>
      </div>
    );
  }

  const handleSelect = (option: ChoiceOption) => {
    if (selected) return;
    setSelected(option);
    const optionData = option === 'A' ? choice.choix_A : option === 'B' ? choice.choix_B : choice.choix_C;
    const halfEffect = option === 'C' && choice.choix_C.croyance_requise && !activeBeliefs.includes(choice.choix_C.croyance_requise!);
    const cards: ActiveCard[] = [{
      cardId: choice.id,
      activatedAt: 0,
      effects: optionData.effets.map(e => ({
        indicatorId: e.indicatorId,
        delta: halfEffect ? e.delta * 0.5 : e.delta,
        delayYears: e.delayYears,
        duration: 'permanent',
        requiresBeliefId: option === 'C' ? choice.choix_C.croyance_requise : undefined,
      })),
    }];
    makeChoice(choice.famille as FamilyId, option, cards);
    setShowFeedback(true);
  };

  const feedbackData = selected
    ? (selected === 'A' ? choice.choix_A : selected === 'B' ? choice.choix_B : choice.choix_C)
    : null;

  return (
    <div className="flex flex-col gap-2">
      {/* Context */}
      <div className="rounded-xl bg-slate-800/60 border border-slate-700/50 p-4 mb-1">
        <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-2">Situation</p>
        <p className="text-slate-300 text-sm leading-relaxed">{choice.contexte}</p>
        <p className="text-white font-semibold text-base mt-3 leading-snug">{choice.question}</p>
      </div>

      {/* Options A / B / C */}
      {(['A', 'B', 'C'] as ChoiceOption[]).map((option) => {
        const cfg = OPTION_CONFIG[option];
        const data = option === 'A' ? choice.choix_A : option === 'B' ? choice.choix_B : choice.choix_C;
        const isSelected = selected === option;
        const isDimmed = selected !== null && !isSelected;
        const needsBelief = option === 'C' && data.croyance_requise && !activeBeliefs.includes(data.croyance_requise!);

        return (
          <motion.button
            key={option}
            onClick={() => handleSelect(option)}
            disabled={!!selected}
            whileHover={!selected ? { scale: 1.01, y: -1 } : {}}
            whileTap={!selected ? { scale: 0.99 } : {}}
            className={`
              w-full text-left rounded-xl border-2 p-4 transition-all duration-200 relative overflow-hidden
              ${isSelected
                ? `${cfg.selectedBg} border-transparent shadow-lg ${cfg.glowColor}`
                : isDimmed
                ? 'opacity-30 border-slate-800 bg-slate-900/40'
                : `${cfg.bgColor} ${cfg.borderColor} hover:border-opacity-100`
              }
              disabled:cursor-default
            `}
          >
            {/* Background shine on selected */}
            {isSelected && (
              <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent pointer-events-none" />
            )}

            <div className="flex items-start gap-4 relative">
              {/* Letter badge */}
              <div className={`
                flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-black text-lg
                ${isSelected ? 'bg-white/20 text-white' : `bg-slate-800 ${cfg.tagColor}`}
              `}>
                {cfg.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                  isSelected ? cfg.selectedText : cfg.tagColor
                }`}>
                  {cfg.tag}
                </div>
                <div className={`text-sm font-semibold leading-snug ${
                  isSelected ? 'text-white' : 'text-slate-200'
                }`}>
                  {data.label}
                </div>

                {/* Belief hints */}
                {option === 'A' && data.croyance_id && !isSelected && !isDimmed && (
                  <div className="mt-2 text-xs text-slate-500 italic">
                    Croyance sous-jacente : Lot 6
                  </div>
                )}
                {needsBelief && !isSelected && !isDimmed && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-amber-400/80">
                    <span>⚠</span> Croyance B non activée — effet ×0.5
                  </div>
                )}
                {option === 'C' && data.croyance_requise && activeBeliefs.includes(data.croyance_requise!) && !isDimmed && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
                    <span>✓</span> Croyance B active — plein effet
                  </div>
                )}
              </div>

              {/* Effects preview */}
              {!isDimmed && !selected && data.effets.length > 0 && (
                <div className="flex-shrink-0 flex flex-col gap-0.5 items-end">
                  {data.effets.slice(0, 3).map((e, i) => (
                    <span key={i} className={`text-xs font-mono font-semibold ${
                      e.delta > 0 ? 'text-emerald-400' : e.delta < 0 ? 'text-red-400' : 'text-slate-500'
                    }`}>
                      {e.delta > 0 ? '+' : ''}{Math.round(e.delta * 100)}%
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.button>
        );
      })}

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && selected && feedbackData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            <div className={`
              rounded-xl p-4 border-l-4 mt-1
              ${selected === 'A'
                ? 'bg-red-950/40 border-red-600'
                : selected === 'B'
                ? 'bg-amber-950/40 border-amber-500'
                : 'bg-emerald-950/40 border-emerald-500'}
            `}>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">
                Analyse systémique
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">{feedbackData.feedback}</p>
              <button
                onClick={() => { setShowFeedback(false); onComplete(); }}
                className="mt-4 px-5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold transition-all"
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
