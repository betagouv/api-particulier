![CI](https://github.com/betagouv/api-particulier-monolith/actions/workflows/test.yml/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/3df2ced309795305856f/maintainability)](https://codeclimate.com/github/betagouv/api-particulier-monolith/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/3df2ced309795305856f/test_coverage)](https://codeclimate.com/github/betagouv/api-particulier-monolith/test_coverage)

# Installation

Le projet est configuré pour être développé dans un [devcontainer](https://code.visualstudio.com/docs/remote/containers).

Nous supposons dans la suite que [VSCode](https://code.visualstudio.com/) est utilisé pour développer.

- Ajouter `127.0.0.1 mon.portail.local` dans votre fichier `/etc/hosts`
- `cp .env.dist .env`
- Demander à un collègue ou ami les valeurs des secrets à mettre en variable d'environnement
- Ouvrir le projet avec VSCode
- VSCode va vous proposer de lancer le devcontainer, si ce n'est pas le cas lancez la commande `Remote-containers: Rebuild in container and reopen`

> Attention, l'installation peut échouer si vous ne définissez pas correctement le `.env`, par exemple la commande de migration ne saura pas se connecter à la base de données

## Installations alternatives

### En local

Si vous ne souhaitez pas faire tourner l'application sur un devcontainer ou que vous ne souhaitez pas utiliser VSCode, vous pouvez tout à fait le faire tourner sur votre machine hôte, ou dans un Docker.

Plusieurs options s'offrent à vous :
- vous faites tout tourner sur votre machine, il vous faudra :
  - NodeJs version >= 14
  - PostgreSQL avec extension [Timescaledb](https://www.timescale.com/)
- vous faites tourner NodeJs sur votre machine, et Timescaledb sur Docker

### Sur Github Codespace

[Github Codespace](https://github.com/features/codespaces) se base sur les devcontainers, si vous êtes utilisateur de Github Codespace vous pouvez tout simplement créer un codespace pour le projet en allant sur [sa page Github](https://github.com/betagouv/api-particulier) et en appuyant sur `.`.

## Configuration

Toute la configuration se fait par variable d'environnement, selon les recommandations de [Twelve-factor app](https://12factor.net/fr/).

Parmi les variables d'environnement notables, si vous n'avez pas choisi le mode d'installation par docker-compose, vous serez amené à modifier :
- `DATABASE_URL`
- `TEST_DATABASE_URL`

## Vérifier l'installation

Afin de vous assurer que vous êtes prêts à développer sur le projet, vous pouvez lancer les tests suivants :
- `npm run type-check`
- `npm test`
- `npm run test:integration`

# Développement

## Bac à sable ou appels aux fournisseurs de donnée ?

L'API possède deux modes de fonctionnement, choisis selon la variable d'env `SANDBOXED` :
- `SANDBOXED=true` : mode bac à sable, l'API n'appelle pas les fournisseurs de donnée et se base sur les données Airtable
- `SANDBOXED=false` : mode réel, l'API appelle les fournisseurs de donnée

## Lancement de l'application

L'application possède deux couches de présentation principales :
- l'API et le backend, lancés par la commande `npm run start:dev:backend`
- le frontend, sous la forme du portail développeur, lancé par la commande `npm run start:dev:frontend`

Une fois ces commandes lancées, vous pouvez vous rendre sur [https://mon.portail.local:3000](https://mon.portail.local:3000) afin de récupérer votre jeton d'API.

# Tests

L'application possède 4 niveaux de test :
- `npm run type-check` : analyse statique de types
- `npm test` : tests unitaires
- `npm run test:integration` : tests d'intégration
- les tests end-to-end, lancés principalement sur la [CI](https://github.com/betagouv/api-particulier/actions)
