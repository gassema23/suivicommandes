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

---
### Push sur github
```bash
git push origin features