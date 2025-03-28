import { PrismaClient } from '@prisma/client';
import { Order, OrderMessage } from '../types';

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
    console.error('Error in orderService - getAllOrders:', error);
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
    console.error(`Error in orderService - getOrderById(${id}):`, error);
    throw error;
  }
};

export const processOrder = async (orderData: OrderMessage): Promise<void> => {
  try {
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

    console.log(`Order ${orderData.order_id} processed successfully`);
  } catch (error) {
    console.error(`Error processing order ${orderData.order_id}:`, error);
  }
};
