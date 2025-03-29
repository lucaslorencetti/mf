import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { prisma } from '@/db/prisma';
import { orderDetailService } from '@/services/orderDetailService';

describe('orderDetailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    prisma.order.deleteMany();
    prisma.orderProduct.deleteMany();
    prisma.product.deleteMany();
  });

  describe('getOrderById', () => {
    it('should return an order by ID', async () => {
      await prisma.product.create({
        data: {
          id: 'prod1',
          name: 'Produto 1',
          price: 20.0,
          stock: 100,
        },
      });

      await prisma.product.create({
        data: {
          id: 'prod2',
          name: 'Produto 2',
          price: 99.99,
          stock: 100,
        },
      });

      await prisma.order.create({
        data: {
          id: 'order1',
          customerId: 'customer1',
          totalAmount: 139.99,
          createdAt: new Date('2025-03-28T10:00:00Z'),
          products: {
            create: [
              {
                productId: 'prod1',
                quantity: 2,
              },
              {
                productId: 'prod2',
                quantity: 1,
              },
            ],
          },
        },
      });

      const order = await orderDetailService('order1');

      expect(order).not.toBeNull();
      expect(order?.id).toBe('order1');
      expect(order?.customer_id).toBe('customer1');
      expect(order?.total_amount).toBe(139.99);
      expect(order?.products).toHaveLength(2);
      expect(order?.products[0]?.id).toBe('prod1');
      expect(order?.products[0]?.quantity).toBe(2);
      expect(order?.products[1]?.id).toBe('prod2');
      expect(order?.products[1]?.quantity).toBe(1);
    });

    it('should return null when order is not found', async () => {
      const order = await orderDetailService('nonexistent');

      expect(order).toBeNull();
    });

    it('should throw an error when database query fails', async () => {
      jest
        .spyOn(prisma.order, 'findUnique')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(orderDetailService('order1')).rejects.toThrow(
        'Database error',
      );
    });
  });
});
