const request = require('supertest');
const app = require('../index');

describe('Booking Routes', () => {
  test('POST /api/bookings should return unauthorized without auth', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({
        bookingId: 'book_test_001',
        serviceId: 'svc_test_001',
        date: '2026-04-10',
        timeSlot: '10:00-12:00'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: 'Unauthorized' });
  });
});
