const request = require('supertest');
const app = require('../index');

describe('App', () => {
  test('GET / should return API running message', async () => {
    const res = await request(app).get('/');

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('UrbanConnect API is running');
  });

  test('GET /api/error-test should use centralized error handler', async () => {
    const res = await request(app).get('/api/error-test');

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'Centralized error handler is working' });
  });
});
