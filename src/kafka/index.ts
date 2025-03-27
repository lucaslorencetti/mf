import kafkaConsumer from './consumer';

/**
 * Initializes Kafka consumer connection and starts consuming messages
 */
export const initialize = async (): Promise<void> => {
  try {
    // Connect to Kafka
    await kafkaConsumer.connect();

    // Start consuming messages
    await kafkaConsumer.consume();

    console.log('Kafka consumer initialized and consuming messages');
  } catch (error) {
    console.error('Failed to initialize Kafka:', error);
    throw error;
  }
};

/**
 * Gracefully disconnects the Kafka consumer
 */
export const disconnect = async (): Promise<void> => {
  try {
    await kafkaConsumer.disconnect();
    console.log('Kafka consumer disconnected');
  } catch (error) {
    console.error('Error disconnecting Kafka consumer:', error);
    throw error;
  }
};

export default {
  initialize,
  disconnect,
};
