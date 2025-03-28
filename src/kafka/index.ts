import KafkaConsumer from './consumer';

const consumer = new KafkaConsumer();
export const initialize = async (): Promise<void> => {
  try {
    await consumer.connect();

    await consumer.consume();

    console.log('KAFKA - Consumer initialized and consuming messages');
  } catch (error) {
    console.error('KAFKA - Failed to initialize Kafka:', error);
    throw error;
  }
};

export const disconnect = async (): Promise<void> => {
  try {
    await consumer.disconnect();
    console.log('KAFKA - Consumer disconnected');
  } catch (error) {
    console.error('KAFKA - Error disconnecting Kafka consumer:', error);
    throw error;
  }
};

export default {
  initialize,
  disconnect,
};
