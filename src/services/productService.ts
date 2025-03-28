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

    return products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
    }));
  } catch (error) {
    console.error('Error in productService - getAllProducts:', error);
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

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
    };
  } catch (error) {
    console.error(`Error in productService - getProductById(${id}):`, error);
    throw error;
  }
};

export const updateProductsFromFile = async (): Promise<void> => {
  try {
    const products = await readJsonFile<Product[]>(PRODUCTS_FILE_PATH);

    if (!products || products.length === 0) {
      console.warn('No products found in the file or file could not be read');
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
    console.error('Error in productService - updateProductsFromFile:', error);
    throw error;
  }
};
