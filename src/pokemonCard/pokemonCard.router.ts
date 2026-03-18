import {Router} from 'express';
import {getPokemonCardById, getPokemonCards, createPokemonCard, updatePokemonCard, deletePokemonCard} from './pokemonCard.controller';
import { verifyJWT } from '../common/jwt.middleware';

export const pokemonCardRouter = Router();


pokemonCardRouter.get('/', getPokemonCards);
pokemonCardRouter.get('/:pokemonCardId', getPokemonCardById);
pokemonCardRouter.post('/', verifyJWT, createPokemonCard);
pokemonCardRouter.patch('/:pokemonCardId', verifyJWT, updatePokemonCard);
pokemonCardRouter.delete('/:pokemonCardId', verifyJWT, deletePokemonCard);