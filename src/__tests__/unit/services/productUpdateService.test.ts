import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import path from 'path';

import { prisma } from '@/db/prisma';
import { productUpdateFromFileService } from '@/services/productUpdateFromFileService';
import { Product } from '@/types';
import * as fileUtils from '@/utils/fileUtils';

jest.mock('@/utils/fileUtils', () => ({
  readJsonFile: jest.fn().mockImplementation(() => Promise.resolve([])),
}));

describe('productUpdateFromFileService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    prisma.product.deleteMany();
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

      await productUpdateFromFileService();

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
      await productUpdateFromFileService();

      expect(fileUtils.readJsonFile).toHaveBeenCalled();

      const products = await prisma.product.findMany();
      expect(products).toHaveLength(0);
    });

    it('should handle null return from readJsonFile', async () => {
      (fileUtils.readJsonFile as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(null),
      );

      await productUpdateFromFileService();

      expect(fileUtils.readJsonFile).toHaveBeenCalled();

      const products = await prisma.product.findMany();
      expect(products).toHaveLength(0);
    });

    it('should throw an error when file reading fails', async () => {
      const mockError = new Error('File reading error');

      (fileUtils.readJsonFile as jest.Mock).mockImplementationOnce(() =>
        Promise.reject(mockError),
      );

      await expect(productUpdateFromFileService()).rejects.toThrow(mockError);
      expect(fileUtils.readJsonFile).toHaveBeenCalled();
    });
  });
});
