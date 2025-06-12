const request = require('supertest');
const app = require('../../server'); // seu server.js deve exportar o `app`
const sequelize = require('../../config/database');

let createdUserId;
let createdAddressId;

beforeAll(async () => {
  await sequelize.sync({ force: true }); // zera o banco
});

afterAll(async () => {
  await sequelize.close();
});

describe('User Controller', () => {
  it('deve criar um endereço', async () => {
    const addressPayload = {
      cep: '12345-678',
      number: '123',
      road: 'Rua Teste',
      complement: "Casa",
      city: 'Cidade Teste',
      state: 'Estado Teste',
      
    };

    const res = await request(app)
      .post('/api/address')
      .send(addressPayload);

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    createdAddressId = res.body.id;
  });

  it('deve criar um usuário', async () => {
    const userPayload = {
      name: 'João da Silva',
      cpf: '12345678900',
      phone: '11999999999',
      email: 'joao@email.com',
      password: 'senhaSegura123',
      addressId: createdAddressId,
    };

    const res = await request(app)
      .post('/api/user')
      .send(userPayload);

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    createdUserId = res.body.id;
  });

  it('deve buscar o usuário pelo ID', async () => {
    const res = await request(app).get(`/api/user/${createdUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('joao@email.com');
  });

  it('deve atualizar o usuário', async () => {
    const res = await request(app)
      .put(`/api/user/${createdUserId}`)
      .send({ phone: '11988888888' });

    expect(res.status).toBe(200);
    expect(res.body.phone).toBe('11988888888');
  });

  it('deve deletar o usuário', async () => {
    const res = await request(app).delete(`/api/user/${createdUserId}`);
    expect(res.status).toBe(204);
  });

  it('deve deletar o endereço', async () => {
    const res = await request(app).delete(`/api/address/${createdAddressId}`);
    expect(res.status).toBe(204);
  });
});
