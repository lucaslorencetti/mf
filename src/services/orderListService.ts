import { prisma } from '../db/prisma';
import { Order } from '../types';
import { logError } from '../utils/errorUtils';

export const orderListService = async (limit = 50): Promise<Order[]> => {
  try {
    const orders = await prisma.order.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        customerId: true,
        totalAmount: true,
        createdAt: true,
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    return orders.map(order => ({
      id: order.id,
      customer_id: order.customerId,
      total_amount: order.totalAmount,
      created_at: order.createdAt,
      products: order.products.map(op => ({
        id: op.productId,
        name: op.product.name,
        price: op.product.price,
        quantity: op.quantity,
      })),
    }));
  } catch (error) {
    logError('Error in orderListService:', error);
    throw error;
  }
};
