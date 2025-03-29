import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { prisma } from '@/db/prisma';
import { orderProcessingService } from '@/services/orderProcessingService';
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

describe('orderProcessingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    prisma.order.deleteMany();
    prisma.orderProduct.deleteMany();
    prisma.product.deleteMany();
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

      await orderProcessingService(mockOrderMessage);

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
      await orderProcessingService(mockOrderMessage);

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

      await orderProcessingService(mockOrderMessage);

      expect(createSpy).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      jest
        .spyOn(prisma.order, 'findUnique')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(orderProcessingService(mockOrderMessage)).rejects.toThrow();
    });
  });
});
