import { Request, Response } from 'express';
import { sendSampleOrders } from '../scripts/mockProducer';

export const triggerMockProducer = async (req: Request, res: Response) => {
  try {
    await sendSampleOrders();

    res.status(202).json({
      message: 'Mock producer triggered successfully',
      timestamp: new Date().toISOString(),
      info: 'Sample orders are being sent to Kafka in the background',
    });
  } catch (error) {
    console.error('Error triggering mock producer:', error);
    res.status(500).json({
      error: 'Failed to trigger mock producer',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
