import { Request, Response } from 'express';

import { orderDetailService } from '../services/orderDetailService';
import { orderListService } from '../services/orderListService';
import { logError } from '../utils/errorUtils';

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await orderListService();
    res.json(orders);
  } catch (error) {
    logError('Error in orderController - getOrders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Missing order ID' });
      return;
    }
    const order = await orderDetailService(id);

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.json(order);
  } catch (error) {
    logError(
      `Error in orderController - getOrderById: ${req.params.id}`,
      error,
    );
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};
