import { create } from 'zustand';
import { SimulationScenario } from '../engine/types';
import {
  generateBAUScenario,
  generateREFORMScenario,
  generateTRANSITIONScenario,
} from '../engine/simulation';
import { IndicatorId } from '../engine/indicators';

type SimulationStore = {
  scenarios: SimulationScenario[];
  initialized: boolean;
  initialize: () => void;
};

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  scenarios: [],
  initialized: false,

  initialize: () => {
    if (get().initialized) return;
    const bau = generateBAUScenario(100);
    const reform = generateREFORMScenario(100);
    const transition = generateTRANSITIONScenario(100);

    set({
      initialized: true,
      scenarios: [
        {
          id: 'BAU',
          label: 'Business as usual',
          color: '#8B1A1A',
          data: bau as Record<IndicatorId, number[]>,
        },
        {
          id: 'REFORM',
          label: 'Réformes incrémentales',
          color: '#C87A2A',
          data: reform as Record<IndicatorId, number[]>,
        },
        {
          id: 'TRANSITION',
          label: 'Transition systémique',
          color: '#1A5C2A',
          data: transition as Record<IndicatorId, number[]>,
        },
      ],
    });
  },
}));
