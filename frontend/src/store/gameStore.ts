import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { GameState, ActiveCard, FamilyId, ChoiceOption, PracticeId, BeliefId } from '../engine/types';
import { getInitialIndicators, IndicatorId } from '../engine/indicators';
import { runSimulation, computeScore } from '../engine/simulation';

const INITIAL_STATE: GameState = {
  currentAct: 1,
  completedActs: [],
  activeCards: [],
  activeBeliefs: [],
  familyChoices: {
    besoins: null,
    ressources: null,
    valeur: null,
    production: null,
    organisation: null,
    echanges: null,
  },
  activePractices: [],
  indicators: Object.fromEntries(
    Object.keys(getInitialIndicators()).map((k) => [k, [getInitialIndicators()[k as IndicatorId]]])
  ) as Record<IndicatorId, number[]>,
  currentYear: 0,
  score: { coherence: 0, transition: 0, systemic: 0 },
  sessionId: uuidv4(),
};

type GameStore = GameState & {
  setAct: (act: 1 | 2 | 3 | 4 | 5) => void;
  completeAct: (act: number) => void;
  makeChoice: (family: FamilyId, choice: ChoiceOption, cards: ActiveCard[]) => void;
  activateBelief: (beliefId: BeliefId) => void;
  activatePractice: (practiceId: PracticeId, cards: ActiveCard[]) => void;
  runYear: () => void;
  advanceToYear: (year: number) => void;
  resetGame: () => void;
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setAct: (act) => set({ currentAct: act }),

      completeAct: (act) =>
        set((state) => ({
          completedActs: state.completedActs.includes(act)
            ? state.completedActs
            : [...state.completedActs, act],
        })),

      makeChoice: (family, choice, newCards) => {
        const state = get();
        const updatedState: GameState = {
          ...state,
          familyChoices: { ...state.familyChoices, [family]: choice },
          activeCards: [
            ...state.activeCards.filter((c) => !newCards.find((nc) => nc.cardId === c.cardId)),
            ...newCards,
          ],
        };
        const history = runSimulation(updatedState, 100);
        const score = computeScore({ ...updatedState, indicators: history as Record<IndicatorId, number[]> });
        set({
          familyChoices: updatedState.familyChoices,
          activeCards: updatedState.activeCards,
          indicators: history as Record<IndicatorId, number[]>,
          score,
        });
      },

      activateBelief: (beliefId) => {
        const state = get();
        if (state.activeBeliefs.includes(beliefId)) return;
        const updatedState: GameState = {
          ...state,
          activeBeliefs: [...state.activeBeliefs, beliefId],
        };
        const history = runSimulation(updatedState, 100);
        set({
          activeBeliefs: updatedState.activeBeliefs,
          indicators: history as Record<IndicatorId, number[]>,
        });
      },

      activatePractice: (practiceId, newCards) => {
        const state = get();
        if (state.activePractices.includes(practiceId)) return;
        const updatedState: GameState = {
          ...state,
          activePractices: [...state.activePractices, practiceId],
          activeCards: [...state.activeCards, ...newCards],
        };
        const history = runSimulation(updatedState, 100);
        const score = computeScore({ ...updatedState, indicators: history as Record<IndicatorId, number[]> });
        set({
          activePractices: updatedState.activePractices,
          activeCards: updatedState.activeCards,
          indicators: history as Record<IndicatorId, number[]>,
          score,
        });
      },

      runYear: () => {
        const state = get();
        const newYear = state.currentYear + 1;
        set({ currentYear: newYear });
      },

      advanceToYear: (year) => set({ currentYear: year }),

      resetGame: () =>
        set({
          ...INITIAL_STATE,
          sessionId: uuidv4(),
          indicators: Object.fromEntries(
            Object.keys(getInitialIndicators()).map((k) => [k, [getInitialIndicators()[k as IndicatorId]]])
          ) as Record<IndicatorId, number[]>,
        }),
    }),
    {
      name: 'playsystemic-session',
    }
  )
);
