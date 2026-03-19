# PlaySystemic

Jeu de prospective systémique interactif basé sur la **Fresque Systémique v5.3.1** (Brunel, Deux & Marcé).

> Domaine : `play.fresquesystemique.org` · Port : `5079` · Stack : React + Node.js + Docker + Apache2/ISPConfig

---

## Table des matières

1. [Prérequis](#1-prérequis)
2. [Installation sur le VPS (première fois)](#2-installation-sur-le-vps-première-fois)
3. [Configuration Apache2 / ISPConfig](#3-configuration-apache2--ispconfig)
4. [Déploiement et mises à jour](#4-déploiement-et-mises-à-jour)
5. [Développement local](#5-développement-local)
6. [Architecture](#6-architecture)
7. [Commandes utiles](#7-commandes-utiles)

---

## 1. Prérequis

Sur le VPS (Ubuntu 20.04+ ou Debian 11+) :

```bash
# Docker + Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # puis se reconnecter
docker --version                # ≥ 24.x
docker compose version          # ≥ 2.x (plugin intégré)

# Git
sudo apt install git -y

# Apache2 modules (si pas déjà activés via ISPConfig)
sudo a2enmod proxy proxy_http headers rewrite
sudo systemctl restart apache2
```

---

## 2. Installation sur le VPS (première fois)

### 2.1 Cloner le dépôt

```bash
# Choisir l'emplacement du projet (adapter selon votre VPS)
sudo mkdir -p /var/www/playsystemic
sudo chown $USER:$USER /var/www/playsystemic

git clone https://github.com/raphaeldeux/playsystemic.git /var/www/playsystemic
cd /var/www/playsystemic
```

### 2.2 Configurer les variables d'environnement

```bash
cp .env.example .env
# Éditer si nécessaire (les valeurs par défaut conviennent pour le MVP)
nano .env
```

### 2.3 Builder et lancer les conteneurs

```bash
cd /var/www/playsystemic
docker compose build --no-cache
docker compose up -d

# Vérifier que les conteneurs tournent
docker compose ps
docker compose logs -f    # Ctrl+C pour quitter
```

L'application est maintenant accessible sur `http://localhost:5079`.

---

## 3. Configuration Apache2 / ISPConfig

### 3.1 Via l'interface ISPConfig

1. Dans ISPConfig : **Sites → Websites → `play.fresquesystemique.org`**
2. Onglet **Options** → champ **Apache Directives** → coller :

```apache
ProxyRequests Off
ProxyPreserveHost On

ProxyPass        / http://127.0.0.1:5079/
ProxyPassReverse / http://127.0.0.1:5079/

Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

3. Cliquer **Save** → ISPConfig recharge Apache automatiquement.

> **SSL** : activer Let's Encrypt directement dans ISPConfig (onglet **SSL** du même vhost). Le certificat est géré automatiquement.

### 3.2 Vérification

```bash
# Tester le reverse proxy
curl -I http://play.fresquesystemique.org

# Vérifier les modules Apache
apache2ctl -M | grep -E "proxy|headers"
# Doit afficher : proxy_module, proxy_http_module, headers_module
```

---

## 4. Déploiement et mises à jour

### Mettre à jour l'application depuis le dépôt GitHub

```bash
cd /var/www/playsystemic

# Récupérer les dernières modifications depuis main
git pull origin main

# Rebuilder et relancer (zéro downtime : build avant d'arrêter)
docker compose build --no-cache
docker compose down
docker compose up -d

# Vérifier
docker compose ps
docker compose logs frontend --tail=20
```

### Script de déploiement automatisé (optionnel)

Créer `/usr/local/bin/deploy-playsystemic` :

```bash
#!/bin/bash
set -e

PROJECT_DIR="/var/www/playsystemic"
echo "[deploy] Mise à jour PlaySystemic..."

cd "$PROJECT_DIR"
git pull origin main
docker compose build --no-cache
docker compose down
docker compose up -d

echo "[deploy] OK — PlaySystemic déployé sur le port 5079"
docker compose ps
```

```bash
chmod +x /usr/local/bin/deploy-playsystemic
# Lancer une mise à jour :
deploy-playsystemic
```

---

## 5. Développement local

### Lancer en mode développement (avec hot-reload)

```bash
# Frontend (React, port 3000)
cd frontend
npm install
npm start

# Backend (Express, port 8000) — dans un autre terminal
cd backend
npm install
npm run dev
```

L'application est accessible sur `http://localhost:3000`.

> En développement, le frontend proxy les requêtes `/api/` vers `http://localhost:8000` via la config `package.json → proxy`.

### Ajouter le proxy de développement dans `frontend/package.json`

```json
{
  "proxy": "http://localhost:8000"
}
```

### Build de production (test local)

```bash
cd /var/www/playsystemic
docker compose build
docker compose up -d
# Accéder à http://localhost:5079
```

---

## 6. Architecture

```
Internet
    │
    ▼
Apache2 (ISPConfig)
play.fresquesystemique.org:443 (SSL Let's Encrypt)
    → ProxyPass → http://127.0.0.1:5079
    │
    ▼
Docker Compose
    ├── frontend  (React build, Nginx, port interne 80)
    │   └── exposé hôte : 5079:80
    └── backend   (Node.js/Express, port interne 8000)
        └── accessible depuis frontend via http://backend:8000
```

```
frontend/
├── src/
│   ├── engine/          # Moteur de simulation TypeScript
│   ├── data/            # Données JSON (cartes, choix, scénarios)
│   ├── store/           # État global Zustand
│   └── components/
│       ├── acts/        # Les 5 actes du jeu
│       ├── dashboard/   # Courbes Recharts
│       ├── game/        # Mécanique A/B/C
│       └── layout/      # Shell, Header, Footer, Glossaire
backend/
└── src/index.js         # API Express (healthcheck, sessions, stats)
```

---

## 7. Commandes utiles

```bash
# État des conteneurs
docker compose ps

# Logs en temps réel
docker compose logs -f
docker compose logs frontend -f
docker compose logs backend -f

# Redémarrer un service sans rebuild
docker compose restart frontend

# Arrêter tout
docker compose down

# Arrêter et supprimer les volumes
docker compose down -v

# Inspecter le conteneur frontend
docker exec -it $(docker compose ps -q frontend) sh

# Vérifier l'espace disque utilisé par Docker
docker system df
docker system prune -f    # nettoyer images/conteneurs inutilisés
```

### Healthcheck

```bash
# Backend
curl http://localhost:8000/health
# → {"status":"ok","service":"playsystemic-backend","version":"1.0.0"}

# Frontend (via Docker)
curl -I http://localhost:5079
# → HTTP/1.1 200 OK
```

---

## Licence

Contenu pédagogique sous licence **CC BY-NC-ND** — [fresquesystemique.org](https://fresquesystemique.org)
Code source : MIT

*Basé sur la Fresque Systémique v5.3.1 de Valérie Brunel, Raphaël Deux & Loïc Marcé*
