import { prisma } from '../db/prisma';
import { Product } from '../types';
import { logError } from '../utils/errorUtils';

export const productDetailService = async (
  id: string,
): Promise<Product | null> => {
  try {
    return await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
      },
    });
  } catch (error) {
    logError('Error in productDetailService:', error);
    throw error;
  }
};
