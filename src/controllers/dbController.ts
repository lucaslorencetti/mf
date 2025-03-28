import { Request, Response } from 'express';
import * as dbService from '../services/dbService';

export const resetDatabase = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await dbService.resetDatabase();

    res.status(200).json({
      message: 'Database reset successful',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({
      error: 'Failed to reset database',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
