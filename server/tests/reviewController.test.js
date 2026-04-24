const mockSave = jest.fn();

jest.mock('../models/review', () => {
  const Review = jest.fn().mockImplementation((data) => ({
    ...data,
    save: mockSave
  }));

  Review.find = jest.fn();
  Review.findById = jest.fn();
  Review.findOne = jest.fn();

  return Review;
});

jest.mock('../models/booking', () => ({
  findOne: jest.fn()
}));

jest.mock('../models/user', () => ({
  findOne: jest.fn()
}));

const Review = require('../models/review');
const Booking = require('../models/booking');
const { createReview } = require('../controllers/reviewController');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('reviewController.createReview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 400 when required fields are missing', async () => {
    const req = {
      body: {
        reviewId: 'rev_001',
        bookingId: 'book_001'
      },
      auth: { userId: 'clerk_customer_001' }
    };
    const res = createMockRes();
    const next = jest.fn();

    await createReview(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Missing required fields: providerClerkId, rating'
    });
    expect(Booking.findOne).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 404 when booking is not found', async () => {
    Booking.findOne.mockResolvedValueOnce(null);

    const req = {
      body: {
        reviewId: 'rev_001',
        bookingId: 'book_001',
        providerClerkId: 'clerk_provider_001',
        rating: 5
      },
      auth: { userId: 'clerk_customer_001' }
    };
    const res = createMockRes();
    const next = jest.fn();

    await createReview(req, res, next);

    expect(Booking.findOne).toHaveBeenCalledWith({ bookingId: 'book_001' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Booking not found' });
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 400 when review does not match the booking participants', async () => {
    Booking.findOne.mockResolvedValueOnce({
      bookingId: 'book_001',
      customerClerkId: 'different_customer',
      providerClerkId: 'clerk_provider_001'
    });

    const req = {
      body: {
        reviewId: 'rev_001',
        bookingId: 'book_001',
        providerClerkId: 'clerk_provider_001',
        rating: 5
      },
      auth: { userId: 'clerk_customer_001' }
    };
    const res = createMockRes();
    const next = jest.fn();

    await createReview(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Review does not match the booking' });
    expect(Review.findOne).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 400 when a review already exists for the booking', async () => {
    Booking.findOne.mockResolvedValueOnce({
      bookingId: 'book_001',
      customerClerkId: 'clerk_customer_001',
      providerClerkId: 'clerk_provider_001'
    });
    Review.findOne.mockResolvedValueOnce({
      reviewId: 'rev_existing',
      bookingId: 'book_001'
    });

    const req = {
      body: {
        reviewId: 'rev_001',
        bookingId: 'book_001',
        providerClerkId: 'clerk_provider_001',
        rating: 5
      },
      auth: { userId: 'clerk_customer_001' }
    };
    const res = createMockRes();
    const next = jest.fn();

    await createReview(req, res, next);

    expect(Review.findOne).toHaveBeenCalledWith({ bookingId: 'book_001' });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Review for this booking already exists' });
    expect(next).not.toHaveBeenCalled();
  });

  test('creates a review and returns 201 for valid data', async () => {
    const savedReview = {
      _id: 'mongo_review_id',
      reviewId: 'rev_001',
      bookingId: 'book_001',
      customerClerkId: 'clerk_customer_001',
      providerClerkId: 'clerk_provider_001',
      rating: 5,
      comment: 'Great service'
    };

    Booking.findOne.mockResolvedValueOnce({
      bookingId: 'book_001',
      customerClerkId: 'clerk_customer_001',
      providerClerkId: 'clerk_provider_001'
    });
    Review.findOne.mockResolvedValueOnce(null);
    mockSave.mockResolvedValueOnce(savedReview);

    const req = {
      body: {
        reviewId: 'rev_001',
        bookingId: 'book_001',
        providerClerkId: 'clerk_provider_001',
        rating: 5,
        comment: 'Great service'
      },
      auth: { userId: 'clerk_customer_001' }
    };
    const res = createMockRes();
    const next = jest.fn();

    await createReview(req, res, next);

    expect(Review).toHaveBeenCalledWith({
      reviewId: 'rev_001',
      bookingId: 'book_001',
      customerClerkId: 'clerk_customer_001',
      providerClerkId: 'clerk_provider_001',
      rating: 5,
      comment: 'Great service'
    });
    expect(mockSave).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedReview);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns clean duplicate reviewId error on duplicate key failure', async () => {
    Booking.findOne.mockResolvedValueOnce({
      bookingId: 'book_001',
      customerClerkId: 'clerk_customer_001',
      providerClerkId: 'clerk_provider_001'
    });
    Review.findOne.mockResolvedValueOnce(null);
    mockSave.mockRejectedValueOnce({
      code: 11000,
      keyPattern: { reviewId: 1 }
    });

    const req = {
      body: {
        reviewId: 'rev_001',
        bookingId: 'book_001',
        providerClerkId: 'clerk_provider_001',
        rating: 5
      },
      auth: { userId: 'clerk_customer_001' }
    };
    const res = createMockRes();
    const next = jest.fn();

    await createReview(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Review ID already exists.' });
    expect(next).not.toHaveBeenCalled();
  });

  test('returns formatted rating validation error', async () => {
    Booking.findOne.mockResolvedValueOnce({
      bookingId: 'book_001',
      customerClerkId: 'clerk_customer_001',
      providerClerkId: 'clerk_provider_001'
    });
    Review.findOne.mockResolvedValueOnce(null);
    mockSave.mockRejectedValueOnce({
      name: 'ValidationError',
      errors: {
        rating: { message: 'Path `rating` (6) is more than maximum allowed value (5).' }
      }
    });

    const req = {
      body: {
        reviewId: 'rev_001',
        bookingId: 'book_001',
        providerClerkId: 'clerk_provider_001',
        rating: 6
      },
      auth: { userId: 'clerk_customer_001' }
    };
    const res = createMockRes();
    const next = jest.fn();

    await createReview(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Path `rating` (6) is more than maximum allowed value (5).'
    });
    expect(next).not.toHaveBeenCalled();
  });
});
