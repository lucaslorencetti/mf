import cron from 'node-cron';
import { updateProductsFromFile } from '../services/productService';

/**
 * Initialize the cron job for product updates
 * Schedule: At minutes 0 and 30 of every hour (0,30 * * * *)
 */
export const initializeProductUpdateJob = (): cron.ScheduledTask => {
  console.log(
    'Initializing product update cron job (every 30 minutes - at minutes 0 and 30)',
  );

  // Run immediately on startup
  updateProductsFromFile().catch(error => {
    console.error('Initial product update failed:', error);
  });

  // Schedule the cron job to run at minutes 0 and 30 of every hour
  return cron.schedule('0,30 * * * *', async () => {
    try {
      await updateProductsFromFile();
    } catch (error) {
      console.error('Scheduled product update failed:', error);
    }
  });
};
