# CAHIER DES CHARGES
## Jeu de prospective systémique interactif
### Fondé sur la Fresque Systémique (Brunel, Deux & Marcé, v5.3.1)

> **Stack** : React + Node.js + Docker · **Domaine** : play.fresquesystemique.org · **Port** : 5079 · **Reverse proxy** : Apache2 / ISPConfig · **Accès** : libre-service, sans authentification

---

## Table des matières

1. [Vision et objectifs pédagogiques](#1-vision-et-objectifs-pédagogiques)
2. [Architecture technique](#2-architecture-technique)
3. [Structure narrative et parcours joueur](#3-structure-narrative-et-parcours-joueur)
4. [Contenu — les 6 familles de règles jouables](#4-contenu--les-6-familles-de-règles-jouables)
5. [Moteur de dynamique des systèmes](#5-moteur-de-dynamique-des-systèmes)
6. [Mécanique de jeu — les choix A → B → C](#6-mécanique-de-jeu--les-choix-a--b--c)
7. [Spécifications UX/UI](#7-spécifications-uxui)
8. [Spécifications techniques détaillées](#8-spécifications-techniques-détaillées)
9. [Infrastructure Docker / Apache2 / ISPConfig](#9-infrastructure-docker--apache2--ispconfig)
10. [Structure des fichiers du projet](#10-structure-des-fichiers-du-projet)
11. [Schéma de données JSON](#11-schéma-de-données-json)
12. [Roadmap et priorités MVP](#12-roadmap-et-priorités-mvp)
13. [Références théoriques](#13-références-théoriques)

---

## 1. Vision et objectifs pédagogiques

### 1.1 Contexte

La **Fresque Systémique** est un atelier collaboratif de 3h30 qui guide des groupes dans la compréhension des crises contemporaines via la pensée systémique. Son cœur pédagogique repose sur deux paradigmes opposés :

| Dimension | Système A — Dégénératif | Système B — Régénératif |
|-----------|------------------------|------------------------|
| **Croyances** | Avoir = être · Nature infinie · Individus indépendants · Compétition · Hiérarchies naturelles | Richesse ≠ possession · Terre finie et déstabilisée · Interdépendances · Symbiose · Tech au bien commun |
| **Règles** | Énergies fossiles · Capital financier · Production linéaire · Propriété · Marché libre | Énergies renouvelables · Valeur étendue · Circularité · Communs · Coopération |
| **Émergences** | Crises climatiques · Biodiversité effondrée · Inégalités · Fragilité systémique | Résilience · Santé commune socio-écosystèmes · Équité |

Cette application transpose l'expérience en un **jeu de prospective systémique** accessible en libre-service. Le joueur voit évoluer des courbes d'indicateurs (à la manière du rapport Meadows, 1972) selon ses choix.

### 1.2 Postulat fondateur

> *"On ne peut pas attendre d'un système qu'il se comporte différemment de ce pour quoi il a été conçu."*
> *"Il ne suffit pas de changer LE système — il faut changer DE système."*
> — Fresque Systémique

L'objectif est de rendre ce postulat **viscéralement intelligible** : le joueur expérimente comment les croyances génèrent les règles, les règles génèrent les émergences, et comment les réformes incrémentales (Choix B) sont toujours insuffisantes sans changement de paradigme.

### 1.3 Objectifs d'apprentissage

À l'issue d'une session, le joueur doit être capable de :

- [ ] Distinguer les niveaux d'un système : croyances → règles → pratiques → émergences
- [ ] Identifier les boucles de rétroaction renforçantes et équilibrantes
- [ ] Comprendre pourquoi les réformes dans le Système A ne changent pas les émergences
- [ ] Visualiser la dynamique temporelle d'une transition systémique (délais, tipping points)
- [ ] Identifier des leviers d'action concrets issus du Lot 9 (pratiques régénératives)
- [ ] Adopter une posture de "danse avec les systèmes" plutôt que de "maîtrise du monde"

### 1.4 Public cible

- Participants ayant fait une Fresque Systémique ou Fresque du Climat
- Formateurs et facilitateurs de la transition
- Étudiants en management, sciences sociales, écologie
- Grand public motivé, sans prérequis en systémique
- Accès libre, sans compte, sans friction

---

## 2. Architecture technique

### 2.1 Vue d'ensemble

```
Internet
    │
    ▼
Apache2 (ISPConfig)
play.fresquesystemique.org → ProxyPass → localhost:5079
    │
    ▼
Docker Compose
    ├── frontend  (React, port interne 3000)
    └── backend   (Node.js/Express, port interne 8000)
        │
        └── Port exposé hôte : 5079 → frontend Nginx :80
```

### 2.2 Choix de stack

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| Frontend | React 18 + TypeScript | Composants réutilisables, écosystème riche |
| Visualisation | Recharts ou D3.js | Courbes animées style rapport Meadows |
| Animations | Framer Motion | Micro-interactions fluides |
| Styling | Tailwind CSS | Cohérence rapide sans sur-engineering |
| Graphe fresque | React Flow | Visualisation nodale des cartes et liens |
| Backend | Node.js + Express | API légère, calculs moteur de simulation |
| Persistance session | Redis (optionnel) ou localStorage | Pas de base de données relationnelle pour le MVP |
| Containerisation | Docker + Docker Compose | Déploiement reproductible |
| Reverse proxy | Apache2 (existant) | ProxyPass vers le port 5079 |

---

## 3. Structure narrative et parcours joueur

### 3.1 Les 5 actes

Le jeu suit l'architecture pédagogique de la Fresque Systémique en 5 actes séquentiels.

#### ACTE 1 — L'enquête systémique *(5-10 min)*
> **Intention** : ancrer le vocabulaire de la pensée systémique

- Mini-jeu interactif inspiré du "Jeu des Systèmes" (Annexe 1 du guide d'animation)
- Le joueur observe un système simple (ex: thermostat, population de lapins)
- Il identifie : **éléments**, **règles de fonctionnement**, **émergences**, **boucles de rétroaction**
- À la fin, les 4 concepts sont déverrouillés et affichés dans un glossaire persistant
- Les courbes s'initialisent à zéro, prêtes à être tracées

#### ACTE 2 — Les 3 grands systèmes *(10 min)*
> **Intention** : cartographier l'état actuel du Système A

- Drag-and-drop des cartes Lots 1, 2, 2bis sur la fresque (Système Terre / Écosystèmes / Socio-économique)
- Identification des **émergences indésirables** (Lot 3) : dérèglement climatique, effondrement biodiversité, inégalités, etc.
- Les courbes s'initialisent sur la trajectoire "Business as usual" (Système A actif)
- Animation : les courbes descendent progressivement en mode dégénératif

#### ACTE 3 — Déconstruire le Système A *(15-20 min)*
> **Intention** : comprendre les règles (Lot 5) et croyances (Lot 6) qui génèrent les crises

- 6 familles de règles × 3 choix chacune (voir section 4 et 6)
- À chaque choix A : la courbe correspondante s'enfonce davantage
- Intégration émotionnelle : pause à mi-parcours ("Que ressentez-vous face à ces règles et croyances ?")
- Boucles de rétroaction renforçantes visualisées sur la fresque

#### ACTE 4 — Construire le Système B *(15-20 min)*
> **Intention** : opérer la transition par les croyances (Lot 7), règles (Lot 8) et pratiques (Lot 9)

- Pour chaque famille : activation des croyances actualisées puis des règles régénératives
- Activation des pratiques du Lot 9 (30 cartes disponibles, le joueur en choisit)
- Les courbes s'infléchissent progressivement — **avec délai de latence visible**
- Certaines courbes se dégradent temporairement avant de s'améliorer (effet J-curve)
- Boucles équilibrantes animées sur la fresque

#### ACTE 5 — Mon rôle dans la transition *(5 min)*
> **Intention** : ancrer en une intention d'action personnelle

- Affichage de la double boucle de l'Institut Berkana (4 rôles : Nommer, Relier, Nourrir, Illuminer)
- Exploration de l'Arbre aux actions (lien vers racinesderesilience.org ou intégration)
- Bilan final : courbes comparées à l'an 50 et à l'an 100
- Récit personnalisé généré : synthèse des choix, boucles activées, score de cohérence
- Partage optionnel (image des courbes exportable)

### 3.2 Modes de jeu

```
MODE SOLO (MVP)
└── Parcours linéaire ~45 min
    ├── Narration pédagogique intégrée
    ├── Feedback immédiat sur chaque choix
    └── Accessible sans facilitateur

MODE COLLECTIF (Phase 2)
└── Interface multi-joueurs (2-6 personnes)
    ├── Chaque joueur vote sur les choix
    ├── Distribution des votes visible en temps réel
    ├── Le facilitateur peut débloquer/forcer une étape
    └── WebSocket pour synchronisation
```

---

## 4. Contenu — les 6 familles de règles jouables

Chaque famille correspond à une "question fondatrice" du système socio-économique, tirée de la synthèse des deux paradigmes (Guide d'animation, pp. 26-29).

---

### FAMILLE 1 — BESOINS
*À quels besoins humains répondons-nous prioritairement ?*

| | Système A | Système B |
|---|---|---|
| **Croyance** | "Avoir, c'est être" | "La richesse de l'existence ne se mesure pas à ce que l'on possède" |
| **Règle** | Aux besoins de subsistance, puis aux besoins matériels et de loisirs | Aux besoins humains fondamentaux, dans le respect de la santé commune |
| **Indicateurs impactés** | Bien-être subjectif ↓, Flux ressources ↓ | Bien-être subjectif ↑, Résilience ↑ |

---

### FAMILLE 2 — RESSOURCES
*Quelles sont les principales ressources de l'activité économique ?*

| | Système A | Système B |
|---|---|---|
| **Croyance** | "La nature est une ressource infinie et gratuite à notre service" | "Le système Terre est fini et déstabilisé" |
| **Règles A** | Énergies fossiles en abondance · Eau captée · Ressources extraites de la lithosphère · Ressources vivantes · Sols comme support | Énergies renouvelables en réseau · Hydrologie régénérative · Matières réemployées · Les êtres vivants · Sols régénérés et fertiles |
| **Indicateurs impactés** | Stabilité climatique ↓↓, Santé écosystèmes ↓↓ | Stabilité climatique ↑, Santé écosystèmes ↑ |

---

### FAMILLE 3 — VALEUR
*Quelle valeur cherche-t-on à créer ? Comment la mesure et répartit-on ?*

| | Système A | Système B |
|---|---|---|
| **Croyance** | Les 3 croyances précédentes (Avoir=être, Nature infinie, Individus indépendants) | Les 3 croyances actualisées |
| **Règles A** | Du capital financier · En priorisant les détenteurs du capital | Une valeur étendue visant la santé commune des socio-écosystèmes · Le partage équitable |
| **Indicateurs impactés** | Équité sociale ↓↓, Confiance institutionnelle ↓ | Équité sociale ↑↑, Capacité d'agir ↑ |

---

### FAMILLE 4 — CONCEPTION & PRODUCTION
*Par quels systèmes obtenons-nous nos biens et services ?*

| | Système A | Système B |
|---|---|---|
| **Croyance** | "La pensée analytique permet la maîtrise du monde" · "Il faut être efficace et performant" · "Tous nos problèmes seront résolus par le progrès technique" | "La pensée systémique permet de danser avec les systèmes" · "Il faut être robuste, résilient et efficient" · "Nos technologies doivent être choisies à l'aune du bien commun" |
| **Règles A** | Production linéaire · Modes industriels · Méga-infrastructures flux tendus · Innovation high-tech · Productivisme et performance | Sobriété et circularisation des flux · Approches régénératives · Sobriété des flux énergie/matière · Multifonctionnel et synergique · Innovation low-tech · Robustesse · Éco-conception bioinspirée |
| **Indicateurs impactés** | Flux ressources ↓↓, Résilience ↓ | Flux ressources ↑↑, Résilience ↑ |

---

### FAMILLE 5 — ORGANISATION & GOUVERNANCE
*Comment s'organiser pour produire le bien ou service ?*

| | Système A | Système B |
|---|---|---|
| **Croyance** | "Le monde s'organise en pyramides, avec des hiérarchies naturelles" | "Les êtres vivants s'organisent en réseaux d'interdépendances" |
| **Règles A** | Structures hiérarchiques avec sommet décisionnel · Appropriation et invisibilisation de ressources gratuites · Management opérationnel visant la performance | Gouvernance partagée et distribuée · Organisation en réseau · Inclusion de tous et répartition équitable · Leadership régénératif · Politiques de care et de régénération |
| **Indicateurs impactés** | Équité sociale ↓, Bien-être ↓ | Équité sociale ↑, Capacité d'agir ↑↑ |

---

### FAMILLE 6 — ÉCHANGES & USAGE
*Comment chacun obtient ce dont il a besoin ? Comment se font les échanges ?*

| | Système A | Système B |
|---|---|---|
| **Croyance** | "La propriété privée est un droit fondamental" · "La loi principale de la nature est la compétition" | "L'accès aux biens et aux services est un droit fondamental" · "La loi principale de la nature est la symbiose" |
| **Règles A** | Par l'achat du bien · Par la propriété publique ou privée · Par le libre jeu du marché et la concurrence · Par un système monétaire visant l'expansion économique | Par l'usage des biens · Par une gouvernance spécifique des communs · Régulations et coopérations à l'échelle territoriale · Par un système monétaire à visée régénérative |
| **Indicateurs impactés** | Confiance institutionnelle ↓, Flux ressources ↓ | Confiance institutionnelle ↑, Équité ↑ |

---

### 4.1 Les pratiques régénératives jouables (Lot 9 — 30 cartes)

Chaque pratique est un "levier d'action" activable dans l'Acte 4. Elles ont des effets différents sur les indicateurs, avec des **délais de latence variables**.

```
Famille BESOINS
  ├── Arbitrages des conflits d'usage de ressources selon besoins prioritaires
  └── Régulation forte de la publicité

Famille RESSOURCES
  ├── Politiques de sobriété
  ├── Mesures d'efficacité (en contenant les effets rebond)
  ├── Énergies renouvelables en réseaux intelligents + Biorégions
  └── Agriculture régénérative · Agroécologie · Agroforesterie

Famille VALEUR
  ├── Indicateurs intégrés socio-écologiques
  ├── Comptabilités intégrées socio-écologiques
  ├── Indicateurs fondés sur la résilience
  └── Justice redistributive + Principes ESS

Famille PRODUCTION
  ├── Économie circulaire (réemploi, réparation, recyclage)
  ├── Low-tech et éco-conception bioinspirée
  └── Habitat participatif et coliving intergénérationnel

Famille ORGANISATION
  ├── Coopératives et gouvernance partagée
  ├── Leadership régénératif
  ├── Politiques de care
  └── Conventions citoyennes et démocratie délibérative

Famille ÉCHANGES
  ├── Communs numériques et licences libres
  ├── Monnaies locales complémentaires
  ├── Mutualisation et partage (outils, véhicules, espaces)
  └── Régulations territoriales et coopérations
```

---

## 5. Moteur de dynamique des systèmes

### 5.1 Les 8 indicateurs

```typescript
type Indicator = {
  id: string;
  label: string;
  description: string;
  initialValue: number;    // 0.0 à 1.0
  criticalThreshold: number; // Seuil d'alerte rouge
  tippingPoint: number;    // Point de non-retour
};

const INDICATORS: Indicator[] = [
  { id: 'climate',      label: 'Stabilité climatique',        initialValue: 0.40, criticalThreshold: 0.25, tippingPoint: 0.15 },
  { id: 'ecosystems',   label: 'Santé des socio-écosystèmes', initialValue: 0.45, criticalThreshold: 0.30, tippingPoint: 0.20 },
  { id: 'equity',       label: 'Équité sociale',              initialValue: 0.35, criticalThreshold: 0.20, tippingPoint: 0.10 },
  { id: 'resilience',   label: 'Résilience systémique',       initialValue: 0.40, criticalThreshold: 0.25, tippingPoint: 0.15 },
  { id: 'wellbeing',    label: 'Bien-être subjectif',         initialValue: 0.50, criticalThreshold: 0.30, tippingPoint: 0.20 },
  { id: 'agency',       label: "Capacité d'agir collective",  initialValue: 0.45, criticalThreshold: 0.25, tippingPoint: 0.15 },
  { id: 'resources',    label: 'Flux de ressources',          initialValue: 0.35, criticalThreshold: 0.20, tippingPoint: 0.10 },
  { id: 'trust',        label: 'Confiance institutionnelle',  initialValue: 0.45, criticalThreshold: 0.25, tippingPoint: 0.15 },
];
```

### 5.2 Modèle de simulation

```typescript
// Chaque carte de règle a un vecteur d'effets
type CardEffect = {
  indicatorId: string;
  delta: number;          // -1.0 à +1.0
  delayYears: number;     // Délai avant plein effet
  duration: 'permanent' | 'temporary';
  rebounds: number;       // Effet rebond 0.0 à 0.5 (si sobriété absente)
  requiresBeliefId?: string; // Croyance B nécessaire pour débloquer l'effet complet
};

// Équation de base (simplifiée, discrète, pas de temps = 1 an)
function stepSimulation(state: GameState, year: number): Indicators {
  const next = { ...state.indicators };
  
  for (const activeCard of state.activeCards) {
    for (const effect of activeCard.effects) {
      if (year >= activeCard.activatedAt + effect.delayYears) {
        const multiplier = state.activeBeliefs.includes(effect.requiresBeliefId) ? 1.0 : 0.5;
        const reboundFactor = hasSobriety(state) ? 1.0 : (1.0 - effect.rebounds);
        next[effect.indicatorId] += effect.delta * multiplier * reboundFactor / 20; // lissé sur 20 ans
      }
    }
  }
  
  // Boucles renforçantes dégénératives (auto-amplification)
  if (next.resources < 0.3) next.ecosystems -= 0.005;
  if (next.equity < 0.25)   next.trust     -= 0.008;
  if (next.climate < 0.30)  next.ecosystems -= 0.010;
  
  // Boucles équilibrantes régénératives
  if (next.ecosystems > 0.6 && next.resources < 0.7) next.resources += 0.003;
  if (next.agency > 0.6)    next.trust     += 0.004;
  
  // Clamp [0, 1]
  for (const key in next) next[key] = Math.max(0, Math.min(1, next[key]));
  
  return next;
}
```

### 5.3 Scénarios de référence (pré-calculés pour le MVP)

| Scénario | Description | Trajectoire à an 50 |
|----------|-------------|---------------------|
| `BAU` | Business as usual — Système A sans changement | Tous indicateurs < 0.25 |
| `REFORM` | Réformes incrémentales dans le Système A | Stagnation ou légère amélioration, pas de bascule |
| `TRANSITION` | Transition systémique vers le Système B | Courbe en J : dégradation 5-15 ans puis amélioration |
| `PLAYER` | Trajectoire personnalisée du joueur | Variable |

> **Note pédagogique** : Le scénario `REFORM` est crucial — il montre que "changer LE système" (ex: voiture électrique sans sobriété) ne suffit pas à infléchir les émergences systémiques.

### 5.4 Paramétrage des délais (exemples)

```typescript
// Ces délais sont intentionnellement visibles dans les courbes
const DELAY_EXAMPLES = {
  energiesRenouvelables:    { delayYears: 5,  comment: "Déploiement infrastructure" },
  agricultureRegenerative:  { delayYears: 10, comment: "Restauration des sols" },
  agroforesterie:           { delayYears: 20, comment: "Maturité des arbres" },
  gouvernancePartagee:      { delayYears: 3,  comment: "Changement organisationnel" },
  monnaieRegenerative:      { delayYears: 8,  comment: "Adoption et confiance" },
  croyancesActualisees:     { delayYears: 0,  comment: "Effet immédiat sur les choix suivants" },
};
```

---

## 6. Mécanique de jeu — les choix A → B → C

### 6.1 Format d'une séquence de choix

```
┌─────────────────────────────────────────────────────────┐
│  [CONTEXTE NARRATIF]                                     │
│  2-3 phrases situant l'enjeu dans un territoire réel     │
│                                                          │
│  [QUESTION SYSTÉMIQUE]                                   │
│  La question fondatrice de la famille                    │
│                                                          │
│  ○ CHOIX A — Dégénératif                                │
│    La règle du Système A                                 │
│    > Croyance sous-jacente affichée en filigrane         │
│                                                          │
│  ○ CHOIX B — Réforme incrémentale                       │
│    Une amélioration dans le Système A                    │
│    > Toujours insuffisante sans changement de paradigme  │
│                                                          │
│  ○ CHOIX C — Régénératif                                │
│    La règle du Système B                                 │
│    > Croyance actualisée requise                         │
│                                                          │
│  [FEEDBACK après choix]                                  │
│  - Explication causale des effets (2-3 phrases)          │
│  - Animation des courbes impactées                       │
│  - Boucle de rétroaction activée sur la fresque          │
│  - Carte Fresque déverrouillée                           │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Exemple complet — Famille RESSOURCES

```yaml
id: choice_ressources_eau
famille: ressources
question: "Vous dirigez la politique économique d'une région en forte croissance.
           L'industrie réclame davantage d'eau pour ses processus de production."

contexte: >
  La région connaît une croissance économique soutenue. La chambre de commerce
  demande de nouveaux forages et barrages pour répondre aux besoins industriels.
  Les zones humides locales sont déjà en mauvais état.

choix_A:
  label: "Capter davantage d'eau via de nouveaux barrages"
  croyance: "La nature est une ressource infinie et gratuite à notre service"
  effets:
    - { indicateur: ecosystems, delta: -0.08, delai: 2 }
    - { indicateur: resources,  delta: -0.06, delai: 5 }
    - { indicateur: climate,    delta: -0.04, delai: 10 }
  feedback: >
    La production augmente à court terme. Mais les zones humides se dégradent,
    réduisant la capacité de rétention des sols. Dans 15 ans, les sécheresses
    seront plus fréquentes et plus sévères. Boucle renforçante activée :
    surextraction → dégradation écosystèmes → moins de services hydrologiques.

choix_B:
  label: "Instaurer des quotas de consommation d'eau par secteur"
  effets:
    - { indicateur: resources, delta: -0.02, delai: 1 }
  feedback: >
    Les quotas ralentissent la dégradation mais ne s'attaquent pas à la croyance
    fondatrice. La pression économique fera lever les quotas d'ici 5-10 ans.
    C'est "changer LE système", pas "changer DE système".

choix_C:
  label: "Engager une politique d'hydrologie régénérative"
  croyance_requise: "Le système Terre est fini et déstabilisé"
  carte_fresque: lot8-2
  effets:
    - { indicateur: ecosystems, delta: +0.12, delai: 15 }
    - { indicateur: resources,  delta: +0.10, delai: 10 }
    - { indicateur: climate,    delta: +0.06, delai: 20 }
    - { indicateur: resilience, delta: +0.08, delai: 12 }
  feedback: >
    Les effets positifs seront visibles dans 10-20 ans. Court terme :
    baisse de productivité apparente. Long terme : +résilience hydrique,
    +biodiversité, boucle équilibrante activée. Condition : la croyance
    "Terre finie" doit avoir été intégrée en Acte 3 pour débloquer
    l'effet complet (sinon : ×0.5).
```

### 6.3 Règles de cohérence systémique

```typescript
// Incohérences détectées et signalées au joueur (non bloquantes)
const INCONSISTENCIES = [
  {
    condition: (choices) => choices.famille4 === 'C' && choices.famille6 === 'A',
    message: "Vous avez adopté une production circulaire (Famille 4) mais conservé le libre marché sans régulation (Famille 6). Sans règles d'échange coopératives, les pratiques circulaires restent marginales."
  },
  {
    condition: (choices) => choices.famille5 === 'C' && choices.famille3 === 'A',
    message: "Une gouvernance partagée (Famille 5) avec une règle de valeur centrée sur le capital financier (Famille 3) crée une tension : les actionnaires reprendront le contrôle."
  }
];

// Synergies récompensées
const SYNERGIES = [
  {
    condition: (choices) => ['C','C','C'].includes(choices.famille2, choices.famille4, choices.famille6),
    bonus: { resilience: +0.05, ecosystems: +0.04 },
    message: "Synergie Ressources + Production + Échanges : les flux sont bouclés, les déchets deviennent ressources."
  }
];
```

### 6.4 Scoring

```typescript
type Score = {
  coherence: number;     // 0-100 : alignement croyances ↔ règles choisies
  transition: number;    // 0-100 : % indicateurs sur trajectoire régénérative à an 50
  systemic: number;      // 0-100 : activation des boucles équilibrantes
};

// Badges débloqués
const BADGES = [
  { id: 'systemic_thinker',   condition: score.coherence > 80,   label: 'Penseur·euse systémique' },
  { id: 'commons_weaver',     condition: choices.famille6 === 'C', label: 'Tisseuse de communs' },
  { id: 'resilience_builder', condition: score.transition > 70,   label: 'Architecte de la résilience' },
  { id: 'careful',            condition: score.systemic > 75,     label: 'Gardien·ne du vivant' },
];
```

---

## 7. Spécifications UX/UI

### 7.1 Layout principal (desktop 1440px)

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER : titre + acte en cours + barre de progression           │
├────────────────────────┬────────────────────────────────────────┤
│                        │                                        │
│   FRESQUE INTERACTIVE  │      TABLEAU DE BORD — COURBES         │
│   (React Flow)         │      (Recharts / D3.js)                │
│                        │                                        │
│   Cartes et liens      │   8 courbes sur axe X = années 0-100   │
│   apparaissent         │   Légende interactive                  │
│   progressivement      │   Scénarios superposables              │
│   selon l'avancement   │   Tipping points visibles              │
│                        │                                        │
│   Couleur rouge :      │   Slider de temps pour explorer        │
│   Système A actif      │   l'avenir                             │
│   Couleur vert :       │                                        │
│   Système B actif      │                                        │
│                        │                                        │
├────────────────────────┴────────────────────────────────────────┤
│ ZONE DE CHOIX : contexte narratif + 3 options A/B/C             │
│ (visible uniquement pendant les séquences de décision)          │
├─────────────────────────────────────────────────────────────────┤
│ FOOTER : score de cohérence | glossaire | à propos              │
└─────────────────────────────────────────────────────────────────┘
```

**Mobile (< 768px)** : layout vertical — fresque en haut (scrollable), courbes en bas, choix en bottom sheet / drawer.

### 7.2 Palette chromatique

```css
:root {
  /* Systèmes */
  --color-degen:        #8B1A1A;  /* Rouge brique — Système A */
  --color-degen-light:  #F9E8E8;
  --color-regen:        #1A5C2A;  /* Vert forêt — Système B */
  --color-regen-light:  #E8F4EC;
  
  /* Structurel */
  --color-accent:       #2B4C7E;  /* Bleu ardoise — nav, titres */
  --color-accent-light: #E8EEF8;
  --color-transition:   #C87A2A;  /* Ambre — choix B, alertes */
  
  /* Neutre */
  --color-dark:         #1A1A2E;
  --color-mid:          #4A4A6A;
  --color-light:        #F5F4F0;
  --color-white:        #FFFFFF;
  
  /* Courbes (accessibles daltoniens) */
  --curve-climate:      #2563EB;  /* Bleu */
  --curve-ecosystems:   #16A34A;  /* Vert */
  --curve-equity:       #9333EA;  /* Violet */
  --curve-resilience:   #EA580C;  /* Orange */
  --curve-wellbeing:    #0891B2;  /* Cyan */
  --curve-agency:       #CA8A04;  /* Jaune */
  --curve-resources:    #DC2626;  /* Rouge */
  --curve-trust:        #059669;  /* Émeraude */
}
```

### 7.3 Animations clés

| Événement | Animation | Durée |
|-----------|-----------|-------|
| Nouveau choix effectué | Tracé progressif de la courbe impactée | 800ms ease-out |
| Carte Fresque déverrouillée | Apparition en fondu + fil lumineux vers cartes liées | 600ms |
| Boucle de rétroaction activée | Flèche circulaire animée (pulsante) | Loop continu |
| Tipping point approchant | Vibration douce de la courbe (CSS shake) | Loop tant qu'à risque |
| Basculement de paradigme | Animation de "respiration" du fond (rouge→vert) | 2s |
| Acte suivant débloqué | Confetti sobre (particules vertes) | 1.5s |

### 7.4 États des courbes

```
Valeur > 0.7  → Vert : indicateur en bonne santé
Valeur 0.4-0.7 → Gris-bleu : zone de vigilance
Valeur 0.25-0.4 → Orange : zone d'alerte
Valeur < 0.25  → Rouge pulsant : critique
Valeur < tippingPoint → Fond rouge + avertissement "Point de non-retour"
```

---

## 8. Spécifications techniques détaillées

### 8.1 Structure des composants React

```
src/
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx          # Layout principal, routing entre actes
│   │   ├── Header.tsx            # Titre + barre de progression
│   │   └── Footer.tsx
│   ├── fresque/
│   │   ├── FresqueBoard.tsx      # React Flow — graphe des cartes
│   │   ├── SystemCard.tsx        # Carte individuelle (Lots 0-9)
│   │   ├── FeedbackLoop.tsx      # Animation boucle de rétroaction
│   │   └── CardDetail.tsx        # Drawer détail d'une carte au clic
│   ├── dashboard/
│   │   ├── CurvesPanel.tsx       # Panel des 8 courbes
│   │   ├── SingleCurve.tsx       # Courbe individuelle (Recharts)
│   │   ├── ScenarioLegend.tsx    # Légende scénarios superposés
│   │   └── TippingPointAlert.tsx # Alerte point de non-retour
│   ├── game/
│   │   ├── ChoiceCard.tsx        # Carte de choix A/B/C
│   │   ├── NarrativeContext.tsx  # Texte contextuel
│   │   ├── ChoiceFeedback.tsx    # Feedback post-choix
│   │   └── BeliefTag.tsx         # Croyance affichée en filigrane
│   ├── acts/
│   │   ├── Act1_SystemsGame.tsx  # Mini-jeu systémique
│   │   ├── Act2_ThreeSystems.tsx # Drag-and-drop cartes
│   │   ├── Act3_SystemA.tsx      # Déconstruction Système A
│   │   ├── Act4_SystemB.tsx      # Construction Système B
│   │   └── Act5_MyRole.tsx       # Rôle et bilan
│   └── ui/
│       ├── ProgressBar.tsx
│       ├── ScoreDisplay.tsx
│       ├── Badge.tsx
│       └── ExportImage.tsx       # Export PNG des courbes
├── engine/
│   ├── simulation.ts             # Moteur de dynamique des systèmes
│   ├── scenarios.ts              # Scénarios pré-calculés
│   ├── indicators.ts             # Définition des 8 indicateurs
│   ├── effects.ts                # Calcul des effets des cartes
│   └── coherence.ts              # Détection incohérences + synergies
├── data/
│   ├── cards/
│   │   ├── lot0_pedagogie.json
│   │   ├── lot1_grands_systemes.json
│   │   ├── lot2_elements.json
│   │   ├── lot2bis_regles.json
│   │   ├── lot3_emergences.json
│   │   ├── lot4_questions.json
│   │   ├── lot5_regles_A.json
│   │   ├── lot6_croyances_A.json
│   │   ├── lot7_croyances_B.json
│   │   ├── lot8_regles_B.json
│   │   └── lot9_pratiques.json
│   ├── choices/
│   │   ├── famille1_besoins.json
│   │   ├── famille2_ressources.json
│   │   ├── famille3_valeur.json
│   │   ├── famille4_production.json
│   │   ├── famille5_organisation.json
│   │   └── famille6_echanges.json
│   └── scenarios/
│       ├── bau.json
│       ├── reform.json
│       └── transition.json
├── store/
│   ├── gameStore.ts              # Zustand — état global du jeu
│   ├── simulationStore.ts        # État de la simulation + historique
│   └── uiStore.ts                # État UI (acte courant, panels ouverts)
├── hooks/
│   ├── useSimulation.ts          # Hook principal simulation
│   ├── useProgress.ts            # Hook progression du jeu
│   └── useExport.ts              # Hook export image courbes
└── App.tsx
```

### 8.2 State management (Zustand)

```typescript
// gameStore.ts
type GameState = {
  currentAct: 1 | 2 | 3 | 4 | 5;
  completedActs: number[];
  activeCards: CardId[];          // Cartes jouées
  activeBeliefs: BeliefId[];      // Croyances intégrées
  familyChoices: {                // Choix par famille
    [family: string]: 'A' | 'B' | 'C' | null;
  };
  activePractices: PracticeId[];  // Pratiques Lot 9 activées
  indicators: Record<string, number[]>; // Historique par indicateur [an0..an100]
  currentYear: number;            // Année simulée (0-100)
  score: Score;
  sessionId: string;              // UUID généré côté client
};
```

### 8.3 API backend (Node.js/Express — optionnel pour MVP)

```
GET  /api/health                  # Healthcheck Docker
GET  /api/cards/:lot              # Données des cartes par lot
GET  /api/scenarios               # Scénarios pré-calculés
POST /api/simulate                # Calcul serveur (mode multi-joueurs)
POST /api/session                 # Sauvegarde session anonyme
GET  /api/session/:id             # Reprise de session
GET  /api/stats                   # Stats anonymisées agrégées (admin)
```

> **MVP** : le moteur de simulation tourne entièrement en frontend (JavaScript). Le backend n'est requis que pour le mode multi-joueurs (Phase 2) et les analytics.

---

## 9. Infrastructure Docker / Apache2 / ISPConfig

### 9.1 `docker-compose.yml`

```yaml
version: '3.9'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5079:80"    # Port hôte exposé → Apache2 ProxyPass
    environment:
      - NODE_ENV=production
      - REACT_APP_API_URL=/api
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    expose:
      - "8000"       # Interne seulement, accessible via frontend Nginx
    environment:
      - NODE_ENV=production
      - PORT=8000
    restart: unless-stopped

networks:
  default:
    name: fresques_network
```

### 9.2 `frontend/Dockerfile`

```dockerfile
# Stage 1 — Build React
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2 — Serve avec Nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 9.3 `frontend/nginx.conf`

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # SPA — toutes les routes vers index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy vers backend
    location /api/ {
        proxy_pass http://backend:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Cache assets statiques
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

### 9.4 `backend/Dockerfile`

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8000
USER node
CMD ["node", "src/index.js"]
```

### 9.5 Configuration Apache2 (ISPConfig)

```apache
# À ajouter dans la vhost de play.fresquesystemique.org
# (via ISPConfig → Sites → play.fresquesystemique.org → Options → Apache directives)

ProxyRequests Off
ProxyPreserveHost On

ProxyPass        / http://127.0.0.1:5079/
ProxyPassReverse / http://127.0.0.1:5079/

# Headers sécurité
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

> **Dans ISPConfig** : activer le module proxy via `a2enmod proxy proxy_http headers` puis redémarrer Apache2. Le SSL (Let's Encrypt) est géré par ISPConfig directement sur le vhost.

### 9.6 Workflow de déploiement

```bash
# Sur le VPS, depuis le répertoire du projet
git pull origin main
docker compose down
docker compose build --no-cache
docker compose up -d
docker compose logs -f   # Vérification
```

---

## 10. Structure des fichiers du projet

```
fresques-jeu/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
│
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── public/
│   │   └── index.html
│   └── src/
│       └── [voir section 8.1]
│
└── backend/
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── index.js
        ├── routes/
        │   ├── cards.js
        │   ├── simulate.js
        │   └── sessions.js
        └── engine/
            └── simulation.js
```

---

## 11. Schéma de données JSON

### 11.1 Schéma d'une carte (tous les lots)

```jsonc
{
  "id": "lot5-1",
  "lot": 5,
  "titre": "Les énergies fossiles en abondance",
  "sousTitre": null,
  "paradigme": "A",           // "A" | "B" | "neutre"
  "famille": "ressources",    // "besoins" | "ressources" | "valeur" | "production" | "organisation" | "echanges"
  "texte_court": "80% de l'énergie mondiale est fossile...",
  "texte_complet": "Le développement des activités dont le support est matériel...",
  "sources": ["IEA", "IPCC"],
  "croyance_liee": "lot6-1",  // ID de la croyance sous-jacente
  "carte_opposee": "lot8-1",  // ID de la carte du paradigme opposé
  "effets_indicateurs": {
    "climate":    { "delta": -0.04, "delayYears": 10 },
    "ecosystems": { "delta": -0.03, "delayYears": 8 },
    "resources":  { "delta": -0.06, "delayYears": 5 }
  },
  "boucles_retro": ["r_extraction_degradation"],  // IDs des boucles activées
  "position_fresque": { "x": 200, "y": 150 }     // Coordonnées initiales React Flow
}
```

### 11.2 Schéma d'un choix (familles 1-6)

```jsonc
{
  "id": "choice_ressources_eau",
  "famille": "ressources",
  "ordre": 2,
  "question": "Vous dirigez la politique économique d'une région...",
  "contexte": "La région connaît une croissance...",
  
  "choix_A": {
    "label": "Capter davantage d'eau via de nouveaux barrages",
    "croyance_id": "lot6-1",
    "effets": [
      { "indicatorId": "ecosystems", "delta": -0.08, "delayYears": 2 }
    ],
    "feedback": "La production augmente à court terme..."
  },
  
  "choix_B": {
    "label": "Instaurer des quotas de consommation d'eau",
    "effets": [
      { "indicatorId": "resources", "delta": -0.02, "delayYears": 1 }
    ],
    "feedback": "Les quotas ralentissent la dégradation mais..."
  },
  
  "choix_C": {
    "label": "Engager une politique d'hydrologie régénérative",
    "croyance_requise": "lot7-1",
    "carte_fresque": "lot8-2",
    "effets": [
      { "indicatorId": "ecosystems", "delta": 0.12, "delayYears": 15 },
      { "indicatorId": "resilience", "delta": 0.08, "delayYears": 12 }
    ],
    "feedback": "Les effets positifs seront visibles dans 10-20 ans..."
  }
}
```

---

## 12. Roadmap et priorités MVP

### Phase 1 — MVP (6-8 semaines)

**Objectif** : prototype testable avec un groupe de facilitateurs Fresque Systémique.

```
Semaine 1-2 : Fondations
  ✓ Setup Docker + Apache2/ISPConfig + domaine play.fresquesystemique.org
  ✓ Projet React + TypeScript + Tailwind + Recharts
  ✓ Layout principal (fresque + courbes + zone choix)
  ✓ JSON des lots 5, 6, 7, 8 complet

Semaine 3-4 : Moteur + courbes
  ✓ Moteur de simulation (8 indicateurs, calcul front)
  ✓ 3 scénarios pré-calculés (BAU / REFORM / TRANSITION)
  ✓ Composant CurvesPanel avec animation Recharts
  ✓ Tipping points visuels

Semaine 5-6 : Jeu complet (actes 1-5)
  ✓ Acte 1 : mini-jeu systémique
  ✓ Acte 2 : drag-and-drop 3 systèmes + émergences
  ✓ Acte 3 : Famille RESSOURCES complète (choix A/B/C + feedback)
  ✓ Acte 4 : activation croyances B + 3 pratiques Lot 9
  ✓ Acte 5 : bilan + badges

Semaine 7-8 : Polish + déploiement
  ✓ Animations Framer Motion
  ✓ Responsive mobile
  ✓ Export PNG des courbes
  ✓ Déploiement VPS + CI/CD basique
```

**Critère de sortie MVP** : un joueur sans prérequis complète le parcours en 45 min et comprend pourquoi le Choix B (réforme incrémentale) est insuffisant.

### Phase 2 — Jeu complet (3-4 mois)

```
  ✓ Les 6 familles de règles et leurs croyances
  ✓ Toutes les pratiques régénératives du Lot 9 (30 cartes)
  ✓ Système de cohérence systémique (incohérences + synergies)
  ✓ Récit personnalisé généré en fin de partie
  ✓ Mode multi-joueurs synchronisé (WebSocket)
  ✓ Fresque interactive complète (React Flow, tous les liens)
```

### Phase 3 — Plateforme (3-6 mois)

```
  ✓ Mode facilitateur (tableau de bord groupes)
  ✓ Éditeur de scénarios personnalisés
  ✓ API pour intégration LMS (SCORM / xAPI)
  ✓ Analytics pédagogiques (Matomo, privacy-first)
  ✓ Internationalisation (EN, ES)
```

### Indicateurs de succès

| Indicateur | Cible MVP | Cible Phase 2 |
|------------|-----------|---------------|
| Taux de complétion | ≥ 50% | ≥ 65% |
| Durée session | 35-60 min | 45-75 min |
| Compréhension insuffisance réformes | 60% oui | 75% oui |
| Adoptions par facilitateurs FS | 10 | 50 |

---

## 13. Références théoriques

### Systémique et dynamique des systèmes
- **Meadows, D. et al. (1972)**. *Les Limites à la croissance*. Club de Rome. ← Inspiration directe des courbes
- **Meadows, D. (2008)**. *Thinking in Systems*. Chelsea Green. ← Boucles, stocks, flux, délais
- **Forrester, J.W. (1971)**. *World Dynamics*. ← Fondements de la dynamique des systèmes
- **Keller, A.** Vulgarisation de la systémique de la polycrise. ← Cadre conceptuel de la Fresque

### Contenu des paradigmes
- **Brunel, V., Deux, R., Marcé, L. (2024-2026)**. *Fresque Systémique v5.3.1*. ← **Source principale**
- **Delannoy, I. (2017)**. *L'économie symbiotique*. Actes Sud. ← Théorie des pratiques régénératives
- **Raworth, K. (2017)**. *Doughnut Economics*. ← Valeur étendue, besoins fondamentaux
- **Jackson, T. (2009)**. *Prosperity without Growth*. ← Système monétaire régénératif
- **Max-Neef, M. (1991)**. *Human Scale Development*. ← Besoins humains fondamentaux
- **Ostrom, E. (1990)**. *Governing the Commons*. ← Gouvernance des communs
- **Hamant, O.** *Robustesse.org*. ← Robustesse vs performance

### Pédagogie et design de jeu
- **Kolb, D. (1984)**. *Experiential Learning*. ← Apprentissage par l'expérience
- **Institut Berkana**. Double boucle de la transition systémique. ← Rôles (Acte 5)
- **Fresque du Climat (2020-)**. Pédagogie de référence.

---

## Notes pour Claude Code

### Conventions de développement

```
- TypeScript strict mode activé
- ESLint + Prettier configurés
- Commits conventionnels : feat/fix/docs/chore
- Tests unitaires sur le moteur de simulation (Vitest)
- Pas de `any` dans le moteur de simulation — typage complet
- Les données JSON des cartes sont la source de vérité — ne pas hardcoder dans les composants
- Chaque acte est un composant autonome importé dans AppShell
```

### Ordre de développement recommandé

```
1. engine/simulation.ts          ← moteur en pur TypeScript, testable isolément
2. data/ JSON                    ← toutes les cartes des lots 5-8
3. store/gameStore.ts            ← état global Zustand
4. components/dashboard/         ← courbes D3/Recharts
5. components/game/              ← mécanique A/B/C
6. components/acts/              ← actes 1 à 5
7. components/fresque/           ← React Flow (peut venir après)
8. Infrastructure Docker         ← en dernier, une fois le jeu fonctionnel
```

### Points d'attention critiques

```
⚠ Les délais de latence (delayYears) sont pédagogiquement essentiels :
  les rendre très visibles dans les courbes est une priorité de design.

⚠ Le Choix B doit TOUJOURS paraître raisonnable mais être montré insuffisant
  → son feedback doit l'expliquer clairement sans être moralisateur.

⚠ Pas d'authentification, pas de compte — friction zéro.
  La session est locale (localStorage) avec un UUID généré au démarrage.

⚠ Le contenu (cartes JSON) est sous licence CC BY-NC-ND de l'association
  Fresque Systémique. Toute utilisation commerciale nécessite une licence.
```

---

*Cahier des charges v1.0 — 2026*
*Basé sur la Fresque Systémique v5.3.1 de Valérie Brunel, Raphaël Deux & Loïc Marcé*
*Licence contenu : CC BY-NC-ND — fresquesystemique.org*
