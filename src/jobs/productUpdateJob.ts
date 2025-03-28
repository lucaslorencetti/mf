import cron from 'node-cron';
import { updateProductsFromFile } from '../services/productService';

/**
 * Initialize the cron job for product updates
 * Schedule: Every 30 minutes
 */
export const initializeProductUpdateJob = (): cron.ScheduledTask => {
  console.log('Initializing product update cron job (every 30 minutes)');

  // Run immediately on startup
  updateProductsFromFile().catch(error => {
    console.error('Initial product update failed:', error);
  });

  // Schedule the cron job to run every 30 minutes
  return cron.schedule('*/30 * * * *', async () => {
    try {
      await updateProductsFromFile();
    } catch (error) {
      console.error('Scheduled product update failed:', error);
    }
  });
};
