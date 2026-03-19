import { create } from 'zustand';

type UIStore = {
  showGlossary: boolean;
  showScenarios: boolean;
  selectedYear: number;
  activePanel: 'curves' | 'fresque' | 'both';
  expandedCard: string | null;
  showFeedback: boolean;
  lastFeedback: string | null;
  toggleGlossary: () => void;
  toggleScenarios: () => void;
  setSelectedYear: (year: number) => void;
  setActivePanel: (panel: 'curves' | 'fresque' | 'both') => void;
  setExpandedCard: (id: string | null) => void;
  showFeedbackMessage: (message: string) => void;
  clearFeedback: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
  showGlossary: false,
  showScenarios: true,
  selectedYear: 50,
  activePanel: 'both',
  expandedCard: null,
  showFeedback: false,
  lastFeedback: null,

  toggleGlossary: () => set((s) => ({ showGlossary: !s.showGlossary })),
  toggleScenarios: () => set((s) => ({ showScenarios: !s.showScenarios })),
  setSelectedYear: (year) => set({ selectedYear: year }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setExpandedCard: (id) => set({ expandedCard: id }),
  showFeedbackMessage: (message) => set({ showFeedback: true, lastFeedback: message }),
  clearFeedback: () => set({ showFeedback: false }),
}));
