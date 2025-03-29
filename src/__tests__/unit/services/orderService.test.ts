import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { prisma } from '@/db/prisma';
import {
  getAllOrders,
  getOrderById,
  processOrder,
} from '@/services/orderService';
import { OrderMessage } from '@/types';

const mockOrderMessage: OrderMessage = {
  order_id: 'order2',
  customer_id: 'customer1',
  total_amount: 219.98,
  created_at: '2025-03-28T11:00:00Z',
  products: [
    {
      id: 'prod1',
      quantity: 3,
    },
    {
      id: 'prod3',
      quantity: 2,
    },
  ],
};

describe('orderService', () => {
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

      const orders = await getAllOrders();

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
      const orders = await getAllOrders();

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

      const orders = await getAllOrders(3);

      expect(orders).toHaveLength(3);
    });

    it('should throw an error when database query fails', async () => {
      jest
        .spyOn(prisma.order, 'findMany')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(getAllOrders()).rejects.toThrow('Database error');
    });
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

      const order = await getOrderById('order1');

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
      const order = await getOrderById('nonexistent');

      expect(order).toBeNull();
    });

    it('should throw an error when database query fails', async () => {
      jest
        .spyOn(prisma.order, 'findUnique')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(getOrderById('order1')).rejects.toThrow('Database error');
    });
  });

  describe('processOrder', () => {
    it('should process a new order successfully', async () => {
      await prisma.product.create({
        data: {
          id: 'prod1',
          name: 'Produto 1',
          price: 20.0,
          stock: 100,
        },
      });

      await processOrder(mockOrderMessage);

      const order = await prisma.order.findUnique({
        where: { id: mockOrderMessage.order_id },
        include: {
          products: true,
        },
      });

      expect(order).not.toBeNull();
      expect(order?.customerId).toBe(mockOrderMessage.customer_id);
      expect(order?.totalAmount).toBe(mockOrderMessage.total_amount);
      expect(order?.products).toHaveLength(2);

      const product = await prisma.product.findUnique({
        where: { id: 'prod1' },
      });

      expect(product?.stock).toBe(97);
    });

    it('should create missing products when processing an order', async () => {
      await processOrder(mockOrderMessage);

      const product = await prisma.product.findUnique({
        where: { id: 'prod3' },
      });

      expect(product).not.toBeNull();
      expect(product?.name).toBe('Product prod3');
      expect(product?.stock).toBe(98); // 100 - 2
    });

    it('should skip processing if order already exists', async () => {
      await prisma.order.create({
        data: {
          id: mockOrderMessage.order_id,
          customerId: mockOrderMessage.customer_id,
          totalAmount: mockOrderMessage.total_amount,
          createdAt: new Date(mockOrderMessage.created_at),
        },
      });

      const createSpy = jest.spyOn(prisma.order, 'create');

      await processOrder(mockOrderMessage);

      expect(createSpy).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      jest
        .spyOn(prisma.order, 'findUnique')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(processOrder(mockOrderMessage)).rejects.toThrow();
    });
  });
});
