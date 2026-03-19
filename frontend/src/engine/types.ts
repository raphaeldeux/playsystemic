import { IndicatorId, IndicatorValues } from './indicators';

export type CardEffect = {
  indicatorId: IndicatorId;
  delta: number;
  delayYears: number;
  duration: 'permanent' | 'temporary';
  rebounds?: number;
  requiresBeliefId?: string;
};

export type CardId = string;
export type BeliefId = string;
export type PracticeId = string;
export type FamilyId = 'besoins' | 'ressources' | 'valeur' | 'production' | 'organisation' | 'echanges';
export type ChoiceOption = 'A' | 'B' | 'C';

export type ActiveCard = {
  cardId: CardId;
  activatedAt: number;
  effects: CardEffect[];
};

export type Score = {
  coherence: number;
  transition: number;
  systemic: number;
};

export type Badge = {
  id: string;
  label: string;
  description: string;
  unlocked: boolean;
};

export type GameState = {
  currentAct: 1 | 2 | 3 | 4 | 5;
  completedActs: number[];
  activeCards: ActiveCard[];
  activeBeliefs: BeliefId[];
  familyChoices: Record<FamilyId, ChoiceOption | null>;
  activePractices: PracticeId[];
  indicators: Record<IndicatorId, number[]>;
  currentYear: number;
  score: Score;
  sessionId: string;
};

export type SimulationScenario = {
  id: 'BAU' | 'REFORM' | 'TRANSITION' | 'PLAYER';
  label: string;
  color: string;
  data: Record<IndicatorId, number[]>;
};

export type ChoiceData = {
  id: string;
  famille: FamilyId;
  ordre: number;
  question: string;
  contexte: string;
  choix_A: ChoiceOption_Data;
  choix_B: ChoiceOption_Data;
  choix_C: ChoiceOption_Data;
};

export type ChoiceOption_Data = {
  label: string;
  croyance_id?: string;
  croyance_requise?: string;
  carte_fresque?: string;
  effets: Array<{ indicatorId: IndicatorId; delta: number; delayYears: number }>;
  feedback: string;
};

export type CardData = {
  id: string;
  lot: number;
  titre: string;
  sousTitre?: string;
  paradigme: 'A' | 'B' | 'neutre';
  famille: FamilyId;
  texte_court: string;
  texte_complet?: string;
  croyance_liee?: string;
  carte_opposee?: string;
  effets_indicateurs?: Record<IndicatorId, { delta: number; delayYears: number }>;
  position_fresque?: { x: number; y: number };
};
