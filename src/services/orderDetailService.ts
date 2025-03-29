import { prisma } from '../db/prisma';
import { Order } from '../types';
import { logError } from '../utils/errorUtils';

export const orderDetailService = async (id: string): Promise<Order | null> => {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
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

    if (!order) {
      return null;
    }

    return {
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
    };
  } catch (error) {
    logError('Error in orderDetailService:', error);
    throw error;
  }
};
