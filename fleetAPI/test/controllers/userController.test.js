//exemplo
const request = require('supertest');
const app = require('../../server'); // só se necessário
const sequelize = require('../../config/database');
const { User } = require('../../models');

describe('Testes do UserController', () => {
  let createdUserId;

  it('Deve criar um usuário', async () => {
    const response = await request('http://localhost:3333')
      .post('/api/users')
      .send({
        name: 'Usuário Teste',
        email: 'teste@example.com',
        password: 'senha123'
      });

    expect(response.statusCode).toBe(201);
    createdUserId = response.body.id;
  });

  afterAll(async () => {
    // Limpa os dados criados
    await User.destroy({ where: { id: createdUserId } });
   // await sequelize.close(); se necessário
  });
});
