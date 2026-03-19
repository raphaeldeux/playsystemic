import { IndicatorValues, getInitialIndicators } from './indicators';
import { GameState } from './types';

function hasSobriety(state: GameState): boolean {
  return state.familyChoices['production'] === 'C' || state.familyChoices['ressources'] === 'C';
}

export function stepSimulation(state: GameState, year: number): IndicatorValues {
  const current = year === 0
    ? getInitialIndicators()
    : (Object.fromEntries(
        Object.entries(state.indicators).map(([k, arr]) => [k, arr[year - 1] ?? arr[arr.length - 1]])
      ) as IndicatorValues);

  const next = { ...current };

  for (const activeCard of state.activeCards) {
    for (const effect of activeCard.effects) {
      if (year >= activeCard.activatedAt + effect.delayYears) {
        const beliefMultiplier = effect.requiresBeliefId && !state.activeBeliefs.includes(effect.requiresBeliefId) ? 0.5 : 1.0;
        const reboundFactor = hasSobriety(state) ? 1.0 : (1.0 - (effect.rebounds ?? 0));
        (next as any)[effect.indicatorId] += effect.delta * beliefMultiplier * reboundFactor / 20;
      }
    }
  }

  // Boucles renforçantes dégénératives
  if (next.resources < 0.3) next.ecosystems -= 0.005;
  if (next.equity < 0.25) next.trust -= 0.008;
  if (next.climate < 0.30) next.ecosystems -= 0.010;

  // BAU degradation (si aucun choix C activé)
  const regen_choices = Object.values(state.familyChoices).filter(c => c === 'C').length;
  const reform_choices = Object.values(state.familyChoices).filter(c => c === 'B').length;
  if (regen_choices === 0) {
    next.climate -= 0.004;
    next.ecosystems -= 0.003;
    next.resources -= 0.005;
    next.equity -= 0.003;
    next.trust -= 0.002;
    next.resilience -= 0.003;
  } else if (regen_choices < 3 && reform_choices > 0) {
    // Réformes incrémentales : ralentissement mais pas d'inversion
    next.climate -= 0.002;
    next.resources -= 0.002;
  }

  // Boucles équilibrantes régénératives
  if (next.ecosystems > 0.6 && next.resources < 0.7) next.resources += 0.003;
  if (next.agency > 0.6) next.trust += 0.004;

  // Clamp [0, 1]
  for (const key in next) {
    (next as any)[key] = Math.max(0, Math.min(1, (next as any)[key]));
  }

  return next;
}

export function runSimulation(state: GameState, years: number = 100): Record<string, number[]> {
  const history: Record<string, number[]> = Object.fromEntries(
    Object.keys(getInitialIndicators()).map(k => [k, []])
  );

  const initial = getInitialIndicators();
  for (const k in initial) {
    history[k].push((initial as any)[k]);
  }

  const workingState = { ...state };

  for (let year = 1; year <= years; year++) {
    workingState.currentYear = year;
    const values = stepSimulation(workingState, year);
    for (const k in values) {
      history[k].push((values as any)[k]);
    }
  }

  return history;
}

export function generateBAUScenario(years: number = 100): Record<string, number[]> {
  const emptyState: GameState = {
    currentAct: 1,
    completedActs: [],
    activeCards: [],
    activeBeliefs: [],
    familyChoices: {
      besoins: 'A', ressources: 'A', valeur: 'A',
      production: 'A', organisation: 'A', echanges: 'A',
    },
    activePractices: [],
    indicators: Object.fromEntries(
      Object.keys(getInitialIndicators()).map(k => [k, []])
    ) as any,
    currentYear: 0,
    score: { coherence: 0, transition: 0, systemic: 0 },
    sessionId: 'bau',
  };
  return runSimulation(emptyState, years);
}

export function generateREFORMScenario(years: number = 100): Record<string, number[]> {
  const reformState: GameState = {
    currentAct: 1,
    completedActs: [],
    activeCards: [],
    activeBeliefs: [],
    familyChoices: {
      besoins: 'B', ressources: 'B', valeur: 'B',
      production: 'B', organisation: 'B', echanges: 'B',
    },
    activePractices: [],
    indicators: Object.fromEntries(
      Object.keys(getInitialIndicators()).map(k => [k, []])
    ) as any,
    currentYear: 0,
    score: { coherence: 0, transition: 0, systemic: 0 },
    sessionId: 'reform',
  };

  reformState.activeCards = [
    {
      cardId: 'reform_climate',
      activatedAt: 0,
      effects: [
        { indicatorId: 'climate', delta: 0.05, delayYears: 5, duration: 'permanent' },
        { indicatorId: 'resources', delta: 0.03, delayYears: 3, duration: 'permanent' },
      ],
    },
  ];
  return runSimulation(reformState, years);
}

export function generateTRANSITIONScenario(years: number = 100): Record<string, number[]> {
  const transitionState: GameState = {
    currentAct: 4,
    completedActs: [1, 2, 3],
    activeCards: [
      {
        cardId: 'transition_full',
        activatedAt: 5,
        effects: [
          { indicatorId: 'climate', delta: 0.30, delayYears: 15, duration: 'permanent' },
          { indicatorId: 'ecosystems', delta: 0.35, delayYears: 10, duration: 'permanent' },
          { indicatorId: 'equity', delta: 0.25, delayYears: 5, duration: 'permanent' },
          { indicatorId: 'resilience', delta: 0.30, delayYears: 12, duration: 'permanent' },
          { indicatorId: 'wellbeing', delta: 0.20, delayYears: 8, duration: 'permanent' },
          { indicatorId: 'agency', delta: 0.25, delayYears: 3, duration: 'permanent' },
          { indicatorId: 'resources', delta: 0.30, delayYears: 10, duration: 'permanent' },
          { indicatorId: 'trust', delta: 0.20, delayYears: 5, duration: 'permanent' },
        ],
      },
    ],
    activeBeliefs: ['lot7-1', 'lot7-2', 'lot7-3', 'lot7-4', 'lot7-5', 'lot7-6'],
    familyChoices: {
      besoins: 'C', ressources: 'C', valeur: 'C',
      production: 'C', organisation: 'C', echanges: 'C',
    },
    activePractices: [],
    indicators: Object.fromEntries(
      Object.keys(getInitialIndicators()).map(k => [k, []])
    ) as any,
    currentYear: 0,
    score: { coherence: 100, transition: 100, systemic: 100 },
    sessionId: 'transition',
  };
  return runSimulation(transitionState, years);
}

export function computeScore(state: GameState): { coherence: number; transition: number; systemic: number } {
  const choices = state.familyChoices;
  const families = Object.keys(choices) as Array<keyof typeof choices>;

  // Cohérence : alignement croyances ↔ règles
  let coherencePoints = 0;
  families.forEach(f => {
    const choice = choices[f];
    if (choice === 'C') coherencePoints += 16;
    else if (choice === 'B') coherencePoints += 8;
    else if (choice === 'A') coherencePoints += 0;
  });
  const coherence = Math.min(100, coherencePoints);

  // Transition : % indicateurs sur trajectoire régénérative
  const finalValues = Object.entries(state.indicators).map(([_k, arr]) => arr[arr.length - 1] ?? 0.4);
  const avgFinal = finalValues.reduce((a, b) => a + b, 0) / finalValues.length;
  const transition = Math.round(avgFinal * 100);

  // Systémique : boucles équilibrantes activées
  const regenChoices = families.filter(f => choices[f] === 'C').length;
  const systemic = Math.round((regenChoices / families.length) * 100);

  return { coherence, transition, systemic };
}
