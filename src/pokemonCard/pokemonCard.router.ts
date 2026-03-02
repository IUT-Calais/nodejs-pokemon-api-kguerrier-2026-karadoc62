import {Router} from 'express';
import {getPokemonCardById, getPokemonCards, createPokemonCard, updatePokemonCard, deletePokemonCard} from './pokemonCard.controller.js';

export const pokemonCardRouter = Router();


pokemonCardRouter.get('/', getPokemonCards);
pokemonCardRouter.get('/:pokemonCardId', getPokemonCardById);
pokemonCardRouter.post('/', createPokemonCard);
pokemonCardRouter.patch('/:pokemonCardId', updatePokemonCard);
pokemonCardRouter.delete('/:pokemonCardId', deletePokemonCard);