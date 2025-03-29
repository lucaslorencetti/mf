import { Request, Response } from 'express';

import { resetDatabaseService } from '../services/resetDatabaseService';
import { logError } from '../utils/errorUtils';

export const resetDatabase = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await resetDatabaseService();

    res.status(200).json({
      message: 'Database reset successful',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logError('Error in dbController - resetDatabase:', error);
    res.status(500).json({
      error: 'Failed to reset database',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
