import cron from 'node-cron';
import { initializeProductUpdateJob } from './productUpdateJob';

const scheduledTasks: cron.ScheduledTask[] = [];

export const initializeJobs = async (): Promise<void> => {
  console.log('JOBS - Initializing all scheduled jobs...');

  try {
    const productUpdateTask = initializeProductUpdateJob();
    scheduledTasks.push(productUpdateTask);

    console.log('JOBS - All scheduled jobs initialized successfully');
  } catch (error) {
    console.error('JOBS - Error initializing scheduled jobs:', error);
    throw error;
  }
};

export const stopAllJobs = async (): Promise<void> => {
  console.log('JOBS - Stopping all scheduled jobs...');

  try {
    for (const task of scheduledTasks) {
      task.stop();
    }

    console.log('JOBS - All scheduled jobs stopped successfully');
  } catch (error) {
    console.error('JOBS - Error stopping scheduled jobs:', error);
    throw error;
  }
};

export default {
  initializeJobs,
  stopAllJobs,
};
