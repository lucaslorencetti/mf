import cron from 'node-cron';

import { productUpdateFromFileService } from '../services/productUpdateFromFileService';
import { logError, logInfo } from '../utils/errorUtils';

export const initializeProductUpdateJob = (): cron.ScheduledTask => {
  logInfo(
    'JOBS - Initializing product update cron job (every 30 minutes - at minutes 0 and 30)',
  );

  return cron.schedule('0,30 * * * *', async () => {
    try {
      await productUpdateFromFileService();
      logInfo('JOBS - Scheduled product update completed successfully');
    } catch (error) {
      logError('JOBS - Scheduled product update failed:', error);
    }
  });
};
