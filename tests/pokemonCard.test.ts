import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';

beforeEach(() => {
  jest.clearAllMocks();
});


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



  describe('GET /pokemon-cards - errors', () => {
    it('should return 500 if fetching all PokemonCards fails', async () => {
      prismaMock.pokemonCard.findMany.mockRejectedValue(new Error('DB error'));

      const response = await request(app).get('/pokemon-cards');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Une erreur est survenue' });
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



  describe('GET /pokemon-cards/:pokemonCardId - errors', () => {
    it('should return 500 if fetching PokemonCard by id fails', async () => {
      prismaMock.pokemonCard.findUnique.mockRejectedValue(new Error('DB error'));

      const response = await request(app).get('/pokemon-cards/27');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Une erreur est survenue' });
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



  describe('POST /pokemon-cards - errors', () => {
    
    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: '',
          pokedexId: 7,
          type: 75,
          lifePoints: 44,
          size: 0.5,
          weight: 9,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png'
        });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Le nom est obligatoire' });
  });


    it('should return 400 if pokedexId is missing', async () => {
      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'Carapuce',
          type: 75,
          lifePoints: 44,
          size: 0.5,
          weight: 9,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "L'id du pokédex est obligatoire" });
    });


    it('should return 400 if lifePoints is missing', async () => {
    const response = await request(app)
      .post('/pokemon-cards')
      .set('Authorization', 'Bearer mockedToken')
      .send({
        name: 'Carapuce',
        pokedexId: 7,
        type: 75,
        size: 0.5,
        weight: 9,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png'
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Le nombre de points de vie est obligatoire' });
    });


    it('should return 400 if type is missing', async () => {
      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'Carapuce',
          pokedexId: 7,
          lifePoints: 44,
          size: 0.5,
          weight: 9,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Le type du pokémon est obligatoire' });
    });


    it('should return 400 if type does not exist', async () => {
      prismaMock.type.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'Carapuce',
          pokedexId: 7,
          type: 75,
          lifePoints: 44,
          size: 0.5,
          weight: 9,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Le type n'existe pas" });
    });


    it('should return 400 if name already exists', async () => {
      prismaMock.type.findUnique.mockResolvedValue({ id: 75, name: 'Water' } as any);
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({ id: 99, name: 'Carapuce' } as any);

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'Carapuce',
          pokedexId: 7,
          type: 75,
          lifePoints: 44,
          size: 0.5,
          weight: 9,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Le nom de pokémon existe déjà' });
    });


    it('should return 400 if pokedexId already exists', async () => {
      prismaMock.type.findUnique.mockResolvedValue({ id: 75, name: 'Water' } as any);
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(null);
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({ id: 99, pokedexId: 7 } as any);

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'Carapuce',
          pokedexId: 7,
          type: 75,
          lifePoints: 44,
          size: 0.5,
          weight: 9,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Le numéro de pokédex existe déjà' });
    });

    it('should return 500 if create throws an error', async () => {
      prismaMock.type.findUnique.mockResolvedValue({ id: 75, name: 'Water' } as any);
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(null);
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(null);
      prismaMock.pokemonCard.create.mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'Carapuce',
          pokedexId: 7,
          type: 75,
          lifePoints: 44,
          size: 0.5,
          weight: 9,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Une erreur est survenue' });
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
      prismaMock.pokemonCard.findFirst.mockResolvedValueOnce(null);
      prismaMock.pokemonCard.findFirst.mockResolvedValueOnce(null);
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



  describe('PATCH /pokemon-cards/:pokemonCardId - errors', () => {

    it('should return 404 if PokemonCard to update does not exist', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .patch('/pokemon-cards/27')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'Carapuce',
          pokedexId: 7,
          type: 75,
          lifePoints: 44,
          size: 0.5,
          weight: 9,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png'
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Le pokémon n'existe pas" });
    });


    it('should return 400 if name is missing on update', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue({ id: 27 } as any);

      const response = await request(app)
        .patch('/pokemon-cards/27')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: '',
          pokedexId: 7,
          type: 75,
          lifePoints: 44,
          size: 0.5,
          weight: 9,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Le nom est obligatoire' });
    });


    it('should return 400 if type does not exist on update', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue({ id: 27 } as any);
      prismaMock.type.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .patch('/pokemon-cards/27')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'Carapuce',
          pokedexId: 7,
          type: 75,
          lifePoints: 44,
          size: 0.5,
          weight: 9,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Le type n'existe pas" });
    });


    it('should return 400 if name already exists on another PokemonCard', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue({ id: 27 } as any);
      prismaMock.type.findUnique.mockResolvedValue({ id: 75, name: 'Water' } as any);
      prismaMock.pokemonCard.findFirst.mockResolvedValueOnce({ id: 99, name: 'Carapuce' } as any);

      const response = await request(app)
        .patch('/pokemon-cards/27')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'Carapuce',
          pokedexId: 7,
          type: 75,
          lifePoints: 44,
          size: 0.5,
          weight: 9,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Le nom de pokémon existe déjà' });
    });


    it('should return 400 if pokedexId already exists on another PokemonCard', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue({ id: 27 } as any);
      prismaMock.type.findUnique.mockResolvedValue({ id: 75, name: 'Water' } as any);
      prismaMock.pokemonCard.findFirst.mockResolvedValueOnce(null);
      prismaMock.pokemonCard.findFirst.mockResolvedValueOnce({ id: 99, pokedexId: 7 } as any);

      const response = await request(app)
        .patch('/pokemon-cards/27')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'Carapuce',
          pokedexId: 7,
          type: 75,
          lifePoints: 44,
          size: 0.5,
          weight: 9,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Le numéro de pokédex existe déjà' });
    });


    it('should return 500 if update throws an error', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue({ id: 27 } as any);
      prismaMock.type.findUnique.mockResolvedValue({ id: 75, name: 'Water' } as any);
      prismaMock.pokemonCard.findFirst.mockResolvedValueOnce(null);
      prismaMock.pokemonCard.findFirst.mockResolvedValueOnce(null);
      prismaMock.pokemonCard.update.mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .patch('/pokemon-cards/27')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'Carapuce',
          pokedexId: 7,
          type: 75,
          lifePoints: 44,
          size: 0.5,
          weight: 9,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Une erreur est survenue' });
    });


    it('should return 400 if pokedexId is missing on update', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue({ id: 27 } as any);

      const response = await request(app)
        .patch('/pokemon-cards/27')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'Carapuce',
          type: 75,
          lifePoints: 44,
          size: 0.5,
          weight: 9,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "L'id du pokédex est obligatoire" });
    });


    it('should return 400 if lifePoints is missing on update', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue({ id: 27 } as any);

      const response = await request(app)
        .patch('/pokemon-cards/27')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'Carapuce',
          pokedexId: 7,
          type: 75,
          size: 0.5,
          weight: 9,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Le nombre de points de vie est obligatoire' });
    });


    it('should return 400 if type is missing on update', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue({ id: 27 } as any);

      const response = await request(app)
        .patch('/pokemon-cards/27')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'Carapuce',
          pokedexId: 7,
          lifePoints: 44,
          size: 0.5,
          weight: 9,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Le type du pokémon est obligatoire' });
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



  describe('DELETE /pokemon-cards/:pokemonCardId - errors', () => {

    it('should return 404 if PokemonCard to delete does not exist', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .delete('/pokemon-cards/27')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Le pokémon n'existe pas" });
    });
  

    it('should return 500 if delete throws an error', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue({ id: 27 } as any);
      prismaMock.pokemonCard.delete.mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .delete('/pokemon-cards/27')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Une erreur est survenue' });
    });

  });

  describe('JWT middleware', () => {
    it('should return 401 if token is missing', async () => {
      const response = await request(app)
        .post('/pokemon-cards')
        .send({
          name: 'Carapuce',
          pokedexId: 7,
          type: 75,
          lifePoints: 44,
          size: 0.5,
          weight: 9,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png'
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Token manquant' });
    });
  });

});
