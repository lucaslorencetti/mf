import OrderConsumer from './orderConsumer';
import kafka from '../config';
import { KafkaConsumer } from '../../types';

class ConsumerManager {
  private consumers: KafkaConsumer[] = [];

  constructor() {
    this.consumers.push(new OrderConsumer(kafka));
  }

  async connectAll(): Promise<void> {
    try {
      await Promise.all(this.consumers.map(consumer => consumer.connect()));
      console.log('KAFKA - All consumers connected');
    } catch (error) {
      console.error('KAFKA - Error connecting consumers:', error);
      throw error;
    }
  }

  async startConsuming(): Promise<void> {
    try {
      await Promise.all(this.consumers.map(consumer => consumer.consume()));
      console.log('KAFKA - All consumers are now consuming messages');
    } catch (error) {
      console.error('KAFKA - Error starting consumers:', error);
      throw error;
    }
  }

  async disconnectAll(): Promise<void> {
    try {
      await Promise.all(this.consumers.map(consumer => consumer.disconnect()));
      console.log('KAFKA - All consumers disconnected');
    } catch (error) {
      console.error('KAFKA - Error disconnecting consumers:', error);
      throw error;
    }
  }
}

export default ConsumerManager;
