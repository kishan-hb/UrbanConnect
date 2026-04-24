const request = require('supertest');
const app = require('../index');

describe('User Routes', () => {
  test('POST /api/users should return unauthorized without auth', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        clerkId: 'clerk_test_001',
        username: 'testuser',
        email: 'test@example.com'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: 'Unauthorized' });
  });
});
