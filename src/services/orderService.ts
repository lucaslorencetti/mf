import { prisma } from '../db/prisma';
import { Order, OrderMessage } from '../types';
import { logError, logInfo } from '../utils/errorUtils';

export const getAllOrders = async (limit = 50): Promise<Order[]> => {
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
    logError('Error in orderService - getAllOrders:', error);
    throw error;
  }
};

export const getOrderById = async (id: string): Promise<Order | null> => {
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
    logError('Error in orderService - getOrderById:', error);
    throw error;
  }
};

export const processOrder = async (orderData: OrderMessage): Promise<void> => {
  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderData.order_id },
    });

    if (existingOrder) {
      logInfo('Order already processed, skipping');
      return;
    }

    await prisma.$transaction(async tx => {
      await tx.order.create({
        data: {
          id: orderData.order_id,
          customerId: orderData.customer_id,
          totalAmount: orderData.total_amount,
          createdAt: new Date(orderData.created_at),
          products: {
            create: orderData.products.map(product => ({
              productId: product.id,
              quantity: product.quantity,
            })),
          },
        },
      });

      for (const product of orderData.products) {
        const existingProduct = await tx.product.findUnique({
          where: { id: product.id },
        });

        if (existingProduct) {
          await tx.product.update({
            where: { id: product.id },
            data: { stock: existingProduct.stock - product.quantity },
          });
        } else {
          await tx.product.create({
            data: {
              id: product.id,
              name: `Product ${product.id}`,
              price: 0,
              stock: 100 - product.quantity,
            },
          });
        }
      }
    });

    logInfo('Order processed successfully');
  } catch (error) {
    logError('Error in orderService - processOrder:', error);
    throw error;
  }
};
