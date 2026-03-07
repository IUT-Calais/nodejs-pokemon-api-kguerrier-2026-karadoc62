import express from 'express';
import { pokemonCardRouter } from './pokemonCard/pokemonCard.router';
import { userRouter } from './user/user.router';
import { authRouter } from './common/auth.router';


export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/pokemon-cards', pokemonCardRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);

export const server = app.listen(port);

export function stopServer() {
  server.close();
}
