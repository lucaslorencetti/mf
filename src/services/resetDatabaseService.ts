import { prisma } from '../db/prisma';
import { logError } from '../utils/errorUtils';

export const resetDatabaseService = async (): Promise<void> => {
  try {
    await prisma.$transaction(async tx => {
      await tx.orderProduct.deleteMany({});
      await tx.order.deleteMany({});
      await tx.product.deleteMany({});
    });
  } catch (error) {
    logError('Error in resetDatabaseService:', error);
    throw error;
  }
};
