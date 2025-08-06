const request = require('supertest');
require('dotenv').config();

const app = require('../index'); // Import your Express app
let authToken = '';
let createdUserId = '';

describe('User API Tests', () => {
  const uniqueUsername = `testuser_${Date.now()}`;
  const uniqueEmail = `test_${Date.now()}@example.com`;
  const password = 'TestPass123!';

  // ---------- REGISTER ----------
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({ userName: uniqueUsername, email: uniqueEmail, password });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.username).toEqual(uniqueUsername);
    expect(res.body.user.email).toEqual(uniqueEmail);

    createdUserId = res.body.user.id;
  });

  it('should fail if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({ userName: 'short' }); // missing email & password

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should fail if username already exists', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({ userName: uniqueUsername, email: `new_${Date.now()}@example.com`, password });

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Username already in use/);
  });

  it('should fail if email already exists', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({ userName: `newuser_${Date.now()}`, email: uniqueEmail, password });

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Email already in use/);
  });

  // ---------- LOGIN ----------
  it('should login successfully and return token', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({ email: uniqueEmail, password });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('token');
    authToken = res.body.token;
  });

  it('should fail login with wrong password', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({ email: uniqueEmail, password: 'WrongPass123!' });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should fail login with non-existent email', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({ email: 'notfound@example.com', password });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // ---------- GET USERS ----------
  it('should get current user (me)', async () => {
    const res = await request(app)
      .get('/api/user/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.email).toEqual(uniqueEmail);
  });

  it('should get user by ID', async () => {
    const res = await request(app)
      .get(`/api/user/${createdUserId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.id).toEqual(createdUserId);
  });

  it('should fail get user by ID if not found', async () => {
    const res = await request(app)
      .get('/api/user/999999')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  // ---------- UPDATE ----------
  it('should update user info', async () => {
    const res = await request(app)
      .put(`/api/user/${createdUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ username: `${uniqueUsername}_updated`, email: `updated_${uniqueEmail}` });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/updated successfully/i);
  });

  // ---------- DELETE ----------
  it('should delete user by ID', async () => {
    const res = await request(app)
      .delete(`/api/user/${createdUserId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  it('should fail delete for non-existent user', async () => {
    const res = await request(app)
      .delete(`/api/user/${createdUserId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

afterAll(async () => {
  await sequelize.close();  // close connection to avoid Jest hanging
});