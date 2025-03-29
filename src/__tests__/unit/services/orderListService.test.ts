import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { prisma } from '@/db/prisma';
import { orderListService } from '@/services/orderListService';

describe('orderListService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    prisma.order.deleteMany();
    prisma.orderProduct.deleteMany();
    prisma.product.deleteMany();
  });

  describe('getAllOrders', () => {
    it('should return all orders ordered by createdAt desc', async () => {
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

      await prisma.order.create({
        data: {
          id: 'order2',
          customerId: 'customer1',
          totalAmount: 219.98,
          createdAt: new Date('2025-03-28T11:00:00Z'),
          products: {
            create: [
              {
                productId: 'prod1',
                quantity: 3,
              },
              {
                productId: 'prod2',
                quantity: 2,
              },
            ],
          },
        },
      });

      const orders = await orderListService();

      expect(orders).toHaveLength(2);
      expect(orders[0]?.id).toBe('order2');
      expect(orders[1]?.id).toBe('order1');

      expect(orders[0]).toHaveProperty('customer_id');
      expect(orders[0]).toHaveProperty('total_amount');
      expect(orders[0]).toHaveProperty('created_at');
      expect(orders[0]).toHaveProperty('products');
      expect(orders[0]?.products).toHaveLength(2);

      expect(orders[0]?.products[0]).toHaveProperty('id');
      expect(orders[0]?.products[0]).toHaveProperty('name');
      expect(orders[0]?.products[0]).toHaveProperty('price');
      expect(orders[0]?.products[0]).toHaveProperty('quantity');
    });

    it('should return empty array when no orders exist', async () => {
      const orders = await orderListService();

      expect(orders).toEqual([]);
    });

    it('should respect the limit parameter', async () => {
      await prisma.product.create({
        data: {
          id: 'prod1',
          name: 'Produto 1',
          price: 20.0,
          stock: 100,
        },
      });

      for (let i = 1; i <= 5; i++) {
        await prisma.order.create({
          data: {
            id: `order${i}`,
            customerId: 'customer1',
            totalAmount: 20.0 * i,
            createdAt: new Date(`2025-03-${20 + i}T10:00:00Z`),
            products: {
              create: [
                {
                  productId: 'prod1',
                  quantity: i,
                },
              ],
            },
          },
        });
      }

      const orders = await orderListService(3);

      expect(orders).toHaveLength(3);
    });

    it('should throw an error when database query fails', async () => {
      jest
        .spyOn(prisma.order, 'findMany')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(orderListService()).rejects.toThrow('Database error');
    });
  });
});
