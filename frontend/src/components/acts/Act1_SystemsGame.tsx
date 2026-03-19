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
    example: 'Dans un écosystème forestier : arbres, sol, eau, animaux, champignons.',
  },
  regles: {
    label: 'Règles de fonctionnement',
    icon: '⚙',
    color: '#9333EA',
    description: 'Les flux et interactions qui relient les éléments entre eux.',
    example: 'Dans une forêt : les arbres captent le carbone, les champignons échangent des nutriments avec les racines.',
  },
  emergences: {
    label: 'Émergences',
    icon: '✦',
    color: '#16A34A',
    description: 'Les propriétés du système qui n\'existent dans aucun de ses éléments pris séparément.',
    example: 'La résilience d\'une forêt face aux incendies — aucun arbre seul n\'a cette propriété.',
  },
  boucles: {
    label: 'Boucles de rétroaction',
    icon: '↻',
    color: '#C87A2A',
    description: 'Les effets qui reviennent influencer leurs propres causes, créant des dynamiques auto-entretenues.',
    example: 'Plus d\'arbres → plus d\'évapotranspiration → plus de pluie → plus d\'arbres (boucle équilibrante).',
  },
};

const SYSTEM_EXAMPLE = {
  title: 'Le système eau d\'un territoire',
  elements: ['Rivières', 'Zones humides', 'Nappes phréatiques', 'Agriculture', 'Villes'],
  regles: [
    'L\'agriculture capte 70% de l\'eau disponible',
    'Les zones humides filtrent et stockent l\'eau',
    'Les villes imperméabilisent les sols',
  ],
  emergences: ['Disponibilité en eau potable', 'Fréquence des inondations', 'Biodiversité aquatique'],
  boucles: [
    { type: 'dégénérative', text: 'Sécheresse → moins de zones humides → moins de rétention → plus de sécheresse' },
    { type: 'régénérative', text: 'Restauration zones humides → meilleure rétention → moins de sécheresses → plus de zones humides' },
  ],
};

type Props = {
  onComplete: () => void;
};

export default function Act1_SystemsGame({ onComplete }: Props) {
  const [unlockedConcepts, setUnlockedConcepts] = useState<Set<Concept>>(new Set());
  const [activeTab, setActiveTab] = useState<Concept | null>(null);
  const { completeAct, setAct } = useGameStore();

  const unlockConcept = (concept: Concept) => {
    setUnlockedConcepts((prev) => new Set(Array.from(prev).concat(concept)));
    setActiveTab(concept);
  };

  const handleComplete = () => {
    completeAct(1);
    setAct(2);
    onComplete();
  };

  const allUnlocked = unlockedConcepts.size === 4;

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-2">Acte 1</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">L'enquête systémique</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Avant de jouer avec les grands systèmes, maîtrisez le vocabulaire de la pensée systémique.
          Explorez chaque concept sur un exemple concret.
        </p>
      </motion.div>

      {/* System example */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-blue-500">🔍</span>
          Étude de cas : {SYSTEM_EXAMPLE.title}
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(CONCEPTS) as Concept[]).map((concept) => {
            const info = CONCEPTS[concept];
            const isUnlocked = unlockedConcepts.has(concept);
            const isActive = activeTab === concept;

            return (
              <motion.button
                key={concept}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => unlockConcept(concept)}
                className={`rounded-xl border-2 p-3 text-left transition-all ${
                  isActive
                    ? 'border-blue-400 shadow-md'
                    : isUnlocked
                    ? 'border-gray-300'
                    : 'border-dashed border-gray-300 hover:border-gray-400'
                }`}
                style={isUnlocked ? { borderColor: info.color, backgroundColor: `${info.color}10` } : {}}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{info.icon}</span>
                  <span className="font-semibold text-sm" style={{ color: isUnlocked ? info.color : '#6B7280' }}>
                    {info.label}
                  </span>
                  {isUnlocked && <span className="ml-auto text-xs text-green-600">✓</span>}
                </div>
                {!isUnlocked && (
                  <p className="text-xs text-gray-400">Cliquez pour explorer</p>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Active concept detail */}
      <AnimatePresence mode="wait">
        {activeTab && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border p-4 bg-white shadow-sm"
            style={{ borderColor: CONCEPTS[activeTab].color }}
          >
            <h4 className="font-bold text-base mb-2" style={{ color: CONCEPTS[activeTab].color }}>
              {CONCEPTS[activeTab].icon} {CONCEPTS[activeTab].label}
            </h4>
            <p className="text-sm text-gray-700 mb-3">{CONCEPTS[activeTab].description}</p>
            <div
              className="rounded-lg p-3 text-sm text-gray-600"
              style={{ backgroundColor: `${CONCEPTS[activeTab].color}10` }}
            >
              <strong>Exemple — {SYSTEM_EXAMPLE.title} :</strong>
              <br />
              {activeTab === 'elements' && SYSTEM_EXAMPLE.elements.join(' · ')}
              {activeTab === 'regles' && SYSTEM_EXAMPLE.regles.join(' — ')}
              {activeTab === 'emergences' && SYSTEM_EXAMPLE.emergences.join(' · ')}
              {activeTab === 'boucles' && (
                <div className="flex flex-col gap-2 mt-1">
                  {SYSTEM_EXAMPLE.boucles.map((b, i) => (
                    <div key={i} className={`rounded p-2 text-xs ${b.type === 'dégénérative' ? 'bg-red-100' : 'bg-green-100'}`}>
                      <strong className={b.type === 'dégénérative' ? 'text-red-700' : 'text-green-700'}>
                        {b.type === 'dégénérative' ? '↘ Renforçante dégénérative' : '↗ Équilibrante régénérative'}
                      </strong>
                      <br />{b.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glossary preview */}
      {unlockedConcepts.size > 0 && (
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
          <p className="text-xs font-semibold text-blue-700 mb-2">
            Concepts déverrouillés ({unlockedConcepts.size}/4)
          </p>
          <div className="flex gap-2 flex-wrap">
            {Array.from(unlockedConcepts).map((c) => {
              const concept = CONCEPTS[c as Concept];
              return (
                <span
                  key={c}
                  className="text-xs px-2 py-1 rounded-full text-white"
                  style={{ backgroundColor: concept.color }}
                >
                  {concept.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress and CTA */}
      {allUnlocked && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="rounded-xl bg-green-50 border border-green-300 p-4 mb-4">
            <p className="text-green-800 font-semibold mb-1">✓ Vous maîtrisez le vocabulaire systémique !</p>
            <p className="text-green-700 text-sm">
              Ces 4 concepts sont vos outils pour comprendre pourquoi le monde fonctionne comme il fonctionne
              — et comment il pourrait fonctionner autrement.
            </p>
          </div>
          <button
            onClick={handleComplete}
            className="px-8 py-3 rounded-xl text-white font-bold text-base shadow-md hover:shadow-lg transition-all"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            Passer à l'Acte 2 : Les 3 grands systèmes →
          </button>
        </motion.div>
      )}
    </div>
  );
}
