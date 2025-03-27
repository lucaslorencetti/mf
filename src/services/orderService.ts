import { PrismaClient } from '@prisma/client';
import { Order } from '../types';

const prisma = new PrismaClient();

export const getAllOrders = async (limit: number = 50): Promise<Order[]> => {
  try {
    const orders = await prisma.order.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    // Transform the data to match the expected response format
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
    console.error('Error in order service - getAllOrders:', error);
    throw error;
  }
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return null;
    }

    // Transform the data to match the expected response format
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
    console.error(`Error in order service - getOrderById(${id}):`, error);
    throw error;
  }
};
