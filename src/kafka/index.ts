import { logError, logInfo } from '../utils/errorUtils';
import ConsumerManager from './consumers';

const consumerManager = new ConsumerManager();

export const initialize = async (): Promise<void> => {
  try {
    await consumerManager.connectAll();
    await consumerManager.startConsuming();

    logInfo('KAFKA - System initialized and consuming messages');
  } catch (error) {
    logError('KAFKA - Failed to initialize Kafka:', error);
    throw error;
  }
};

export const disconnect = async (): Promise<void> => {
  try {
    await consumerManager.disconnectAll();
    logInfo('KAFKA - System disconnected');
  } catch (error) {
    logError('KAFKA - Error disconnecting Kafka system:', error);
    throw error;
  }
};

export default {
  initialize,
  disconnect,
};
