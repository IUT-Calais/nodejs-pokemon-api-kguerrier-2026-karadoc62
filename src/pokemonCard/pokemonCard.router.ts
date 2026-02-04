import {Router} from 'express';
import {getPokemonCardById, getPokemonCards, createPokemonCard} from './pokemonCard.controller.js';

export const pokemonCardRouter = Router();


pokemonCardRouter.get('/', getPokemonCards);
pokemonCardRouter.get('/:pokemonCardId', getPokemonCardById);
pokemonCardRouter.post('/', createPokemonCard);