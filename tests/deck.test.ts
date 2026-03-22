import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Deck API', () => {

    describe('GET /decks', () => {
        it('should fetch all decks', async () => {
            const mockDecks = [
            {
                id: 1,
                name: 'Deck Eau',
                ownerId: 1,
                owner: {
                    id: 1,
                    email: 'karadoc@gmail.com'
                },
                cards: [
                {
                    id: 1,
                    name: 'Carapuce'
                }
                ]
            }
            ];

            prismaMock.deck.findMany.mockResolvedValue(mockDecks as any);

            const response = await request(app).get('/decks');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockDecks);
        });

        it('should return 500 if fetching decks fails', async () => {
            prismaMock.deck.findMany.mockRejectedValue(new Error('DB error'));

            const response = await request(app).get('/decks');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Une erreur est survenue' });
        });
    });


    describe('GET /decks/:deckId', () => {
        it('should fetch a deck by id', async () => {
            const mockDeck = {
                id: 1,
                name: 'Deck Eau',
                ownerId: 1,
                owner: {
                    id: 1,
                    email: 'karadoc@gmail.com'
                },
                cards: [
                    {
                    id: 1,
                    name: 'Carapuce'
                    }
                ]
            };

            prismaMock.deck.findUnique.mockResolvedValue(mockDeck as any);

            const response = await request(app).get('/decks/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockDeck);
        });

        it('should return 404 if deck is not found', async () => {
            prismaMock.deck.findUnique.mockResolvedValue(null);

            const response = await request(app).get('/decks/1');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Deck non trouve' });
        });

        it('should return 500 if fetching deck by id fails', async () => {
            prismaMock.deck.findUnique.mockRejectedValue(new Error('DB error'));

            const response = await request(app).get('/decks/1');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Une erreur est survenue' });
        });
    });


    describe('POST /decks', () => {

        it('should create a new deck', async () => {
        const mockDeck = {
            id: 1,
            name: 'Deck Eau',
            ownerId: 1,
            owner: {
            id: 1,
            email: 'karadoc@gmail.com'
            },
            cards: [
            {
                id: 1,
                name: 'Carapuce'
            }
            ]
        };

        // mock verif cartes
        prismaMock.pokemonCard.findMany.mockResolvedValue([
            { id: 1 } as any
        ]);

        // mock creation
        prismaMock.deck.create.mockResolvedValue(mockDeck as any);

        const response = await request(app)
            .post('/decks')
            .set('Authorization', 'Bearer mockedToken')
            .send({
                name: 'Deck Eau',
                cards: [1]
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockDeck);
        });

        it('should return 400 if name is missing', async () => {
            const response = await request(app)
                .post('/decks')
                .set('Authorization', 'Bearer mockedToken')
                .send({
                    name: '',
                    cards: [1]
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Le nom du deck est obligatoire' });
        });

        it('should return 400 if cards are missing', async () => {
            const response = await request(app)
                .post('/decks')
                .set('Authorization', 'Bearer mockedToken')
                .send({
                    name: 'Deck Eau'
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Les cartes sont obligatoires' });
        });

        it('should return 400 if cards is not an array', async () => {
            const response = await request(app)
                .post('/decks')
                .set('Authorization', 'Bearer mockedToken')
                .send({
                    name: 'Deck Eau',
                    cards: "not-an-array"
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Les cartes doivent etre un tableau' });
        });

        it('should return 400 if one card not exist', async () => {
            prismaMock.pokemonCard.findMany.mockResolvedValue([
                { id: 1 } as any
            ]);

            const response = await request(app)
                .post('/decks')
                .set('Authorization', 'Bearer mockedToken')
                .send({
                    name: 'Deck Eau',
                    cards: [1, 2] // 2 n'existe pas
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Une ou plusieurs cartes n'existent pas" });
        });

        it('should return 500 if create deck fails', async () => {
            prismaMock.pokemonCard.findMany.mockRejectedValue(new Error('DB error'));

            const response = await request(app)
                .post('/decks')
                .set('Authorization', 'Bearer mockedToken')
                .send({
                    name: 'Deck Eau',
                    cards: [1]
                });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Une erreur est survenue' });
        });
    });

});