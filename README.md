[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=22257759&assignment_repo_type=AssignmentRepo)
# Création d'une API Pokémon

Notre projet est de créer une Application fullstack permettant de gérer des cartes pokémons. Dans ce mmodule nous allons nous concentrer sur la partie backend de l'application.

Nous allons tâcher de créer une API permettant d'effectuer des opérations CRUD sur des cartes pokemons. Ce projet sera réalisé avec Express pour la partie serveur et Prisma pour la partie base de donnée.

## Grille de notation

| Critère                           | Points | Description                                                                                                                                              |
| --------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Qualité des endpoints             | 5      | Les endpoints sont fonctionnels et répondent aux critères définis: logique correcte et bon format de réponse avec le bon code HTTP                       |
| Définition des types (typescript) | 1      | Utilisation de typescript pour la définition des types et aucune erreur lors de l'utilisation de la commande `npm run type-check`                        |
| Gestion des erreurs               | 2      | Les erreurs sont gérées avec le bon code HTTP et un message clair et précis                                                                              |
| Middleware d'authentification     | 2      | Les routes nécessitant une authentification sont protégées par un middleware d'authentification                                                          |
| Architecture du projet            | 1      | Respect de la structure du projet indiquée ou une autre cohérente                                                                                        |
| Test d'intégration                | 3      | Tester les codes HTTP et les valeurs de retours au minimum pour chaque endpoint. Et vérifier d'avoir un de coverage 100% via la commande `npm run test`. |
| Documentation                     | 2      | Documentation Swagger disponible à l'url `/api-docs`                                                                                                     |

> N'oublier pas de renseigner votre nom et prénom dans le champs `author` du fichier `package.json`.
> La grille est notée sur 16 points. La section bonus vous propose différentes méthodes pour augmenter votre score. Voir la section [Bonus](#bonus).

## Initialisation

1. Cloner le projet avec `git clone` et installer les dépendances en vous basant sur le `package-lock.json` avec `npm ci`.
2. Initialiser la base de donnée avec la commande `npm run db:migrate`.
3. Initialiser la base de donnée avec des données de test avec la commande `npm run db:seed`.
4. Regénérer le fichier `prisma/client` avec la commande `npx prisma generate`.
5. Lancer le serveur avec la commande `npm run dev`.

## Introduction

#### Prérequis

- NodeJS version lts
- Postman : pour vérifier nos requêtes
- Editeur de code type VsCode

#### Package.json

Le fichier `package.json` contient plusieurs `scripts` qui vous seront utiles:

- `npm run dev` : permet de lancer le serveur en mode développement
- `npm run db:reset` : permet de réinitialiser la base de donnée en appliquant les migrations et en réinitialisant les données.
- `npm run db:migrate` : permet de créer la base de donnée en fonction du fichier `schema.prisma`.
- `npm run db:generate` : permet de générer le fichier `prisma/client` qui permet de communiquer avec la base de données.
- `npm run db:studio` : permet de lancer l'interface graphique de prisma pour visualiser la base de donnée
- `npm run build` : permet de compiler le projet en typescript.
- `npm run type-check` : permet de vérifier les types.
- `npm run test` : permet de lancer les tests.
- `npm run test:coverage` : permet de lancer les tests et de générer un rapport de coverage.
- `npm run start` : permet de lancer le serveur en mode production.

#### Base de données

Le projet contient un dossier `prisma` qui se compose de plusieurs fichiers.

- Un fichier `schema.prisma` qui contient la structure de notre base de donnée. Ce fichier à d'ailleurs déja défini une table `Types` qui contient les types de pokémons.
- Un fichier `seed.js` qui permet d'initialiser la base de donnée avec des données de test.
- Un dossier `migrations` qui contient les migrations de la base de donnée. Vous rajouterez vos migrations si vous modifier le fichier `schema.prisma`. **NE PAS SUPPRIMER CE DOSSIER**

#### Source

Dans le dossier:

- `src` vous trouverez un fichier `index.ts` qui contient le code de base de notre serveur. Vous pouvez lancer le serveur avec la commande `npm run dev`.
- `client.ts` qui contient la configuration de notre client prisma.

#### Tests

Dans le dossier `tests` vous trouverez des fichiers de tests pour chaque endpoint de l'API. Vous pouvez lancer les tests avec la commande `npm run test`. La configuration est déjà faite pour vous. Il ne reste plus qu'à compléter les tests. Plus de détails dans la partie [Tests d'intégration](#tests-dintégration).

## Endpoints `PokemonCard`

Nous allons commencer par créer une API permettant de gérer des cartes pokémons.

#### Prisma

Pour ce faire vous allez modifier le modèle `PokemonCard` existant dans le fichier `schema.prisma` afin qu'il corresponde aux informations suivantes:

| Nom        | Type      | Propriété      | Description                            |
| ---------- | --------- | -------------- | -------------------------------------- |
| id         | Int       | clé primaire   | Identifiant unique de la carte         |
| name       | String    | requis, unique | Nom du Pokémon                         |
| pokedexId  | Int       | requis, unique | Identifiant du pokémon dans le pokédex |
| type       | REF(Type) | requis         | Type du Pokémon (relation 1-N)         |
| lifePoints | Int       | requis         | Points de vie                          |
| size       | Float     |                | Taille                                 |
| weight     | Float     |                | Poids                                  |
| imageUrl   | String    |                | Url de l'image du Pokémon              |

> N'oubliez pas d'appliquer une migration après avoir modifié le fichier `schema.prisma` avec la commande `npm run db:migrate`.

> Vous compléterez aussi le `seed.ts` pour initialiser la table `PokemonCard` en conséquence.

> Le tableau montre le modèle de la table il ne correspond pas exactement au modèle prisma. Vous devrez donc adapter les types en conséquence (en particulier pour les relations).

#### Routes

Le but va être de créer les endpoints pour gérer les cartes pokémons. Ces endpoints seront les suivants:

- `GET:/pokemons-cards` : permet d'obtenir la liste de tous les pokémons
- `GET:/pokemons-cards/:pokemonCardId` : permet d'obtenir un pokémon spécifique en fonction de la clé `pokemonCardId` passé en paramètre.
- `POST:/pokemon-cards` : permet d'enregistrer le pokémon dont les propriétés sont passées dans le body de la requête
- `PATCH:/pokemon-cards/:pokemonCardId` : permet de modifier le pokémon donc le `pokemonCardId` est passé en paramètre et les propriétés passées dans le body.
- `DELETE:/pokemon-cards/:pokemonCardId:` : permet de supprimer le pokémon renseigné avec son `pokemonCardId`.

> Le pokemonId de l'endpoint correspond au champs `id` du modèle `PokemonCard`.

Dans le cas des endpoints `POST` et `PATCH` vous avez besoin de données à renseigner dans le body. Voici des exemples de ce à quoi elles peuvent ressembler:

```JSON
{
  "name":"Bulbizarre",
  "pokedexId":1,
  "size":0.7,
  "type":1, // Référence à l'id de la table types
  "lifePoints":45,
  "weight":6.9,
  "size":0.7,
  "imageUrl":"https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png"
}
```

#### Codes HTTP

Pour chaque endpoint vous devrez renvoyer un code HTTP correspondant à la situation. Voici une liste des codes HTTP que vous pouvez utiliser:

- `200 OK` : La requête a réussi
- `201 Created` : Si la création a réussi
- Si le `pokemonCardId` n'existe pas on renvoie une erreur `404 Not Found` en précisant que l'id renseigné n'existe pas.

Dans le cas d'une création et d'un update vous allez vérifier une série d'éléments avant d'appeler le modèle. Si le test n'est pas bon vous renverrez l'erreur indiquée:

- Si champs type contient l'id d'un type qui n'existe pas on renvoie une erreur `400 Bad Request` en précisant que l'id renseigné n'existe pas.
- Si le `name` du pokémon ou le `pokedexId` est déjà renseignée en base sur l'une des lignes de la table alors on renvoie une erreur `400 Bad Request` en indiquant qu'il y a un doublon de data.
- Si un champs requis est vide on renvoie une erreur `400 Bad Request` en indiquant quel champs est vide.

## Structure du projet

Votre projet est probablement en train de devenir un peu bordélique. Il serait préférable de lui donner une structure plus claire. Cela pourra vous aider à vous y retrouver plus facilement ou d'autres développeurs à comprendre votre code.

> Vous pouvez suivre la structure vu en cours ou si vous en avez une autre en tête vous pouvez bien sûr l'utiliser. L'important est de rester cohérent dans votre projet.

## Utilisateurs et accès authentifié

Nous allons essayer d'ajouter des fonctionnalités de permissions afin que certains endpoint ne soient pas accessibles si vous n'êtes pas connectés. Par exemple il serait intéressant que seuls les utilisateurs authentifiés puissent créer, modifier ou supprimer des donnés.

### Prisma

Pour commencer nous allons ajouter une table `users` à notre base de donnée. Cette table contiendra les informations des utilisateurs de notre application. Pour ce faire ajouter un modèle `User` dans le fichier `schema.prisma` qui contiendra les informations suivantes:

| Nom      | Type   | Propriété      | Description                         |
| -------- | ------ | -------------- | ----------------------------------- |
| id       | Int    | clé primaire   | Identifiant unique de l'utilisateur |
| email    | String | requis, unique | Email de l'utilisateur              |
| password | String | requis         | Mot de passe                        |

Vous rajouterez dans le seed un utilisateur avec les informations suivantes:

```JSON
{
  "email": "admin@gmail.com",
  "password": "admin"
}
```

> Remarque: Il est évident que seed un utilisateur avec des données en clair n'est pas une bonne pratique. Nous faisons simplement cela pour faciliter le TP.

### Endpoints users

Vous aller créer deux endpoints pour gérer les utilisateurs:

- `POST:/users` : Permet de créer un utilisateur
- `POST:/users/login` : Permet de se connecter à l'application

#### Création

L'endpoint `POST:/users` prendra en paramètre un objet JSON contenant les informations de l'utilisateur à créer. Vous devrez crypter le mot de passe avant de l'enregistrer en base de données. Pour ce faire vous pouvez utiliser le package `bcrypt` qui est déjà installé. Vous renverrez ensuite un code `201 Created` si la création a réussi.

Vous traiterez les codes http suivants:

- `201 Created` : Si la création a réussi
- `400 Bad Request` : Si l'email est déjà utilisé
- `400 Bad Request` : Si un champs requis est vide

#### Login

L'endpoint `POST:/users/login` prendra en paramètre un objet JSON contenant les informations de l'utilisateur à connecter. La réponse de cette requête sera un _JWT_ qui sera construit avec le package `jsonwebtoken`. Le `PAYLOAD` de ce JWT contiendra les informations de l'utilisateur connecté (id, email).

> Concernant la clé secrète du JWT et son expiration des variables d'environnement sont déjà présentes dans le fichier `.env`. Vous pouvez y accéder avec `process.env.JWT_SECRET` et `process.env.JWT_EXPIRATION`.

Vous traiterez les codes http suivants:

- `201 Created` : Si la connexion a réussi
- `404 Not Found` : Si l'utilisateur n'existe pas en base de données
- `400 Bad Request` : Si le mot de passe ne correspond pas à l'utilisateur

> Nous utilons ici une méthode `POST` et non `GET` car il s'agit d'un point de vue applicatif de la création d'une session utilisateur. Dans le cas d'une création le `POST` est donc plus logique.

> La requête `POST:/users/login` va vous renvoyer un jwt crypté sur votre outil de test d'API (Postman). Dans ce cas vous devez récuperer ce JWT et le stocker dans le champs Authorization du header de vos futurs requêtes qui requiert cette permission.

### Middleware d'authentification

Maintenant que nous gérons les utilisateurs et la connexion vous ajouterez la vérification d'authentification sur les routes suivantes:

- `POST:/pokemon-cards`
- `PATCH:/pokemon-cards/:pokemonCardId`
- `DELETE:/pokemon-cards/:pokemonCardId`

Pour ce faire vous allez créer un middleware d'authentification qui va vérifier la validité du JWT avant d'appeler le controller associé à la route. En cas d'erreur vous renverrez une réponse `401 Unauthorized`.

## Tests d'intégration

Vous allez créer des tests d'intégration pour chaque route de votre API. Pour ce faire vous utiliserez le package `jest` et `supertest`. Vous pouvez lancer vos tests avec la commande `npm run test` et observer aussi le résultat du coverage.

> Les structures des tests attendues sont déjà présentes dans le dossier `tests`. Vous n'avez plus qu'à les compléter avec le code nécessaire.

> Le fichier `jest.setup.ts` contient la configuration de jest pour les tests. Il implèmente plusieurs mocks:
>
> - `prismaMock` : pour éviter de faire des appels à la base de donnée
> - `jsonwebtokenMock` : renvoie un JWT valide si la valeur du token passé en paramètre est `mockedToken` et une erreur sinon.
> - `bcryptMock` : renvoie `true` si le mot de passe est `truePassword` et `false` sinon.
>   **NE PAS MODIFIER CE FICHIER**

> Le dossier .vscode contient un fichier de configuration pour lancer les tests avec VSCode en mode debug. **DEMANDER DE L'AIDE SI VOUS NE SAVEZ PAS COMMENT FAIRE**

## Documentation Swagger

En utilisant les informations du cours sur la mise en place d'une documentations Swagger vous allez créer un fichier swagger qui sera accessible à l'url `/api-docs`.

Dans cette documentation vous détaillerez bien chacun de vos endpoints existant dans votre API.

> Les packages utiles sont déjà installés dans le projet, il ne vous reste plus qu'à les implémenter.

## Bonus

Ces bonus sont là pour vous permettre d'aller plus loin dans le projet. Vous pouvez en choisir un ou plusieurs pour augmenter votre score jusqu`à 20 points.

> Tout point bonus au-delà de 20 points sera rapporté sur l'interrogation écrite.

### Autres endpoints Users `(+0,5 points)`

Ajouter les endpoints CRUD manquants pour les utilisateurs.

### Coverage 100% `(+1 points)`

Avoir un coverage de test de 100% en plus des tests demandés par défaut. Pour tester cela vous pouvez utiliser la commande `npm run test:coverage`.

### Weakness `(+1,5 points)`

Ajouter un champ optionnel `weakness` à la table `PokemonCard` qui contiendra le type de pokémon qui est faible contre le pokémon en question.

> Attention à la dupplication de la relation entre les types.

### PokemonAttack (`+3 points`)

Ajouter la possibilité de gérer les attaques d'une PokemonCard.

- Vous ajouterez une table `pokemonAttack` qui contiendra les informations ci-dessous.
  | Nom | Type | Propriété | Description |
  | --- | ---- | --------- | ----------- |
  | id | Number | clé primaire | Identifiant unique de l'attaque |
  | name | String | requis | Nom de l'attaque |
  | damages | Number | requis | Dégats de l'attaque |
  | type_id | REF(Type) | requis, relation 1-N | Type de l'attaque |

- Une `PokemonCard` possède une attaque et le champs est requis.
- Une attaque peut être utilisée par plusieurs `PokemonCard`.
- Vous ajouterez aussi des endpoints pour gérer ces attaques (CRUD).
- Pour les permissions vous vérifierez qu'il faut être connecté pour créer, modifier ou supprimer une attaque.
- Vous ajouterez des tests pour ces endpoints.
- Vous ajouterez la documentation Swagger pour ces endpoints.

> Vous trouverez des conseils sur les relations dans la documentations de Prisma [ici](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations).

### Deck (`+3 points`)

Ajouter la possibilité de gérer des decks de cartes pokémons. Un deck est une collection de cartes pokémons. Vous ajouterez une table `deck` qui contiendra les informations ci-dessous.

| Nom   | Type               | Propriété            | Description                |
| ----- | ------------------ | -------------------- | -------------------------- |
| id    | Number             | clé primaire         | Identifiant unique du deck |
| name  | String             | requis               | Nom du deck                |
| cards | REF(PokemonCard)[] | requis, relation N-N | Cartes du deck             |
| owner | REF(User)          | requis, relation 1-N | Propriétaire du deck       |

- Un utilisateur peut avoir plusieurs decks (relation 1-N).
- Un pokémon peut être dans plusieurs decks (relation N-N).
- Vous ajouterez aussi des endpoints pour gérer ces decks (CRUD).
- Lorsque le deck est créé vous baserez le propriétaire sur l'utilisateur connecté (via son JWT).
- Pour les permissions vous vérifierez qu'il faut être connecté pour créer, modifier ou supprimer un deck.
- Vous ajouterez des tests pour ces endpoints.
- Vous ajouterez la documentation Swagger pour ces endpoints.
