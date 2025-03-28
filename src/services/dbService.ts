import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Reset the database by deleting all records from all tables
 * Order of deletion is important due to foreign key constraints
 */
export const resetDatabase = async (): Promise<void> => {
  try {
    // Start a transaction to ensure all operations succeed or fail together
    await prisma.$transaction(async tx => {
      // First delete OrderProduct records (junction table with foreign keys)
      await tx.orderProduct.deleteMany({});

      // Then delete Orders
      await tx.order.deleteMany({});

      // Finally delete Products
      await tx.product.deleteMany({});
    });
  } catch (error) {
    console.error('Error in db service - resetDatabase:', error);
    throw error;
  }
};
