import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getProducts, getProductById } from '../controllers/productController';

// Mock Prisma client
jest.mock('@prisma/client', () => {
  const mockFindMany = jest.fn();
  const mockFindUnique = jest.fn();

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      product: {
        findMany: mockFindMany,
        findUnique: mockFindUnique,
      },
    })),
  };
});

describe('Product Controller', () => {
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

  describe('getProducts', () => {
    it('should return formatted products', async () => {
      // Mock data
      const mockProducts = [
        {
          id: 'prod1',
          name: 'Product 1',
          price: 50.0,
          stock: 10,
        },
        {
          id: 'prod2',
          name: 'Product 2',
          price: 25.0,
          stock: 20,
        },
      ];

      // Setup mock
      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      // Call the function
      await getProducts(mockReq as Request, mockRes as Response);

      // Assertions
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'prod1',
            name: 'Product 1',
            price: 50.0,
            stock: 10,
          }),
          expect.objectContaining({
            id: 'prod2',
            name: 'Product 2',
            price: 25.0,
            stock: 20,
          }),
        ]),
      );
    });

    it('should handle errors', async () => {
      // Setup mock to throw error
      const error = new Error('Database error');
      (prisma.product.findMany as jest.Mock).mockRejectedValue(error);

      // Spy on console.error
      jest.spyOn(console, 'error').mockImplementation();

      // Call the function
      await getProducts(mockReq as Request, mockRes as Response);

      // Assertions
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching products:',
        error,
      );
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to fetch products',
      });
    });
  });

  describe('getProductById', () => {
    it('should return a formatted product when found', async () => {
      // Mock data
      const mockProduct = {
        id: 'prod1',
        name: 'Product 1',
        price: 50.0,
        stock: 10,
      };

      // Setup mock request with params
      mockReq = {
        params: { id: 'prod1' },
      };

      // Setup mock
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

      // Call the function
      await getProductById(mockReq as Request, mockRes as Response);

      // Assertions
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'prod1' },
      });

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'prod1',
          name: 'Product 1',
          price: 50.0,
          stock: 10,
        }),
      );
    });

    it('should return 404 when product is not found', async () => {
      // Setup mock request with params
      mockReq = {
        params: { id: 'nonexistent' },
      };

      // Setup mock to return null (not found)
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      // Call the function
      await getProductById(mockReq as Request, mockRes as Response);

      // Assertions
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('should handle errors', async () => {
      // Setup mock request with params
      mockReq = {
        params: { id: 'prod1' },
      };

      // Setup mock to throw error
      const error = new Error('Database error');
      (prisma.product.findUnique as jest.Mock).mockRejectedValue(error);

      // Spy on console.error
      jest.spyOn(console, 'error').mockImplementation();

      // Call the function
      await getProductById(mockReq as Request, mockRes as Response);

      // Assertions
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching product prod1:',
        error,
      );
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to fetch product',
      });
    });
  });
});
