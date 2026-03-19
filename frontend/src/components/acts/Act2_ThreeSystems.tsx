import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

const SYSTEMS = [
  {
    id: 'terre',
    label: 'Système Terre',
    icon: '🌍',
    color: '#2563EB',
    description: 'Le système physique et biologique de la planète : atmosphère, hydrosphère, biosphère, lithosphère.',
    emergences_A: ['Dérèglement climatique', 'Acidification des océans', 'Érosion des sols'],
  },
  {
    id: 'ecosystemes',
    label: 'Écosystèmes',
    icon: '🌿',
    color: '#16A34A',
    description: 'L\'ensemble des êtres vivants en interactions avec leur environnement non vivant.',
    emergences_A: ['Effondrement biodiversité', 'Perturbations des cycles hydrologiques', 'Déforestation'],
  },
  {
    id: 'socioeconomique',
    label: 'Système socio-économique',
    icon: '🏙',
    color: '#9333EA',
    description: 'L\'organisation humaine : économie, institutions, culture, technologies.',
    emergences_A: ['Inégalités croissantes', 'Fragilité financière systémique', 'Perte de sens'],
  },
];

const EMERGENCES_INDESIRABLES = [
  { id: 'e1', label: 'Dérèglement climatique', system: 'terre', severity: 'critical' },
  { id: 'e2', label: 'Effondrement biodiversité', system: 'ecosystemes', severity: 'critical' },
  { id: 'e3', label: 'Inégalités extrêmes', system: 'socioeconomique', severity: 'high' },
  { id: 'e4', label: 'Épuisement des ressources', system: 'terre', severity: 'high' },
  { id: 'e5', label: 'Crises sanitaires', system: 'socioeconomique', severity: 'medium' },
  { id: 'e6', label: 'Fragmentation sociale', system: 'socioeconomique', severity: 'medium' },
];

type Props = {
  onComplete: () => void;
};

export default function Act2_ThreeSystems({ onComplete }: Props) {
  const [mappedSystems, setMappedSystems] = useState<Set<string>>(new Set());
  const [identifiedEmergences, setIdentifiedEmergences] = useState<Set<string>>(new Set());
  const { completeAct, setAct } = useGameStore();

  const mapSystem = (id: string) => {
    setMappedSystems((prev) => new Set(Array.from(prev).concat(id)));
  };

  const toggleEmergence = (id: string) => {
    setIdentifiedEmergences((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const canComplete = mappedSystems.size === 3 && identifiedEmergences.size >= 3;

  const handleComplete = () => {
    completeAct(2);
    setAct(3);
    onComplete();
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="text-sm font-semibold uppercase tracking-widest text-purple-600 mb-2">Acte 2</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Les 3 grands systèmes</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Le monde tel qu'il fonctionne aujourd'hui repose sur trois systèmes imbriqués.
          Cartographiez-les, puis identifiez leurs émergences indésirables.
        </p>
      </motion.div>

      {/* Step 1: Map the 3 systems */}
      <div>
        <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
          Cartographiez les 3 systèmes
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {SYSTEMS.map((sys) => {
            const isMapped = mappedSystems.has(sys.id);
            return (
              <motion.div
                key={sys.id}
                whileHover={!isMapped ? { scale: 1.01 } : {}}
                className={`rounded-xl border-2 p-4 transition-all cursor-pointer ${
                  isMapped
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-400'
                }`}
                style={isMapped ? { borderColor: sys.color, backgroundColor: `${sys.color}10` } : {}}
                onClick={() => mapSystem(sys.id)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{sys.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800 flex items-center gap-2">
                      {sys.label}
                      {isMapped && <span className="text-green-600 text-sm">✓ Cartographié</span>}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{sys.description}</p>
                    {isMapped && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 font-medium">Trajectoire Système A :</p>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {sys.emergences_A.map((e) => (
                            <span key={e} className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                              {e}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Identify undesirable emergences */}
      {mappedSystems.size === 3 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="bg-red-100 text-red-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            Identifiez les émergences indésirables (sélectionnez au moins 3)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {EMERGENCES_INDESIRABLES.map((em) => {
              const isSelected = identifiedEmergences.has(em.id);
              const system = SYSTEMS.find((s) => s.id === em.system)!;
              return (
                <motion.button
                  key={em.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleEmergence(em.id)}
                  className={`rounded-xl border-2 p-3 text-left transition-all ${
                    isSelected
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-white hover:border-red-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{system.icon}</span>
                    <span className="text-sm font-medium text-gray-800">{em.label}</span>
                    {isSelected && <span className="ml-auto text-red-500">⚠</span>}
                  </div>
                  <div
                    className="mt-1 text-xs font-semibold"
                    style={{ color: em.severity === 'critical' ? '#DC2626' : em.severity === 'high' ? '#C87A2A' : '#6B7280' }}
                  >
                    {em.severity === 'critical' ? '● Critique' : em.severity === 'high' ? '● Élevé' : '● Modéré'}
                  </div>
                </motion.button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {identifiedEmergences.size}/6 identifiées (minimum 3 requis)
          </p>
        </motion.div>
      )}

      {/* Insight */}
      {identifiedEmergences.size >= 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl bg-amber-50 border border-amber-300 p-4"
        >
          <p className="text-amber-800 font-semibold mb-2">💡 Observation systémique</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            Ces émergences ne sont pas des accidents — elles sont la conséquence logique des règles
            et croyances du Système A. Pour changer les émergences, il faut changer les règles.
            Pour changer les règles durablement, il faut changer les croyances.
          </p>
          <p className="text-amber-600 text-sm mt-2 font-medium">
            "On ne peut pas attendre d'un système qu'il se comporte différemment de ce pour quoi il a été conçu."
          </p>
        </motion.div>
      )}

      {canComplete && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <button
            onClick={handleComplete}
            className="px-8 py-3 rounded-xl text-white font-bold text-base shadow-md hover:shadow-lg transition-all"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            Passer à l'Acte 3 : Déconstruire le Système A →
          </button>
        </motion.div>
      )}
    </div>
  );
}
