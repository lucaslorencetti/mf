import { prisma } from '../db/prisma';
import { OrderMessage } from '../types';
import { logError, logInfo } from '../utils/errorUtils';

export const orderProcessingService = async (
  orderData: OrderMessage,
): Promise<void> => {
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
    logError('Error in orderProcessingService:', error);
    throw error;
  }
};
