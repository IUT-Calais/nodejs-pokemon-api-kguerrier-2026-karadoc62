import request from 'supertest'; // pour simuler les requetes HHTTP
import { app } from '../src';
import { prismaMock } from './jest.setup';


describe('User API', () => {
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const createdUser = {
        id: 1,
        email: 'karadoc@gmail.com',
        password: 'password123',
      };

      //verif qu'aucun utilisateur trouvé
      prismaMock.user.findUnique.mockResolvedValue(null);
      // renvoie l'utilisateur créé
      prismaMock.user.create.mockResolvedValue(createdUser);

      // on teste l'api - serveur express
      const response = await request(app)
        .post('/users')
        .send({
          email: 'karadoc@gmail.com',
          password: 'password123',
        });

      // verif du code HTTP
      expect(response.status).toBe(201);

      // verif de la reponse
      expect(response.body).toEqual({
        id: createdUser.id,
        email: createdUser.email,
      });
    });

    // test email existant
    it('should return 400 if email already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'karadoc@gmail.com',
        password: 'password123',
      });

      const response = await request(app)
        .post('/users')
        .send({
          email: 'karadoc@gmail.com',
          password: 'password123',
        });
      
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    // test envoi avec mail vide
    it('should return 400 if email is empty', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          email: '',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    // test sans mot de passe
    it('should return 400 if password is empty', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          email: 'karadoc@gmail.com',
          password: '',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });



  describe('POST /users/login', () => {
    it('should login a user and return a token', async () => {
      const createdUser = {
        id: 1,
        email: 'karadoc@gmail.com',
        password: 'password123',
      };
      const token = 'mockedToken';

      prismaMock.user.findUnique.mockResolvedValue(createdUser);

      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'karadoc@gmail.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        token: 'mockedToken',
        message: 'Connexion réussie',
      });
    });


    it('should return 401 if user not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'karadoc@gmail.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });


    it('should return 401 if password is incorrect', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'karadoc@gmail.com',
        password: 'password123',
      });

      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'admin@gmail.com',
          password: 'password456',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });



  });
});
