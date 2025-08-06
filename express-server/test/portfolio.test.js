const request = require('supertest');
require('dotenv').config();
const { sequelize } = require('../db/database');
const app = require('../index');
const jwt = require('jsonwebtoken');
const Portfolio = require('../models/portfolio');
const User = require('../models/user');
const bcrypt = require('bcrypt');

let authToken = '';
let testUserId = null;
let testPortfolioId = null;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await sequelize.sync({ force: true });

  // Create a hashed password
  const hashedPassword = await bcrypt.hash('password123', 10);
  const testUser = await User.create({
    username: 'portfolio_test_user',
    email: 'portfolio_test@example.com',
    password: hashedPassword,
    role: 'user'
  });
  testUserId = testUser.id;

  // JWT for auth
  authToken = jwt.sign(
    { id: testUser.id, email: testUser.email, role: testUser.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
});

afterAll(async () => {
  await sequelize.close();
});

describe('Portfolio API Tests', () => {
  test('Create portfolio entry successfully', async () => {
    const res = await request(app)
      .post('/api/portfolio')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        stockSymbol: 'AAPL',
        quantity: 10,
        purchasePrice: 150
      });

    expect(res.statusCode).toBe(201);
    testPortfolioId = res.body.data.id;
  });

  test('Fail to create portfolio entry with invalid data', async () => {
    const res = await request(app)
      .post('/api/portfolio')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        stockSymbol: '',
        quantity: -5,
        purchasePrice: 0
      });

    expect(res.statusCode).toBe(400);
  });

  test('Get all portfolio entries', async () => {
    const res = await request(app)
      .get('/api/portfolio')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('Get portfolio entry by ID', async () => {
    const res = await request(app)
      .get(`/api/portfolio/${testPortfolioId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
  });

  test('Fail to get portfolio entry by invalid ID', async () => {
    const res = await request(app)
      .get('/api/portfolio/999999')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(404);
  });

  test('Update portfolio entry successfully', async () => {
    const res = await request(app)
      .put(`/api/portfolio/${testPortfolioId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        quantity: 20,
        purchasePrice: 155
      });
    expect(res.statusCode).toBe(200);
  });

  test('Fail to update portfolio entry with invalid values', async () => {
    const res = await request(app)
      .put(`/api/portfolio/${testPortfolioId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        quantity: -10
      });
    expect(res.statusCode).toBe(400);
  });

  test('Delete portfolio entry successfully', async () => {
    const res = await request(app)
      .delete(`/api/portfolio/${testPortfolioId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
  });

  test('Fail to delete non-existent portfolio entry', async () => {
    const res = await request(app)
      .delete(`/api/portfolio/${testPortfolioId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(404);
  });

  test('Get portfolio performance', async () => {
    await Portfolio.create({
      userId: testUserId,
      stockSymbol: 'AAPL',
      quantity: 5,
      purchasePrice: 140
    });

    const res = await request(app)
      .get('/api/portfolio/performance')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('totalInvested');
  });
});
