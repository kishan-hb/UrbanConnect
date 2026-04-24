const request = require('supertest');
const app = require('../index');

describe('Auth Routes', () => {
  test('GET /api/auth-check should return JSON response', async () => {
    const res = await request(app).get('/api/auth-check');

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(typeof res.body).toBe('object');
  });

  test('GET /api/protected-test should return unauthorized without auth', async () => {
    const res = await request(app).get('/api/protected-test');

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: 'Unauthorized' });
  });
});
