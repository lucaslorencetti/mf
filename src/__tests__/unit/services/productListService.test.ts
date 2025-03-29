import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { prisma } from '@/db/prisma';
import { productListService } from '@/services/productListService';
import { Product } from '@/types';

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

describe('productListService', () => {
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

      const products = await productListService();

      expect(products).toHaveLength(5);
      expect(products[0]?.name).toBe('Produto 1');
      expect(products[1]?.name).toBe('Produto 2');

      expect(products[0]).toHaveProperty('id');
      expect(products[0]).toHaveProperty('name');
      expect(products[0]).toHaveProperty('price');
      expect(products[0]).toHaveProperty('stock');
    });

    it('should return empty array when no products exist', async () => {
      const products = await productListService();
      expect(products).toEqual([]);
    });

    it('should throw an error when database query fails', async () => {
      jest
        .spyOn(prisma.product, 'findMany')
        .mockRejectedValueOnce(new Error('Database error'));
      await expect(productListService()).rejects.toThrow('Database error');
    });
  });
});
