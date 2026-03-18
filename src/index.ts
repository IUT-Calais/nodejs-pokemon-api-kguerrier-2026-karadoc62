import express from 'express';
import { pokemonCardRouter } from './pokemonCard/pokemonCard.router';
import { userRouter } from './user/user.router';
import 'dotenv/config';


export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/pokemon-cards', pokemonCardRouter);
app.use('/users', userRouter);

// partie ajoutée afin de régler le probleme de serveur qui se lance pour les tests avec une erreur:
// listen EADDRINUSE: address already in use :::3000
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
