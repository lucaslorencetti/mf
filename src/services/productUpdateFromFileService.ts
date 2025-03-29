import path from 'path';

import { prisma } from '../db/prisma';
import { Product } from '../types';
import { logError } from '../utils/errorUtils';
import { readJsonFile } from '../utils/fileUtils';

const PRODUCTS_FILE_PATH = path.resolve('src/data/products.json');

export const productUpdateFromFileService = async (): Promise<void> => {
  try {
    const products = await readJsonFile<Product[]>(PRODUCTS_FILE_PATH);

    if (!products || products.length === 0) {
      logError('No products found in the file or file could not be read');
      return;
    }

    await prisma.$transaction(async tx => {
      for (const product of products) {
        await tx.product.upsert({
          where: { id: product.id },
          update: {
            name: product.name,
            price: product.price,
            stock: product.stock,
          },
          create: {
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
          },
        });
      }
    });
  } catch (error) {
    logError('Error in productUpdateFromFileService:', error);
    throw error;
  }
};
