import cron from 'node-cron';
import { initializeProductUpdateJob } from './productUpdateJob';

// Store all scheduled tasks
const scheduledTasks: cron.ScheduledTask[] = [];

/**
 * Initialize all cron jobs
 */
export const initializeJobs = async (): Promise<void> => {
  console.log('Initializing all scheduled jobs...');

  try {
    // Initialize product update job
    const productUpdateTask = initializeProductUpdateJob();
    scheduledTasks.push(productUpdateTask);

    // Add more jobs here in the future

    console.log('All scheduled jobs initialized successfully');
  } catch (error) {
    console.error('Error initializing scheduled jobs:', error);
    throw error;
  }
};

/**
 * Stop all running cron jobs
 */
export const stopAllJobs = async (): Promise<void> => {
  console.log('Stopping all scheduled jobs...');

  try {
    // Stop all tasks
    for (const task of scheduledTasks) {
      task.stop();
    }

    console.log('All scheduled jobs stopped successfully');
  } catch (error) {
    console.error('Error stopping scheduled jobs:', error);
    throw error;
  }
};

export default {
  initializeJobs,
  stopAllJobs,
};
