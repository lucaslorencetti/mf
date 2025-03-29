import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import path from 'path';

import { prisma } from '@/db/prisma';
import {
  getAllProducts,
  getProductById,
  updateProductsFromFile,
} from '@/services/productService';
import { Product } from '@/types';
import * as fileUtils from '@/utils/fileUtils';

jest.mock('@/utils/fileUtils', () => ({
  readJsonFile: jest.fn().mockImplementation(() => Promise.resolve([])),
}));

const mockProducts: Product[] = [
  {
    id: 'prod1',
    name: 'Produto 1',
    price: 20.0,
    stock: 100,
  },
  {
    id: 'prod2',
    name: 'Produto 2',
    price: 99.99,
    stock: 100,
  },
  {
    id: 'prod3',
    name: 'Produto 3',
    price: 199.99,
    stock: 100,
  },
  {
    id: 'prod4',
    name: 'Produto 4',
    price: 1.99,
    stock: 100,
  },
  {
    id: 'prod5',
    name: 'Produto 5',
    price: 5.5,
    stock: 100,
  },
];

describe('productService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    prisma.product.deleteMany();
  });

  describe('getAllProducts', () => {
    it('should return all products ordered by name', async () => {
      await Promise.all(
        mockProducts.map(product =>
          prisma.product.create({
            data: product,
          }),
        ),
      );

      const products = await getAllProducts();

      expect(products).toHaveLength(5);
      expect(products[0]?.name).toBe('Produto 1');
      expect(products[1]?.name).toBe('Produto 2');

      expect(products[0]).toHaveProperty('id');
      expect(products[0]).toHaveProperty('name');
      expect(products[0]).toHaveProperty('price');
      expect(products[0]).toHaveProperty('stock');
    });

    it('should return empty array when no products exist', async () => {
      const products = await getAllProducts();
      expect(products).toEqual([]);
    });

    it('should throw an error when database query fails', async () => {
      jest
        .spyOn(prisma.product, 'findMany')
        .mockRejectedValueOnce(new Error('Database error'));
      await expect(getAllProducts()).rejects.toThrow('Database error');
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const testProduct = {
        id: 'prod1',
        name: 'Produto 1',
        price: 20.0,
        stock: 100,
      };

      await prisma.product.create({
        data: testProduct,
      });
      const product = await getProductById(testProduct.id);

      expect(product).not.toBeNull();

      expect(product?.id).toBe(testProduct.id);
      expect(product?.name).toBe(testProduct.name);
      expect(product?.price).toBe(testProduct.price);
      expect(product?.stock).toBe(testProduct.stock);
    });

    it('should return null when product is not found', async () => {
      const productId = 'nonexistent';
      const product = await getProductById(productId);
      expect(product).toBeNull();
    });

    it('should throw an error when database query fails', async () => {
      const productId = 'prod1';

      jest
        .spyOn(prisma.product, 'findUnique')
        .mockRejectedValueOnce(new Error('Database error'));
      await expect(getProductById(productId)).rejects.toThrow('Database error');
    });
  });

  describe('updateProductsFromFile', () => {
    it('should update products from file successfully', async () => {
      const testProducts: Product[] = [
        {
          id: 'prod1',
          name: 'Produto 1',
          price: 20.0,
          stock: 100,
        },
        {
          id: 'prod2',
          name: 'Produto 2',
          price: 99.99,
          stock: 100,
        },
      ];

      (fileUtils.readJsonFile as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(testProducts),
      );

      await updateProductsFromFile();

      expect(fileUtils.readJsonFile).toHaveBeenCalledWith(
        path.resolve('src/data/products.json'),
      );

      const products = await prisma.product.findMany({
        orderBy: { name: 'asc' },
      });

      expect(products).toHaveLength(2);
      expect(products[0]?.name).toBe('Produto 1');
    });

    it('should handle empty products array gracefully', async () => {
      (fileUtils.readJsonFile as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve([]),
      );
      await updateProductsFromFile();

      expect(fileUtils.readJsonFile).toHaveBeenCalled();

      const products = await prisma.product.findMany();
      expect(products).toHaveLength(0);
    });

    it('should handle null return from readJsonFile', async () => {
      (fileUtils.readJsonFile as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(null),
      );

      await updateProductsFromFile();

      expect(fileUtils.readJsonFile).toHaveBeenCalled();

      const products = await prisma.product.findMany();
      expect(products).toHaveLength(0);
    });

    it('should throw an error when file reading fails', async () => {
      const mockError = new Error('File reading error');

      (fileUtils.readJsonFile as jest.Mock).mockImplementationOnce(() =>
        Promise.reject(mockError),
      );

      await expect(updateProductsFromFile()).rejects.toThrow(mockError);
      expect(fileUtils.readJsonFile).toHaveBeenCalled();
    });
  });
});
