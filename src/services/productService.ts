import { PrismaClient } from '@prisma/client';
import { Product } from '../types';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const PRODUCTS_FILE_PATH = path.resolve(
  process.cwd(),
  'src/data/products.json',
);

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
 * Read products from the local JSON file
 */
export const readProductsFromFile = async (): Promise<Product[]> => {
  try {
    const data = await fs.promises.readFile(PRODUCTS_FILE_PATH, 'utf8');
    return JSON.parse(data) as Product[];
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
};

/**
 * Update products in the database with data from the JSON file
 */
export const updateProductsFromFile = async (): Promise<void> => {
  try {
    console.log('Starting product update from file...');
    const products = await readProductsFromFile();

    if (products.length === 0) {
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
