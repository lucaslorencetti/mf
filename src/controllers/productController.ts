import { Request, Response } from 'express';

import { productDetailService } from '../services/productDetailService';
import { productListService } from '../services/productListService';
import { productUpdateFromFileService } from '../services/productUpdateFromFileService';
import { logError } from '../utils/errorUtils';

export const getProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const products = await productListService();
    res.json(products);
  } catch (error) {
    logError('Error in productController - getProducts:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Missing product ID' });
      return;
    }
    const product = await productDetailService(id);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    logError(
      `Error in productController - getProductById: ${req.params.id}`,
      error,
    );
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const updateProductsFromFileHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await productUpdateFromFileService();

    res.status(200).json({
      message: 'Products updated successfully from file',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logError('Error in productController - updateProductsFromFile:', error);
    res.status(500).json({
      error: 'Failed to update products from file',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
