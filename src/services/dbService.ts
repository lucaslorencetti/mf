import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const resetDatabase = async (): Promise<void> => {
  try {
    await prisma.$transaction(async tx => {
      await tx.orderProduct.deleteMany({});
      await tx.order.deleteMany({});
      await tx.product.deleteMany({});
    });
  } catch (error) {
    console.error('Error in dbService - resetDatabase:', error);
    throw error;
  }
};
