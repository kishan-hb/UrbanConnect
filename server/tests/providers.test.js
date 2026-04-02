const request = require('supertest');
const app = require('../index');

describe('Provider Routes', () => {
  test('GET /api/providers/me should return unauthorized without auth', async () => {
    const res = await request(app).get('/api/providers/me');

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: 'Unauthorized' });
  });
});
