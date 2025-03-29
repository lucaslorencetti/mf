import cron from 'node-cron';

import { logError, logInfo } from '../utils/errorUtils';
import { initializeProductUpdateJob } from './productUpdateJob';

const scheduledTasks: cron.ScheduledTask[] = [];

export const initializeJobs = async (): Promise<void> => {
  logInfo('JOBS - Initializing all scheduled jobs...');

  try {
    const productUpdateTask = initializeProductUpdateJob();
    scheduledTasks.push(productUpdateTask);

    logInfo('JOBS - All scheduled jobs initialized successfully');
  } catch (error) {
    logError('JOBS - Error initializing scheduled jobs:', error);
    throw error;
  }
};

export const stopAllJobs = async (): Promise<void> => {
  logInfo('JOBS - Stopping all scheduled jobs...');

  try {
    for (const task of scheduledTasks) {
      task.stop();
    }

    logInfo('JOBS - All scheduled jobs stopped successfully');
  } catch (error) {
    logError('JOBS - Error stopping scheduled jobs:', error);
    throw error;
  }
};

export default {
  initializeJobs,
  stopAllJobs,
};
