import KafkaConsumer from './consumer';

const consumer = new KafkaConsumer();
/**
 * Initializes Kafka consumer connection and starts consuming messages
 */
export const initialize = async (): Promise<void> => {
  try {
    // Connect to Kafka
    await consumer.connect();

    // Start consuming messages
    await consumer.consume();

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
    await consumer.disconnect();
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
