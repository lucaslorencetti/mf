import { Request, Response } from 'express';

import * as orderService from '../services/orderService';

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
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
    const order = await orderService.getOrderById(id);

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error(`Error fetching order ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};
