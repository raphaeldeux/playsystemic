import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';

const TERMS = [
  { term: 'Émergence', def: 'Propriété d\'un système absente de chaque élément pris séparément. La conscience n\'est dans aucun neurone isolé.' },
  { term: 'Boucle renforçante', def: 'Rétroaction qui amplifie un changement. Peut être dégénérative (spirale vers le bas) ou régénérative.' },
  { term: 'Boucle équilibrante', def: 'Rétroaction qui ramène un système vers un état cible. Assure la stabilité et la résilience.' },
  { term: 'Tipping point', def: 'Point de bascule au-delà duquel le système change de régime de façon difficile ou impossible à inverser.' },
  { term: 'Délai de latence', def: 'Temps entre une intervention et ses effets visibles. Source fréquente d\'erreurs de pilotage.' },
  { term: 'Système A', def: 'Paradigme dégénératif : Avoir = être, Nature infinie, Individus indépendants, Hiérarchies, Compétition.' },
  { term: 'Système B', def: 'Paradigme régénératif : Richesse ≠ possession, Terre finie, Interdépendances, Réseaux, Symbiose.' },
  { term: 'Réforme incrémentale', def: 'Changement dans les règles du Système A sans changer les croyances fondatrices. Ralentit sans inverser.' },
  { term: 'Résilience systémique', def: 'Capacité d\'un système à absorber des perturbations, s\'adapter et se réorganiser tout en conservant ses fonctions.' },
  { term: 'Communs', def: 'Ressources gérées collectivement selon des règles définies par la communauté (Ostrom, 1990).' },
];

export default function Glossary() {
  const { showGlossary, toggleGlossary } = useUIStore();

  return (
    <AnimatePresence>
      {showGlossary && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 cursor-pointer"
            onClick={toggleGlossary}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
              <h3 className="font-bold text-white">Glossaire systémique</h3>
              <button onClick={toggleGlossary} className="text-slate-400 hover:text-white transition-colors text-xl leading-none">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
              {TERMS.map(t => (
                <div key={t.term} className="border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-sm text-white mb-1">{t.term}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{t.def}</p>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-slate-800 text-xs text-slate-600">
              Basé sur la Fresque Systémique v5.3.1 · CC BY-NC-ND
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
