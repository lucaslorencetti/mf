import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getOrders, getOrderById } from '../controllers/orderController';

// Mock Prisma client
jest.mock('@prisma/client', () => {
  const mockFindMany = jest.fn();
  const mockFindUnique = jest.fn();

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      order: {
        findMany: mockFindMany,
        findUnique: mockFindUnique,
      },
    })),
  };
});

describe('Order Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = new PrismaClient();
    mockReq = {};
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrders', () => {
    it('should return formatted orders', async () => {
      // Mock data
      const mockOrders = [
        {
          id: 'order1',
          customerId: 'cust1',
          totalAmount: 100.0,
          createdAt: new Date(),
          products: [
            {
              productId: 'prod1',
              quantity: 2,
              product: {
                id: 'prod1',
                name: 'Product 1',
                price: 50.0,
                stock: 10,
              },
            },
          ],
        },
      ];

      // Setup mock
      (prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders);

      // Call the function
      await getOrders(mockReq as Request, mockRes as Response);

      // Assertions
      expect(prisma.order.findMany).toHaveBeenCalledWith({
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      });

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'order1',
            customer_id: 'cust1',
            total_amount: 100.0,
            products: expect.arrayContaining([
              expect.objectContaining({
                id: 'prod1',
                name: 'Product 1',
                price: 50.0,
                quantity: 2,
              }),
            ]),
          }),
        ]),
      );
    });

    it('should handle errors', async () => {
      // Setup mock to throw error
      const error = new Error('Database error');
      (prisma.order.findMany as jest.Mock).mockRejectedValue(error);

      // Spy on console.error
      jest.spyOn(console, 'error').mockImplementation();

      // Call the function
      await getOrders(mockReq as Request, mockRes as Response);

      // Assertions
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching orders:',
        error,
      );
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to fetch orders',
      });
    });
  });

  describe('getOrderById', () => {
    it('should return a formatted order when found', async () => {
      // Mock data
      const mockOrder = {
        id: 'order1',
        customerId: 'cust1',
        totalAmount: 100.0,
        createdAt: new Date(),
        products: [
          {
            productId: 'prod1',
            quantity: 2,
            product: {
              id: 'prod1',
              name: 'Product 1',
              price: 50.0,
              stock: 10,
            },
          },
        ],
      };

      // Setup mock request with params
      mockReq = {
        params: { id: 'order1' },
      };

      // Setup mock
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);

      // Call the function
      await getOrderById(mockReq as Request, mockRes as Response);

      // Assertions
      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: 'order1' },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      });

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'order1',
          customer_id: 'cust1',
          total_amount: 100.0,
          products: expect.arrayContaining([
            expect.objectContaining({
              id: 'prod1',
              name: 'Product 1',
              price: 50.0,
              quantity: 2,
            }),
          ]),
        }),
      );
    });

    it('should return 404 when order is not found', async () => {
      // Setup mock request with params
      mockReq = {
        params: { id: 'nonexistent' },
      };

      // Setup mock to return null (not found)
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

      // Call the function
      await getOrderById(mockReq as Request, mockRes as Response);

      // Assertions
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Order not found' });
    });

    it('should handle errors', async () => {
      // Setup mock request with params
      mockReq = {
        params: { id: 'order1' },
      };

      // Setup mock to throw error
      const error = new Error('Database error');
      (prisma.order.findUnique as jest.Mock).mockRejectedValue(error);

      // Spy on console.error
      jest.spyOn(console, 'error').mockImplementation();

      // Call the function
      await getOrderById(mockReq as Request, mockRes as Response);

      // Assertions
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching order order1:',
        error,
      );
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to fetch order',
      });
    });
  });
});
