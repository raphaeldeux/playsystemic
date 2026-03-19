import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { INDICATORS } from '../../engine/indicators';

const BERKANA_ROLES = [
  {
    id: 'nommer',
    label: 'Nommer',
    icon: '🔍',
    color: '#2563EB',
    description: 'Identifier et mettre des mots sur ce qui émerge de nouveau. Nommer les initiatives régénératives qui naissent.',
    question: 'Qu\'est-ce que vous voyez émerger autour de vous qui mérite d\'être nommé et reconnu ?',
  },
  {
    id: 'relier',
    label: 'Relier',
    icon: '🕸',
    color: '#9333EA',
    description: 'Tisser des liens entre les initiatives, les personnes, les idées. Créer du réseau entre ceux qui innovent.',
    question: 'Qui ou quoi avez-vous envie de relier à qui ou quoi ?',
  },
  {
    id: 'nourrir',
    label: 'Nourrir',
    icon: '🌱',
    color: '#16A34A',
    description: 'Prendre soin de ce qui émerge. Protéger les initiatives fragiles, les nourrir de ressources et d\'attention.',
    question: 'Qu\'est-ce qui a besoin de votre soin et de votre protection pour grandir ?',
  },
  {
    id: 'illuminer',
    label: 'Illuminer',
    icon: '✨',
    color: '#C87A2A',
    description: 'Rendre visible ce qui fonctionne. Célébrer les victoires, partager les apprentissages, inspirer par l\'exemple.',
    question: 'Qu\'est-ce que vous avez envie de rendre plus visible, de célébrer, de partager ?',
  },
];

const BADGES = [
  {
    id: 'systemic_thinker',
    label: 'Penseur·euse systémique',
    icon: '🧠',
    condition: (score: any) => score.coherence > 60,
    description: 'Vous avez montré une compréhension des interconnexions systémiques.',
  },
  {
    id: 'commons_weaver',
    label: 'Tisseuse de communs',
    icon: '🕸',
    condition: (score: any, choices: any) => choices.echanges === 'C',
    description: 'Vous avez choisi la gouvernance des communs pour les échanges.',
  },
  {
    id: 'resilience_builder',
    label: 'Architecte de la résilience',
    icon: '🏗',
    condition: (score: any) => score.transition > 50,
    description: 'Vos choix orientent les indicateurs vers une trajectoire régénérative.',
  },
  {
    id: 'careful',
    label: 'Gardien·ne du vivant',
    icon: '🌿',
    condition: (score: any) => score.systemic > 50,
    description: 'Vous avez activé plusieurs boucles équilibrantes du système.',
  },
];

type Props = {
  onComplete: () => void;
};

export default function Act5_MyRole({ onComplete }: Props) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showFinalBilan, setShowFinalBilan] = useState(false);
  const { score, familyChoices, indicators, completeAct, resetGame } = useGameStore();

  const unlockedBadges = BADGES.filter((b) => b.condition(score, familyChoices));

  // Final values at year 50 and 100
  const getVal = (id: string, year: number) => {
    const arr = indicators[id as keyof typeof indicators] as number[];
    return arr?.[year] ?? arr?.[arr.length - 1] ?? 0.4;
  };

  const handleComplete = () => {
    completeAct(5);
    setShowFinalBilan(true);
  };

  if (showFinalBilan) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto flex flex-col gap-6"
      >
        <div className="text-center">
          <div className="text-5xl mb-3">🌍</div>
          <h2 className="text-2xl font-bold text-gray-800">Votre trajectoire systémique</h2>
          <p className="text-gray-600 text-sm mt-1">Comparaison à l'an 50 et à l'an 100</p>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Cohérence', value: score.coherence, color: '#2B4C7E' },
            { label: 'Transition', value: score.transition, color: '#1A5C2A' },
            { label: 'Systémique', value: score.systemic, color: '#9333EA' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-3 text-center border border-gray-200">
              <div className="text-2xl font-bold" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Indicator comparison */}
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 grid grid-cols-4">
            <span>Indicateur</span>
            <span className="text-center">Aujourd'hui</span>
            <span className="text-center">An 50</span>
            <span className="text-center">An 100</span>
          </div>
          {INDICATORS.map((ind) => {
            const v0 = getVal(ind.id, 0);
            const v50 = getVal(ind.id, 50);
            const v100 = getVal(ind.id, 100);
            const trend = v100 > v0 ? '↑' : v100 < v0 ? '↓' : '→';
            const trendColor = v100 > v0 ? '#16A34A' : v100 < v0 ? '#DC2626' : '#6B7280';
            return (
              <div key={ind.id} className="px-3 py-2 grid grid-cols-4 border-t border-gray-100 items-center">
                <div className="text-xs text-gray-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ind.color }} />
                  {ind.label}
                </div>
                <div className="text-center text-xs font-mono text-gray-600">{Math.round(v0 * 100)}%</div>
                <div className="text-center text-xs font-mono text-gray-600">{Math.round(v50 * 100)}%</div>
                <div className="text-center text-xs font-mono font-bold" style={{ color: trendColor }}>
                  {Math.round(v100 * 100)}% {trend}
                </div>
              </div>
            );
          })}
        </div>

        {/* Badges */}
        {unlockedBadges.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Badges débloqués</h3>
            <div className="grid grid-cols-2 gap-2">
              {unlockedBadges.map((b) => (
                <motion.div
                  key={b.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="rounded-xl bg-blue-50 border border-blue-200 p-3 flex items-center gap-3"
                >
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <div className="font-semibold text-sm text-blue-800">{b.label}</div>
                    <div className="text-xs text-gray-600">{b.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Narrative summary */}
        <div className="rounded-xl bg-green-50 border border-green-200 p-4">
          <h3 className="font-bold text-green-800 mb-2">Récit de votre session</h3>
          <p className="text-sm text-green-700 leading-relaxed">
            Au cours de cette session, vous avez effectué {Object.values(familyChoices).filter(c => c === 'C').length} choix régénératifs,{' '}
            {Object.values(familyChoices).filter(c => c === 'B').length} réformes incrémentales, et{' '}
            {Object.values(familyChoices).filter(c => c === 'A').length} maintiens du Système A.
            {Object.values(familyChoices).filter(c => c === 'C').length >= 4
              ? " Votre trajectoire dessine une transition systémique significative. Les boucles équilibrantes que vous avez activées demanderont du temps pour produire leurs effets — mais la direction est clairement régénérative."
              : Object.values(familyChoices).filter(c => c === 'C').length >= 2
              ? " Vous avez engagé une transition partielle. Les réformes incrémentales ralentissent la dégradation mais ne suffisent pas à inverser les trajectoires. Chaque famille basculée vers le Système B amplifie l'effet des autres."
              : " Votre trajectoire reste majoritairement dans le Système A. L'expérience vous a montré que les émergences dégénératives sont la conséquence logique de ces règles. Le changement est possible — il commence par les croyances."
            }
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={resetGame}
            className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
          >
            Rejouer
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-2">Acte 5</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Mon rôle dans la transition</h2>
        <p className="text-gray-600 text-sm">
          La transition systémique n'est pas l'affaire d'un seul acteur.
          Quel est votre rôle dans ce mouvement ?
        </p>
      </motion.div>

      {/* Berkana double loop */}
      <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
        <h3 className="font-bold text-blue-800 mb-1">La double boucle de l'Institut Berkana</h3>
        <p className="text-sm text-blue-700 mb-3">
          La transition systémique se nourrit d'initiatives régénératives qui émergent partout.
          Quatre rôles permettent de les faire grandir.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {BERKANA_ROLES.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <motion.button
                key={role.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRole(isSelected ? null : role.id)}
                className={`rounded-xl border-2 p-3 text-left transition-all ${
                  isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200 bg-white hover:border-gray-400'
                }`}
                style={isSelected ? { borderColor: role.color, backgroundColor: `${role.color}10` } : {}}
              >
                <div className="text-xl mb-1">{role.icon}</div>
                <div className="font-bold text-sm" style={{ color: isSelected ? role.color : '#374151' }}>
                  {role.label}
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-tight">{role.description}</p>
                {isSelected && (
                  <p className="text-xs font-medium mt-2 italic" style={{ color: role.color }}>
                    {role.question}
                  </p>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Badges preview */}
      {unlockedBadges.length > 0 && (
        <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-3">
          <p className="text-xs font-semibold text-yellow-800 mb-2">
            {unlockedBadges.length} badge{unlockedBadges.length > 1 ? 's' : ''} débloqué{unlockedBadges.length > 1 ? 's' : ''} !
          </p>
          <div className="flex gap-3 flex-wrap">
            {unlockedBadges.map((b) => (
              <span key={b.id} className="text-sm">{b.icon} {b.label}</span>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={handleComplete}
          className="px-8 py-3 rounded-xl text-white font-bold text-base shadow-md hover:shadow-lg transition-all"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          Voir mon bilan final →
        </button>
      </div>
    </div>
  );
}
