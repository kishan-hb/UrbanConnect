const request = require('supertest');
const app = require('../index');

describe('Service Routes', () => {
  test('POST /api/services should return unauthorized without auth', async () => {
    const res = await request(app)
      .post('/api/services')
      .send({
        serviceId: 'svc_test_001',
        category: 'Cleaning',
        title: 'Test Service',
        price: 50
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: 'Unauthorized' });
  });
});
