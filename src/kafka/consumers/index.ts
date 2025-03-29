import { KafkaConsumer } from '../../types';
import { logError, logInfo } from '../../utils/errorUtils';
import kafka from '../config';
import OrderConsumer from './orderConsumer';

class ConsumerManager {
  private consumers: KafkaConsumer[] = [];

  constructor() {
    this.consumers.push(new OrderConsumer(kafka));
  }

  async connectAll(): Promise<void> {
    try {
      await Promise.all(this.consumers.map(consumer => consumer.connect()));
      logInfo('KAFKA - All consumers connected');
    } catch (error) {
      logError('KAFKA - Error connecting consumers:', error);
      throw error;
    }
  }

  async startConsuming(): Promise<void> {
    try {
      await Promise.all(this.consumers.map(consumer => consumer.consume()));
      logInfo('KAFKA - All consumers are now consuming messages');
    } catch (error) {
      logError('KAFKA - Error starting consumers:', error);
      throw error;
    }
  }

  async disconnectAll(): Promise<void> {
    try {
      await Promise.all(this.consumers.map(consumer => consumer.disconnect()));
      logInfo('KAFKA - All consumers disconnected');
    } catch (error) {
      logError('KAFKA - Error disconnecting consumers:', error);
      throw error;
    }
  }
}

export default ConsumerManager;
