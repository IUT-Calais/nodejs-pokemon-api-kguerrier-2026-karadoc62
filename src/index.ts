import express from 'express';
import { pokemonCardRouter } from './pokemonCard/pokemonCard.router';
import { userRouter } from './user/user.router';
import { deckRouter } from './deck/deck.router';
import 'dotenv/config';

// On ajoute les informations pour swagger
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';


export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// On charge la spécification Swagger
const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));
// Et on affecte le Serveur Swagger UI à l'adresse /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Routes
app.use('/pokemon-cards', pokemonCardRouter);
app.use('/users', userRouter);
app.use('/decks', deckRouter);


// ==================================================================
// partie ajoutée afin de régler le probleme de serveur qui se lance pour les tests avec une erreur:
// listen EADDRINUSE: address already in use :::3000
// ==================================================================
export let server: ReturnType<typeof app.listen> | undefined;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(port, () => {
    console.log(`Mon serveur démarre sur le port ${port}`);
  });
}

export function stopServer() {
  if (server) {
    server.close();
  }
}
