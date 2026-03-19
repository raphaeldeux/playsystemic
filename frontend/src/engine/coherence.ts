import { GameState } from './types';

type Inconsistency = {
  id: string;
  message: string;
};

type Synergy = {
  id: string;
  bonus: Partial<Record<string, number>>;
  message: string;
};

export function detectInconsistencies(state: GameState): Inconsistency[] {
  const choices = state.familyChoices;
  const result: Inconsistency[] = [];

  if (choices.production === 'C' && choices.echanges === 'A') {
    result.push({
      id: 'prod_c_echange_a',
      message:
        "Vous avez adopté une production circulaire (Famille 4) mais conservé le libre marché sans régulation (Famille 6). Sans règles d'échange coopératives, les pratiques circulaires restent marginales.",
    });
  }

  if (choices.organisation === 'C' && choices.valeur === 'A') {
    result.push({
      id: 'org_c_valeur_a',
      message:
        "Une gouvernance partagée (Famille 5) avec une règle de valeur centrée sur le capital financier (Famille 3) crée une tension : les actionnaires reprendront le contrôle.",
    });
  }

  if (choices.ressources === 'C' && choices.besoins === 'A') {
    result.push({
      id: 'ress_c_besoins_a',
      message:
        "Vous gérez vos ressources de manière régénérative (Famille 2) tout en répondant d'abord aux besoins matériels et de loisirs (Famille 1). La pression sur les ressources restera forte.",
    });
  }

  return result;
}

export function detectSynergies(state: GameState): Synergy[] {
  const choices = state.familyChoices;
  const result: Synergy[] = [];

  if (choices.ressources === 'C' && choices.production === 'C' && choices.echanges === 'C') {
    result.push({
      id: 'ress_prod_echange_c',
      bonus: { resilience: 0.05, ecosystems: 0.04 },
      message:
        "Synergie Ressources + Production + Échanges : les flux sont bouclés, les déchets deviennent ressources.",
    });
  }

  if (choices.besoins === 'C' && choices.valeur === 'C') {
    result.push({
      id: 'besoins_valeur_c',
      bonus: { wellbeing: 0.06, equity: 0.04 },
      message:
        "Synergie Besoins + Valeur : les indicateurs de bien-être remplacent le PIB, réorientant l'économie vers ce qui compte vraiment.",
    });
  }

  if (choices.organisation === 'C' && choices.echanges === 'C') {
    result.push({
      id: 'org_echange_c',
      bonus: { trust: 0.07, agency: 0.05 },
      message:
        "Synergie Gouvernance + Échanges : la démocratie délibérative et les communs se renforcent mutuellement.",
    });
  }

  if (Object.values(choices).every(c => c === 'C')) {
    result.push({
      id: 'all_c',
      bonus: { resilience: 0.08, ecosystems: 0.06, equity: 0.05, trust: 0.05 },
      message:
        "Cohérence systémique totale ! Toutes les familles ont basculé vers le Système B. Les synergies se démultiplient.",
    });
  }

  return result;
}
