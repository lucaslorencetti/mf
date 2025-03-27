import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    // Transform the data to match the expected response format
    return products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock
    }));
  } catch (error) {
    console.error('Error in product service - getAllProducts:', error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return null;
    }

    // Transform the data to match the expected response format
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock
    };
  } catch (error) {
    console.error(`Error in product service - getProductById(${id}):`, error);
    throw error;
  }
};
