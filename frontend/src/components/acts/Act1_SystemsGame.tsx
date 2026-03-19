import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

type Concept = 'elements' | 'regles' | 'emergences' | 'boucles';

const CONCEPTS: Record<Concept, { label: string; icon: string; color: string; description: string; example: string; valfloRes: string }> = {
  elements: {
    label: 'Éléments',
    icon: '⬡',
    color: '#2563EB',
    description: 'Les parties constitutives d\'un système : acteurs, ressources, stocks.',
    example: 'Forêt : arbres, sol, eau, animaux, champignons, microorganismes.',
    valfloRes: 'Val-Florès : 230 000 habitant·es, 18 communes, la Florès et ses nappes, 40 exploitations agricoles, ZAE Ouest, la Chambre de Commerce, le Collectif Transition…',
  },
  regles: {
    label: 'Règles',
    icon: '⚙',
    color: '#9333EA',
    description: 'Les flux et interactions qui relient les éléments entre eux.',
    example: 'Les arbres captent le carbone. Les champignons échangent des nutriments avec les racines.',
    valfloRes: 'Val-Florès : le marché foncier fixe les prix du logement ; la Chambre de Commerce oriente les investissements ; le Bureau des maires décide sans consulter ; les ZAE attirent des entreprises exogènes…',
  },
  emergences: {
    label: 'Émergences',
    icon: '✦',
    color: '#16A34A',
    description: 'Propriétés du système absentes de chaque élément pris séparément.',
    example: 'La résilience d\'une forêt face aux incendies — aucun arbre seul ne l\'a.',
    valfloRes: 'Val-Florès : la désertification médicale, la spéculation immobilière, la défiance institutionnelle, l\'assec de la Florès — aucun acteur seul ne les a "voulus".',
  },
  boucles: {
    label: 'Boucles',
    icon: '↻',
    color: '#C87A2A',
    description: 'Les effets qui reviennent influencer leurs propres causes.',
    example: 'Plus d\'arbres → plus d\'évapotranspiration → plus de pluie → plus d\'arbres.',
    valfloRes: 'Dégénérative : hausse foncière → départ des travailleurs essentiels → manque de services → territoire moins attractif → plus de départs.\nRégénérative : santé de proximité → familles qui restent → tissu social vivant → territoire plus attractif → plus de familles.',
  },
};

type Phase = 'intro' | 'regles' | 'concepts' | 'done';
type Props = { onComplete: () => void };

export default function Act1_SystemsGame({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [unlocked, setUnlocked] = useState<Set<Concept>>(new Set());
  const [active, setActive] = useState<Concept | null>(null);
  const { completeAct, setAct } = useGameStore();

  const unlock = (c: Concept) => {
    setUnlocked(prev => new Set(Array.from(prev).concat(c)));
    setActive(c);
  };

  if (phase === 'intro') {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
        {/* Badge acte */}
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">Acte 1 — Mise en jeu</div>
          <h2 className="text-2xl font-black text-white mb-3">Bienvenue à Val-Florès</h2>
        </div>

        {/* Carte de situation */}
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Votre contexte</p>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            Vous venez d'être élu·e <span className="text-white font-semibold">Président·e de la Communauté d'Agglomération de Val-Florès</span> — 230 000 habitants, 18 communes, territoire mixte urbain et rural.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            L'héritage est lourd : une industrie en déclin, la rivière Florès en stress hydrique chronique, un foncier qui s'envole, et une défiance citoyenne record. Mais aussi : un Collectif Transition actif, des agriculteurs prêts à changer, et 18 maires qui vous écoutent… pour l'instant.
          </p>
        </div>

        {/* Acteurs */}
        <div className="rounded-2xl bg-slate-800/40 border border-slate-700/30 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Les acteurs que vous allez croiser</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: '🏛', label: 'Chambre de Commerce', role: 'Pousse pour la croissance économique classique', color: '#DC2626' },
              { icon: '🌿', label: 'Collectif Transition', role: 'Propose des alternatives régénératives', color: '#16A34A' },
              { icon: '🗺', label: 'Les 18 maires', role: 'Tensions urbain/rural, chacun défend sa commune', color: '#9333EA' },
              { icon: '👥', label: 'Les habitant·es', role: 'Besoins divergents, confiance fragile', color: '#2563EB' },
            ].map(a => (
              <div key={a.label} className="rounded-xl bg-slate-900/50 border border-slate-700/30 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{a.icon}</span>
                  <span className="font-semibold text-xs text-white leading-tight">{a.label}</span>
                </div>
                <p className="text-xs text-slate-400 leading-snug">{a.role}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setPhase('regles')}
          className="w-full py-3.5 rounded-2xl text-white font-bold text-sm bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40"
        >
          Comprendre les règles du jeu →
        </button>
      </motion.div>
    );
  }

  if (phase === 'regles') {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">Acte 1 — Les règles du jeu</div>
          <h2 className="text-2xl font-black text-white mb-1">Comment ça fonctionne</h2>
          <p className="text-slate-400 text-sm">6 décisions. 20 ans de trajectoire. 8 indicateurs.</p>
        </div>

        <div className="flex flex-col gap-3">
          {[
            {
              icon: '🎯', title: 'Votre mission',
              text: 'Prendre 6 décisions structurantes pour Val-Florès — une par "famille" de règles du Système. Chaque décision couvre un domaine de compétence réel de votre CA.',
            },
            {
              icon: '🔴🟡🟢', title: 'Trois niveaux de choix',
              text: 'Choix A = maintenir le Système actuel (résultats rapides mais dégradation long terme). Choix B = réforme incrémentale (insuffisant, ne change pas les règles de fond). Choix C = transformation systémique (difficile à court terme, régénératif à long terme).',
            },
            {
              icon: '📊', title: '8 indicateurs territoriaux',
              text: 'Stabilité climatique, santé des écosystèmes, équité sociale, résilience, bien-être, capacité d\'agir, ressources, confiance institutionnelle. Tous simulés sur 100 ans. Certains ont un point de bascule : passé un seuil, le retour en arrière devient très difficile.',
            },
            {
              icon: '⏱', title: 'Les délais comptent',
              text: 'Les effets régénératifs prennent 5 à 15 ans à se manifester. Les dégradations du Système A arrivent plus vite. Le piège classique : préférer le court terme et hypothéquer l\'avenir.',
            },
            {
              icon: '🧠', title: 'Les croyances débloquent la pleine puissance',
              text: 'Les choix C ont deux fois plus d\'effet si vous avez intégré la croyance B correspondante (Acte 4). Sans la croyance, la pratique régénérative n\'est que partiellement efficace.',
            },
            {
              icon: '🕸', title: 'Les synergies (et les incohérences)',
              text: 'Certaines combinaisons de choix créent des synergies (+bonus). D\'autres créent des incohérences systémiques qui réduisent les effets positifs. La cohérence entre les 6 familles est la clé.',
            },
          ].map(r => (
            <div key={r.title} className="rounded-xl bg-slate-800/50 border border-slate-700/30 p-4 flex gap-3">
              <span className="text-xl flex-shrink-0">{r.icon}</span>
              <div>
                <p className="font-bold text-sm text-white mb-0.5">{r.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{r.text}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setPhase('concepts')}
          className="w-full py-3.5 rounded-2xl text-white font-bold text-sm bg-blue-600 hover:bg-blue-500 transition-all"
        >
          Acquérir les outils de la pensée systémique →
        </button>
      </motion.div>
    );
  }

  // Phase concepts
  const allDone = unlocked.size === 4;
  const activeInfo = active ? CONCEPTS[active] : null;

  return (
    <div className="flex flex-col gap-5">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">Acte 1 — Pensée systémique</div>
        <h2 className="text-2xl font-black text-white mb-2">Les 4 outils pour comprendre Val-Florès</h2>
        <p className="text-slate-400 text-sm">Cliquez sur chaque concept pour le déverrouiller — avec son application concrète sur votre territoire.</p>
      </motion.div>

      {/* Concept grid */}
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(CONCEPTS) as Concept[]).map(c => {
          const info = CONCEPTS[c];
          const isActive = active === c;
          const isDone = unlocked.has(c);
          return (
            <motion.button
              key={c}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => unlock(c)}
              className={`rounded-2xl border-2 p-4 text-left transition-all relative overflow-hidden ${
                isActive ? 'border-transparent shadow-lg' :
                isDone ? 'border-slate-700/80' :
                'border-slate-700/40 hover:border-slate-600 bg-slate-800/30'
              }`}
              style={isDone ? {
                backgroundColor: `${info.color}18`,
                borderColor: `${info.color}50`,
                boxShadow: isActive ? `0 0 20px ${info.color}30` : undefined,
              } : {}}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{info.icon}</span>
                <span className={`font-bold text-sm ${isDone ? '' : 'text-slate-400'}`} style={isDone ? { color: info.color } : {}}>
                  {info.label}
                </span>
                {isDone && <span className="ml-auto text-xs" style={{ color: info.color }}>✓</span>}
              </div>
              {!isDone && <p className="text-xs text-slate-500">Cliquez pour explorer →</p>}
              {isDone && <p className="text-xs text-slate-400 leading-snug">{info.description}</p>}
            </motion.button>
          );
        })}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {activeInfo && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border p-5"
            style={{ backgroundColor: `${activeInfo.color}12`, borderColor: `${activeInfo.color}40` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{activeInfo.icon}</span>
              <h4 className="font-bold text-base text-white">{activeInfo.label}</h4>
            </div>
            <p className="text-sm text-slate-300 mb-3">{activeInfo.description}</p>
            <div className="rounded-xl bg-slate-900/60 p-3 mb-2">
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Exemple générique</p>
              <p className="text-sm text-slate-300">{activeInfo.example}</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: `${activeInfo.color}15` }}>
              <p className="text-xs font-semibold uppercase mb-1" style={{ color: activeInfo.color }}>
                📍 À Val-Florès
              </p>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{activeInfo.valfloRes}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      <div className="flex items-center gap-3">
        {(Object.keys(CONCEPTS) as Concept[]).map(c => (
          <div key={c} className="flex-1 h-1 rounded-full transition-all duration-500"
            style={{ backgroundColor: unlocked.has(c) ? CONCEPTS[c].color : '#1e293b' }} />
        ))}
      </div>

      {allDone && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="rounded-2xl bg-emerald-950/40 border border-emerald-700/40 p-4 mb-4">
            <p className="text-emerald-400 font-bold mb-1">✓ Outils systémiques acquis</p>
            <p className="text-emerald-300/80 text-sm">
              Vous voyez maintenant Val-Florès comme un système vivant — avec ses acteurs, ses règles implicites, ses émergences indésirables et ses boucles. C'est le regard dont vous avez besoin pour la suite.
            </p>
          </div>
          <button
            onClick={() => { completeAct(1); setAct(2); onComplete(); }}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/40"
          >
            Acte 2 : Cartographier les 3 systèmes de Val-Florès →
          </button>
        </motion.div>
      )}
    </div>
  );
}
