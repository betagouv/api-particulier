![CI](https://github.com/betagouv/api-particulier-monolith/actions/workflows/test.yml/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/3df2ced309795305856f/maintainability)](https://codeclimate.com/github/betagouv/api-particulier-monolith/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/3df2ced309795305856f/test_coverage)](https://codeclimate.com/github/betagouv/api-particulier-monolith/test_coverage)

# Installation

## Prérequis

- [Docker](https://www.docker.com/community-edition)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/en/)

## Étapes

- Ajouter `127.0.0.1 mon.portail.local` dans votre fichier `/etc/hosts`
- `cp .env.dist .env`
- Demander à un collègue ou ami les valeurs des secrets à mettre en variable d'environnement
- `docker-compose up`

> Attention, l'installation peut échouer si vous ne définissez pas correctement le `.env`, par exemple la commande de migration ne saura pas se connecter à la base de données

Une fois les containers lancés, vous pouvez préparer votre environnement de développement local en lançant les commandes suivantes dans le container `web` accessible par la commande `docker-compose exec web sh` :
- `npm run migrate up`
- `npm run fixtures:load`

## Installations alternatives

### En local

Si vous ne souhaitez pas faire tourner l'application sur un devcontainer ou que vous ne souhaitez pas utiliser VSCode, vous pouvez tout à fait le faire tourner sur votre machine hôte, ou dans un Docker.

Plusieurs options s'offrent à vous :
- vous faites tout tourner sur votre machine, il vous faudra :
  - NodeJs version >= 14
  - PostgreSQL avec extension [Timescaledb](https://www.timescale.com/)
- vous faites tourner NodeJs sur votre machine, et Timescaledb sur Docker

### Sur Github Codespace

Le projet est configuré pour être développé dans un [devcontainer](https://code.visualstudio.com/docs/remote/containers), et donc par extension fonctionne dans [Github Codespace](https://github.com/features/codespaces).

Nous supposons que vous utilisez [VSCode](https://code.visualstudio.com/) en tant qu'IDE pour exploiter la capacité Codespace du projet.

[Github Codespace](https://github.com/features/codespaces) se base sur les devcontainers, si vous êtes utilisateur de Github Codespace vous pouvez tout simplement créer un codespace pour le projet en allant sur [sa page Github](https://github.com/betagouv/api-particulier) et en appuyant sur `.`.

## Configuration

Toute la configuration se fait par variable d'environnement, selon les recommandations de [Twelve-factor app](https://12factor.net/fr/).

Si vous avez choisir l'installation par Docker compose, vous n'avez rien à configurer.

Parmi les variables d'environnement notables, si vous n'avez pas choisi le mode d'installation par docker-compose, vous serez amené à modifier :
- `DATABASE_URL`
- `TEST_DATABASE_URL`

## Vérifier l'installation

Afin de vous assurer que vous êtes prêts à développer sur le projet, vous pouvez lancer les tests suivants depuis le container web, accessbile par `docker-compose exec web sh` :
- `npm run type-check`
- `npm test`
- `npm run test:integration`

Si vous êtes utilisateur de VSCode, vous pouvez également utiliser l'extension [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) afin d'exploiter le fichier `api.http` présent à la racine du projet.

Ce fichier recense tous les appels usuels à l'API qui vous seront utiles pour tester vos développements en local et en recette.

# Développement

## Bac à sable ou appels aux fournisseurs de donnée ?

L'API possède deux modes de fonctionnement, choisis selon la variable d'env `SANDBOXED` :
- `SANDBOXED=true` : mode bac à sable, l'API n'appelle pas les fournisseurs de donnée et se base sur les données Airtable
- `SANDBOXED=false` : mode réel, l'API appelle les fournisseurs de donnée

## Lancement de l'application

L'application possède deux couches de présentation principales :
- l'API et le backend, lancés par la commande `npm run start:dev:backend`
- le frontend, sous la forme du portail développeur, lancé par la commande `npm run start:dev:frontend`

Le container `web` lancé par Docker compose lance la commande `npm run start:dev`, qui lance en parallèle les deux commandes précédentes. Vous n'avez rien à faire pour lancer l'application, elle tourne déjà.

Une fois les containers démarrés, vous pouvez vous rendre sur [https://mon.portail.local:3000](https://mon.portail.local:3000) afin de récupérer votre jeton d'API.

# Tests

L'application possède 4 niveaux de test :
- `npm run type-check` - exécutable sur votre machine directement : analyse statique de types
- `npm test` - exécutable sur votre machine directement : tests unitaires
- `npm run test:integration` - exécutable dans le container `web` : tests d'intégration
- `npm run test:end-to-end` - exécutable sur votre machine directement : tests end-to-end, lancés principalement sur la [CI](https://github.com/betagouv/api-particulier/actions)
