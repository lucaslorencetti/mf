import ConsumerManager from './consumers';

const consumerManager = new ConsumerManager();

export const initialize = async (): Promise<void> => {
  try {
    await consumerManager.connectAll();
    await consumerManager.startConsuming();

    console.log('KAFKA - System initialized and consuming messages');
  } catch (error) {
    console.error('KAFKA - Failed to initialize Kafka:', error);
    throw error;
  }
};

export const disconnect = async (): Promise<void> => {
  try {
    await consumerManager.disconnectAll();
    console.log('KAFKA - System disconnected');
  } catch (error) {
    console.error('KAFKA - Error disconnecting Kafka system:', error);
    throw error;
  }
};

export default {
  initialize,
  disconnect,
};
