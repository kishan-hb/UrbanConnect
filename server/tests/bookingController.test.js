const mockSave = jest.fn();

jest.mock('../models/booking', () => {
  const Booking = jest.fn().mockImplementation((data) => ({
    ...data,
    save: mockSave
  }));

  Booking.find = jest.fn();
  Booking.findById = jest.fn();

  return Booking;
});

jest.mock('../models/user', () => ({
  findOne: jest.fn()
}));

jest.mock('../models/services', () => ({
  findOne: jest.fn()
}));

const Booking = require('../models/booking');
const User = require('../models/user');
const Service = require('../models/services');
const { createBooking } = require('../controllers/bookingController');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('bookingController.createBooking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 400 when required fields are missing', async () => {
    const req = {
      body: {
        bookingId: 'book_001',
        date: '2026-04-10'
      },
      auth: { userId: 'clerk_customer_001' }
    };
    const res = createMockRes();
    const next = jest.fn();

    await createBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Missing required fields: serviceId, timeSlot'
    });
    expect(User.findOne).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 404 when customer is not found', async () => {
    User.findOne.mockResolvedValueOnce(null);

    const req = {
      body: {
        bookingId: 'book_001',
        serviceId: 'svc_001',
        date: '2026-04-10',
        timeSlot: '10:00-12:00'
      },
      auth: { userId: 'clerk_customer_001' }
    };
    const res = createMockRes();
    const next = jest.fn();

    await createBooking(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ clerkId: 'clerk_customer_001' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Customer not found' });
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 400 when authenticated user is not a customer', async () => {
    User.findOne.mockResolvedValueOnce({ clerkId: 'clerk_customer_001', role: 'provider' });

    const req = {
      body: {
        bookingId: 'book_001',
        serviceId: 'svc_001',
        date: '2026-04-10',
        timeSlot: '10:00-12:00'
      },
      auth: { userId: 'clerk_customer_001' }
    };
    const res = createMockRes();
    const next = jest.fn();

    await createBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Selected user is not a customer' });
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 404 when service is not found', async () => {
    User.findOne.mockResolvedValueOnce({ clerkId: 'clerk_customer_001', role: 'customer' });
    Service.findOne.mockResolvedValueOnce(null);

    const req = {
      body: {
        bookingId: 'book_001',
        serviceId: 'svc_001',
        date: '2026-04-10',
        timeSlot: '10:00-12:00'
      },
      auth: { userId: 'clerk_customer_001' }
    };
    const res = createMockRes();
    const next = jest.fn();

    await createBooking(req, res, next);

    expect(Service.findOne).toHaveBeenCalledWith({ serviceId: 'svc_001' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Service not found' });
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 404 when provider is not found from the selected service', async () => {
    User.findOne
      .mockResolvedValueOnce({ clerkId: 'clerk_customer_001', role: 'customer' })
      .mockResolvedValueOnce(null);
    Service.findOne.mockResolvedValueOnce({
      serviceId: 'svc_001',
      providerClerkId: 'clerk_provider_001'
    });

    const req = {
      body: {
        bookingId: 'book_001',
        serviceId: 'svc_001',
        date: '2026-04-10',
        timeSlot: '10:00-12:00'
      },
      auth: { userId: 'clerk_customer_001' }
    };
    const res = createMockRes();
    const next = jest.fn();

    await createBooking(req, res, next);

    expect(User.findOne).toHaveBeenLastCalledWith({ clerkId: 'clerk_provider_001' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Provider not found' });
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 400 when service provider does not have provider role', async () => {
    User.findOne
      .mockResolvedValueOnce({ clerkId: 'clerk_customer_001', role: 'customer' })
      .mockResolvedValueOnce({ clerkId: 'clerk_provider_001', role: 'customer' });
    Service.findOne.mockResolvedValueOnce({
      serviceId: 'svc_001',
      providerClerkId: 'clerk_provider_001'
    });

    const req = {
      body: {
        bookingId: 'book_001',
        serviceId: 'svc_001',
        date: '2026-04-10',
        timeSlot: '10:00-12:00'
      },
      auth: { userId: 'clerk_customer_001' }
    };
    const res = createMockRes();
    const next = jest.fn();

    await createBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Selected user is not a provider' });
    expect(next).not.toHaveBeenCalled();
  });

  test('creates a booking and returns 201 for valid data', async () => {
    const savedBooking = {
      _id: 'mongo_booking_id',
      bookingId: 'book_001',
      customerClerkId: 'clerk_customer_001',
      providerClerkId: 'clerk_provider_001',
      serviceId: 'svc_001',
      date: '2026-04-10',
      timeSlot: '10:00-12:00',
      status: 'pending',
      paymentStatus: 'pending'
    };

    User.findOne
      .mockResolvedValueOnce({ clerkId: 'clerk_customer_001', role: 'customer' })
      .mockResolvedValueOnce({ clerkId: 'clerk_provider_001', role: 'provider' });
    Service.findOne.mockResolvedValueOnce({
      serviceId: 'svc_001',
      providerClerkId: 'clerk_provider_001'
    });
    mockSave.mockResolvedValueOnce(savedBooking);

    const req = {
      body: {
        bookingId: 'book_001',
        serviceId: 'svc_001',
        date: '2026-04-10',
        timeSlot: '10:00-12:00',
        status: 'pending',
        paymentStatus: 'pending'
      },
      auth: { userId: 'clerk_customer_001' }
    };
    const res = createMockRes();
    const next = jest.fn();

    await createBooking(req, res, next);

    expect(Booking).toHaveBeenCalledWith({
      bookingId: 'book_001',
      customerClerkId: 'clerk_customer_001',
      providerClerkId: 'clerk_provider_001',
      serviceId: 'svc_001',
      date: '2026-04-10',
      timeSlot: '10:00-12:00',
      status: 'pending',
      paymentStatus: 'pending'
    });
    expect(mockSave).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedBooking);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns clean duplicate bookingId error on duplicate key failure', async () => {
    User.findOne
      .mockResolvedValueOnce({ clerkId: 'clerk_customer_001', role: 'customer' })
      .mockResolvedValueOnce({ clerkId: 'clerk_provider_001', role: 'provider' });
    Service.findOne.mockResolvedValueOnce({
      serviceId: 'svc_001',
      providerClerkId: 'clerk_provider_001'
    });
    mockSave.mockRejectedValueOnce({
      code: 11000,
      keyPattern: { bookingId: 1 }
    });

    const req = {
      body: {
        bookingId: 'book_001',
        serviceId: 'svc_001',
        date: '2026-04-10',
        timeSlot: '10:00-12:00'
      },
      auth: { userId: 'clerk_customer_001' }
    };
    const res = createMockRes();
    const next = jest.fn();

    await createBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Booking ID already exists.' });
    expect(next).not.toHaveBeenCalled();
  });
});
