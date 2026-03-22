import {Router} from 'express';
import {getDeckById, 
        getDeck, 
        createDeck,
        // updateDeck,
        // deleteDeck
        } from './deck.controller';
import { verifyJWT } from '../common/jwt.middleware';

export const deckRouter = Router();


deckRouter.get('/', getDeck);
deckRouter.get('/:deckId', getDeckById);
deckRouter.post('/', verifyJWT, createDeck);
// deckRouter.patch('/:deckId', verifyJWT, updateDeck);
// deckRouter.delete('/:deckId', verifyJWT, deleteDeck);