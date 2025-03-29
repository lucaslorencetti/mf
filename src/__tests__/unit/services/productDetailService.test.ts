import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { prisma } from '@/db/prisma';
import { productDetailService } from '@/services/productDetailService';

describe('productDetailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    prisma.product.deleteMany();
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
      const product = await productDetailService(testProduct.id);

      expect(product).not.toBeNull();

      expect(product?.id).toBe(testProduct.id);
      expect(product?.name).toBe(testProduct.name);
      expect(product?.price).toBe(testProduct.price);
      expect(product?.stock).toBe(testProduct.stock);
    });

    it('should return null when product is not found', async () => {
      const productId = 'nonexistent';
      const product = await productDetailService(productId);
      expect(product).toBeNull();
    });

    it('should throw an error when database query fails', async () => {
      const productId = 'prod1';

      jest
        .spyOn(prisma.product, 'findUnique')
        .mockRejectedValueOnce(new Error('Database error'));
      await expect(productDetailService(productId)).rejects.toThrow(
        'Database error',
      );
    });
  });
});
