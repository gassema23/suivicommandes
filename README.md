# Suivi des commandes

Application de gestion et de suivi des commandes, équipes et utilisateurs.

## Sommaire

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Technologies](#technologies)
- [Développement](#développement)
- [Conventions](#conventions)
- [Auteurs](#auteurs)

---

## Présentation

**Suivi des commandes** est une application web permettant de gérer des équipes, des utilisateurs, des rôles et des commandes, avec une interface d’administration moderne et sécurisée.

## Fonctionnalités

- Gestion des utilisateurs, rôles et permissions
- Gestion des équipes et de leurs membres
- Suivi des commandes
- Authentification JWT
- Interface d’administration (frontend)
- API RESTful (backend)
- Filtres, recherche, pagination, tri
- Sécurité et gestion fine des accès

## Architecture

- **Frontend** : React + TanStack Router + React Query + shadcn/ui
- **Backend** : NestJS + TypeORM
- **Base de données** : PostgreSQL
- **Autres services** : Redis, PgAdmin, RedisInsight
- **Conteneurisation** : Docker & Docker Compose

## Installation

### Prérequis

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Lancer l’application

```bash
git clone https://github.com/votre-utilisateur/suivicommandes.git
cd suivicommandes
docker-compose up --build
```

### Push sur github
```bash
git add .
git commit -m "description des modifs"
git push origin features
```

## Conventions

### Structure recommandée

```text
src/
├── assets/               # Images, SVGs, fichiers statiques
│   └── logo.svg
│
├── components/           # Composants réutilisables (généraux)
│   ├── ui/               # Boutons, Inputs, Modals, etc. (souvent liés à ShadCN)
│   └── layout/           # Navbar, Sidebar, Footer, etc.
│
├── features/             # Domaines métiers, chacun avec ses propres composants, hooks, services
│   ├── users/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   └── ...               # Autres domaines (sectors, services, etc.)
│
├── hooks/                # Hooks globaux (non liés à un domaine spécifique)
│   ├── useAuth.ts
│   └── useDebounce.ts
│
├── lib/                  # Code d'infrastructure (API, date, validation, etc.)
│   ├── api.ts            # Axios/fetch configuration
│   ├── auth.ts           # Auth helpers
│   └── validators.ts     # Zod ou Yup validators
│
├── pages/                # Pages si tu utilises Next.js
│   └── index.tsx
│
├── routes/               # Fichiers de routage si nécessaire (ex: React Router)
│   └── AppRoutes.tsx
│
├── store/                # Zustand, Redux ou autre state global
│   └── authStore.ts
│
├── styles/               # Fichiers CSS globaux ou Tailwind config
│   └── globals.css
│
├── types/                # Types globaux
│   └── index.d.ts
│
├── utils/                # Fonctions utilitaires pures
│   └── formatDate.ts
│
├── App.tsx
└── main.tsx
```

### Bonnes conventions

| Élément             | Convention                                                        |
| ------------------- | ----------------------------------------------------------------- |
| Composants React    | `PascalCase` : `UserCard.tsx`, `Sidebar.tsx`                      |
| Fichiers service    | `kebab-case.service.ts` : `user.service.ts`                       |
| Hooks               | `useCamelCase.ts` : `useUserList.ts`                              |
| Dossiers de domaine | `features/nom-domaine/`                                           |
| Fichiers typés      | `user.ts`, `form.ts`, etc. dans `types/` ou `features/.../types/` |
