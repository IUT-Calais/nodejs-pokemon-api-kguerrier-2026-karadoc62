import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';

describe('PokemonCard API', () => {

  describe('GET /pokemon-cards', () => {
    it('should fetch all PokemonCards', async () => {
      const mockPokemonCards: any[] = [];

      prismaMock.pokemonCard.findMany.mockResolvedValue(mockPokemonCards);

      const response = await request(app).get('/pokemon-cards');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCards);
    });
  });


  describe('GET /pokemon-cards/:pokemonCardId', () => {
    it('should fetch a PokemonCard by ID', async () => {
      const mockPokemonCard = {
        "id": 27,
        "name": "Carapuce",
        "pokedexId": 7,
        "typeId": 75,
        "lifePoints": 44,
        "size": 0.5,
        "weight": 9,
        "imageUrl": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png"
      };

      prismaMock.pokemonCard.findUnique.mockResolvedValue(mockPokemonCard);
      
      const response = await request(app).get('/pokemon-cards/27');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCard);
    });


    it('should return 404 if PokemonCard is not found', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/pokemon-cards/27');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Pokémon non trouvé' });
    });
  });



  describe('POST /pokemon-cards', () => {
    it('should create a new PokemonCard', async () => {
      const createdPokemonCard = {
        "id": 27,
        "name": "Carapuce",
        "pokedexId": 7,
        "typeId": 75,
        "lifePoints": 44,
        "size": 0.5,
        "weight": 9,
        "imageUrl": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png"
      };

      prismaMock.type.findUnique.mockResolvedValue({ id: 75, name: 'Water' } as any);
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(null);
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(null);
      prismaMock.pokemonCard.create.mockResolvedValue(createdPokemonCard);

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          "name": "Carapuce",
          "pokedexId": 7,
          "type": 75,
          "lifePoints": 44,
          "size": 0.5,
          "weight": 9,
          "imageUrl": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png"
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdPokemonCard);
    });
  });

  
  describe('PATCH /pokemon-cards/:pokemonCardId', () => {
    it('should update an existing PokemonCard', async () => {
      const updatedPokemonCard = {
        "id": 27,
        "name": "Carapuce",
        "pokedexId": 7,
        "typeId": 75,
        "lifePoints": 44,
        "size": 0.5,
        "weight": 9,
        "imageUrl": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png"
      };

      prismaMock.pokemonCard.findUnique.mockResolvedValue({ id: 27 } as any);
      prismaMock.type.findUnique.mockResolvedValue({ id: 75, name: 'Water' } as any);
      prismaMock.pokemonCard.findFirst.mockResolvedValue(null);
      prismaMock.pokemonCard.findFirst.mockResolvedValue(null);
      prismaMock.pokemonCard.update.mockResolvedValue(updatedPokemonCard);

      const response = await request(app)
        .patch('/pokemon-cards/27')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          "id": 27,
          "name": "Carapuce",
          "pokedexId": 7,
          "type": 75,
          "lifePoints": 44,
          "size": 0.5,
          "weight": 9,
          "imageUrl": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png"
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedPokemonCard);
    });
  });


  describe('DELETE /pokemon-cards/:pokemonCardId', () => {
    it('should delete a PokemonCard', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue({ id: 27 } as any);
      prismaMock.pokemonCard.delete.mockResolvedValue({} as any);

      const response = await request(app)
        .delete('/pokemon-cards/27')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(204);
    });
  });
});
