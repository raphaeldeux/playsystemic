import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

const SYSTEMS = [
  {
    id: 'terre',
    label: 'Système Terre',
    sublabel: 'Le climat et les ressources physiques',
    icon: '🌍',
    color: '#2563EB',
    atValflores: 'Florès en déficit hydrique. Sols agricoles appauvris. +1,8°C depuis 1990. Nappes phréatiques en baisse depuis 7 ans.',
    emergences: ['Assecs récurrents de la Florès', 'Étiages records chaque été', 'Érosion des terres agricoles'],
  },
  {
    id: 'ecosystemes',
    label: 'Écosystèmes',
    sublabel: 'Le vivant et ses services',
    icon: '🌿',
    color: '#16A34A',
    atValflores: '12 zones humides asséchées depuis 1970. 2 espèces de poissons disparues. Forêt alluviale fragmentée. 30 % des pollinisateurs en moins.',
    emergences: ['Disparition de la biodiversité locale', 'Perte des services hydrologiques', 'Fragilité de l\'agriculture locale'],
  },
  {
    id: 'socioeconomique',
    label: 'Système socio-éco.',
    sublabel: 'L\'économie, les institutions, la culture',
    icon: '🏙',
    color: '#9333EA',
    atValflores: 'Papeterie fermée en 2021 (400 emplois). Foncier +37 % en 5 ans. 31 % de participation électorale. 67 % des agents "peu écoutés".',
    emergences: ['Désertification médicale dans 6 communes', 'Gentrification et éviction des travailleurs essentiels', 'Défiance institutionnelle record'],
  },
];

const CAUSES_PROFONDES = [
  { id: 'c1', label: 'Priorité à la croissance économique', cible: 'socioeconomique', sev: 2 },
  { id: 'c2', label: 'Nature traitée comme ressource infinie', cible: 'terre', sev: 2 },
  { id: 'c3', label: 'Gouvernance pyramidale sans citoyens', cible: 'socioeconomique', sev: 1 },
  { id: 'c4', label: 'Attractivité = entreprises exogènes', cible: 'socioeconomique', sev: 1 },
  { id: 'c5', label: 'Foncier traité comme marchandise', cible: 'socioeconomique', sev: 2 },
  { id: 'c6', label: 'Mesure du succès = PIB local', cible: 'socioeconomique', sev: 1 },
];

type Props = { onComplete: () => void };

export default function Act2_ThreeSystems({ onComplete }: Props) {
  const [mapped, setMapped] = useState<Set<string>>(new Set());
  const [identified, setIdentified] = useState<Set<string>>(new Set());
  const { completeAct, setAct } = useGameStore();

  const canComplete = mapped.size === 3 && identified.size >= 3;

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">Acte 2</div>
        <h2 className="text-2xl font-black text-white mb-2">Cartographier Val-Florès</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Avant de décider, il faut voir. Cartographiez les 3 systèmes imbriqués du territoire, puis identifiez les causes profondes des crises actuelles.
        </p>
      </motion.div>

      {/* Step 1 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-purple-900/60 border border-purple-700/50 flex items-center justify-center text-xs font-bold text-purple-300">1</div>
          <span className="text-slate-300 text-sm font-semibold">Cartographiez les 3 systèmes de Val-Florès</span>
        </div>
        <div className="flex flex-col gap-2">
          {SYSTEMS.map(sys => {
            const isMapped = mapped.has(sys.id);
            return (
              <motion.div
                key={sys.id}
                whileHover={!isMapped ? { scale: 1.005 } : {}}
                onClick={() => setMapped(prev => new Set(Array.from(prev).concat(sys.id)))}
                className={`rounded-2xl border-2 p-4 transition-all ${
                  isMapped ? 'border-transparent cursor-default' : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600 cursor-pointer'
                }`}
                style={isMapped ? {
                  backgroundColor: `${sys.color}15`,
                  borderColor: `${sys.color}50`,
                  boxShadow: `0 0 20px ${sys.color}12`,
                } : {}}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{sys.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-white text-sm">{sys.label}</span>
                      <span className="text-xs text-slate-500">{sys.sublabel}</span>
                      {isMapped && <span className="ml-auto text-xs font-semibold" style={{ color: sys.color }}>✓ Cartographié</span>}
                    </div>
                    {isMapped ? (
                      <>
                        <p className="text-xs text-slate-400 mb-2">{sys.atValflores}</p>
                        <div className="flex gap-1.5 flex-wrap">
                          {sys.emergences.map(e => (
                            <span key={e} className="text-xs px-2 py-0.5 rounded-full bg-red-950/50 text-red-400 border border-red-900/40">{e}</span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-slate-500">Cliquez pour révéler la situation réelle →</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Step 2 */}
      {mapped.size === 3 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-red-900/60 border border-red-700/50 flex items-center justify-center text-xs font-bold text-red-300">2</div>
            <span className="text-slate-300 text-sm font-semibold">Identifiez les causes profondes <span className="text-slate-500">(min. 3)</span></span>
          </div>
          <p className="text-xs text-slate-500 mb-3">Quelles règles et croyances produisent ces crises ? Cliquez pour les identifier.</p>
          <div className="grid grid-cols-2 gap-2">
            {CAUSES_PROFONDES.map(c => {
              const isSelected = identified.has(c.id);
              const sys = SYSTEMS.find(s => s.id === c.cible)!;
              const sevColor = c.sev === 2 ? '#DC2626' : '#C87A2A';
              const sevLabel = c.sev === 2 ? 'Critique' : 'Significatif';
              return (
                <motion.button
                  key={c.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIdentified(prev => {
                    const n = new Set(prev);
                    n.has(c.id) ? n.delete(c.id) : n.add(c.id);
                    return n;
                  })}
                  className={`rounded-xl border-2 p-3 text-left transition-all ${
                    isSelected ? 'border-red-600/60 bg-red-950/30' : 'border-slate-700/50 bg-slate-800/20 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm">{sys.icon}</span>
                    <span className="text-xs text-slate-200 font-medium leading-snug">{c.label}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: sevColor }}>{sevLabel}</span>
                  {isSelected && <span className="float-right text-red-400 text-sm">⚠</span>}
                </motion.button>
              );
            })}
          </div>
          <p className="text-xs text-slate-600 mt-2">{identified.size}/6 identifiées</p>
        </motion.div>
      )}

      {/* Insight clé */}
      {identified.size >= 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl bg-amber-950/30 border border-amber-800/40 p-4"
        >
          <p className="text-amber-400 font-bold text-sm mb-2">💡 La leçon de la cartographie</p>
          <p className="text-amber-300/80 text-sm leading-relaxed">
            Ces crises ne sont pas des accidents. Elles sont les <strong className="text-amber-200">émergences logiques</strong> du Système A — ses croyances et règles les produisent inévitablement.
            Pour changer les émergences, il faut changer les règles. Pour changer les règles durablement, il faut changer les croyances.
            C'est ce que vous allez faire dans les actes suivants.
          </p>
        </motion.div>
      )}

      {canComplete && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button
            onClick={() => { completeAct(2); setAct(3); onComplete(); }}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm bg-purple-700 hover:bg-purple-600 transition-all shadow-lg shadow-purple-900/40"
          >
            Acte 3 : Prendre les 6 décisions de Val-Florès →
          </button>
        </motion.div>
      )}
    </div>
  );
}
