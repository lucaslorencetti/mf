import cron from 'node-cron';
import { updateProductsFromFile } from '../services/productService';

export const initializeProductUpdateJob = (): cron.ScheduledTask => {
  console.log(
    'JOBS - Initializing product update cron job (every 30 minutes - at minutes 0 and 30)',
  );

  updateProductsFromFile().catch(error => {
    console.error('JOBS - Initial product update failed:', error);
  });
  return cron.schedule('0,30 * * * *', async () => {
    try {
      await updateProductsFromFile();
    } catch (error) {
      console.error('JOBS - Scheduled product update failed:', error);
    }
  });
};
