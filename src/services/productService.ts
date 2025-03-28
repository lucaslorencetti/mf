import { PrismaClient } from '@prisma/client';
import { Product } from '../types';
import { readJsonFile } from '../utils/fileUtils';

const prisma = new PrismaClient();
const PRODUCTS_FILE_PATH = 'src/data/products.json';

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    // Transform the data to match the expected response format
    return products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
    }));
  } catch (error) {
    console.error('Error in product service - getAllProducts:', error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return null;
    }

    // Transform the data to match the expected response format
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
    };
  } catch (error) {
    console.error(`Error in product service - getProductById(${id}):`, error);
    throw error;
  }
};

/**
 * Update products in the database with data from the JSON file
 */
export const updateProductsFromFile = async (): Promise<void> => {
  try {
    console.log('Starting product update from file...');

    // Read products from JSON file using the generic utility
    const products = await readJsonFile<Product[]>(PRODUCTS_FILE_PATH);

    if (!products || products.length === 0) {
      console.warn('No products found in the file or file could not be read');
      return;
    }

    // Process each product - update if exists, create if not
    for (const product of products) {
      await prisma.product.upsert({
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

    console.log(`Successfully updated ${products.length} products from file`);
  } catch (error) {
    console.error('Error updating products from file:', error);
    throw error;
  }
};
