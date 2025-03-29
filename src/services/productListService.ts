import { prisma } from '../db/prisma';
import { Product } from '../types';
import { logError } from '../utils/errorUtils';

export const productListService = async (): Promise<Product[]> => {
  try {
    return await prisma.product.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
      },
    });
  } catch (error) {
    logError('Error in productListService:', error);
    throw error;
  }
};
