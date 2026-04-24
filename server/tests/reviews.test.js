const request = require('supertest');
const app = require('../index');

describe('Review Routes', () => {
  test('POST /api/reviews should return unauthorized without auth', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({
        reviewId: 'rev_test_001',
        bookingId: 'book_test_001',
        providerClerkId: 'clerk_provider_001',
        rating: 5
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: 'Unauthorized' });
  });
});
