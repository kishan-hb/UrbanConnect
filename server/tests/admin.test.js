const request = require('supertest');
const app = require('../index');

describe('Admin Routes', () => {
  test('GET /api/admin/users should return unauthorized without auth', async () => {
    const res = await request(app).get('/api/admin/users');

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: 'Unauthorized' });
  });
});
