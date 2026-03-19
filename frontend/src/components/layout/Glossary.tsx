import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';

const TERMS = [
  {
    term: 'Émergence',
    definition: 'Propriété d\'un système qui n\'existe dans aucun de ses éléments pris séparément. Ex : la conscience n\'est dans aucun neurone isolé.',
  },
  {
    term: 'Boucle renforçante',
    definition: 'Rétroaction qui amplifie un changement dans le système. Peut être dégénérative (spirale vers le bas) ou régénérative (croissance positive).',
  },
  {
    term: 'Boucle équilibrante',
    definition: 'Rétroaction qui ramène un système vers un état cible. Assure la stabilité et la résilience.',
  },
  {
    term: 'Tipping point',
    definition: 'Point de bascule au-delà duquel le système change de régime de façon difficile ou impossible à inverser.',
  },
  {
    term: 'Délai de latence',
    definition: 'Temps qui s\'écoule entre une intervention et ses effets visibles dans le système. Source fréquente d\'erreurs de pilotage.',
  },
  {
    term: 'Système A',
    definition: 'Paradigme dégénératif fondé sur : Avoir = être, Nature infinie, Individus indépendants, Hiérarchies, Compétition.',
  },
  {
    term: 'Système B',
    definition: 'Paradigme régénératif fondé sur : Richesse ≠ possession, Terre finie, Interdépendances, Réseaux, Symbiose.',
  },
  {
    term: 'Réforme incrémentale',
    definition: 'Changement dans les règles du Système A sans changer les croyances fondatrices. Ralentit la dégradation sans l\'inverser.',
  },
  {
    term: 'Résilience systémique',
    definition: 'Capacité d\'un système à absorber des perturbations, à s\'adapter et à se réorganiser tout en conservant ses fonctions essentielles.',
  },
  {
    term: 'Communs',
    definition: 'Ressources gérées collectivement selon des règles définies par la communauté (Ostrom, 1990). Alternative à la propriété privée et publique.',
  },
];

export default function Glossary() {
  const { showGlossary, toggleGlossary } = useUIStore();

  return (
    <AnimatePresence>
      {showGlossary && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={toggleGlossary}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 flex flex-col"
          >
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ backgroundColor: 'var(--color-accent-light)' }}
            >
              <h3 className="font-bold text-gray-800">Glossaire systémique</h3>
              <button onClick={toggleGlossary} className="text-gray-500 hover:text-gray-700 text-lg">
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {TERMS.map((t) => (
                <div key={t.term} className="border-b border-gray-100 pb-3">
                  <h4 className="font-semibold text-sm text-gray-800 mb-1">{t.term}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{t.definition}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
