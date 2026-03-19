export type IndicatorId =
  | 'climate'
  | 'ecosystems'
  | 'equity'
  | 'resilience'
  | 'wellbeing'
  | 'agency'
  | 'resources'
  | 'trust';

export type Indicator = {
  id: IndicatorId;
  label: string;
  description: string;
  initialValue: number;
  criticalThreshold: number;
  tippingPoint: number;
  color: string;
};

export const INDICATORS: Indicator[] = [
  {
    id: 'climate',
    label: 'Stabilité climatique',
    description: 'Capacité du système climatique à maintenir des conditions habitables',
    initialValue: 0.40,
    criticalThreshold: 0.25,
    tippingPoint: 0.15,
    color: '#2563EB',
  },
  {
    id: 'ecosystems',
    label: 'Santé des socio-écosystèmes',
    description: 'Vitalité des écosystèmes et de leur capacité à rendre des services',
    initialValue: 0.45,
    criticalThreshold: 0.30,
    tippingPoint: 0.20,
    color: '#16A34A',
  },
  {
    id: 'equity',
    label: 'Équité sociale',
    description: 'Répartition équitable des ressources et opportunités',
    initialValue: 0.35,
    criticalThreshold: 0.20,
    tippingPoint: 0.10,
    color: '#9333EA',
  },
  {
    id: 'resilience',
    label: 'Résilience systémique',
    description: 'Capacité du système à absorber les chocs et se réorganiser',
    initialValue: 0.40,
    criticalThreshold: 0.25,
    tippingPoint: 0.15,
    color: '#EA580C',
  },
  {
    id: 'wellbeing',
    label: 'Bien-être subjectif',
    description: 'Qualité de vie et satisfaction des besoins fondamentaux',
    initialValue: 0.50,
    criticalThreshold: 0.30,
    tippingPoint: 0.20,
    color: '#0891B2',
  },
  {
    id: 'agency',
    label: "Capacité d'agir collective",
    description: 'Pouvoir des individus et communautés à influencer leur destin',
    initialValue: 0.45,
    criticalThreshold: 0.25,
    tippingPoint: 0.15,
    color: '#CA8A04',
  },
  {
    id: 'resources',
    label: 'Flux de ressources',
    description: 'Disponibilité et qualité des ressources naturelles et matérielles',
    initialValue: 0.35,
    criticalThreshold: 0.20,
    tippingPoint: 0.10,
    color: '#DC2626',
  },
  {
    id: 'trust',
    label: 'Confiance institutionnelle',
    description: 'Confiance dans les institutions publiques et les structures collectives',
    initialValue: 0.45,
    criticalThreshold: 0.25,
    tippingPoint: 0.15,
    color: '#059669',
  },
];

export type IndicatorValues = Record<IndicatorId, number>;

export function getInitialIndicators(): IndicatorValues {
  return Object.fromEntries(
    INDICATORS.map((ind) => [ind.id, ind.initialValue])
  ) as IndicatorValues;
}

export function getIndicatorStatus(value: number, indicator: Indicator): 'healthy' | 'watch' | 'alert' | 'critical' | 'tipping' {
  if (value <= indicator.tippingPoint) return 'tipping';
  if (value <= indicator.criticalThreshold) return 'critical';
  if (value <= 0.40) return 'alert';
  if (value <= 0.70) return 'watch';
  return 'healthy';
}
