import { Kafka, Consumer } from 'kafkajs';
import { OrderMessage } from '../types';
import { processOrder } from '../services/orderService';

export class KafkaConsumer {
  private consumer: Consumer;

  constructor() {
    const kafka = new Kafka({
      clientId: 'order-consumer-' + crypto.randomUUID(),
      brokers: [process.env.KAFKA_BOOTSTRAP_SERVERS || 'localhost:9092'],
    });

    this.consumer = kafka.consumer({ groupId: 'order-group' });
  }

  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      console.log('KAFKA - Consumer connected');

      await this.consumer.subscribe({
        topic: process.env.KAFKA_TOPICS || 'orders',
        fromBeginning: false,
      });
    } catch (error) {
      console.error('KAFKA - Error connecting to Kafka:', error);
      throw error;
    }
  }

  async consume(): Promise<void> {
    try {
      await this.consumer.run({
        eachMessage: async ({ message }) => {
          if (!message.value) return;

          const orderData: OrderMessage = JSON.parse(message.value.toString());
          await processOrder(orderData);
        },
      });
    } catch (error) {
      console.error('KAFKA - Error consuming Kafka messages:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
    console.log('KAFKA - Kafka consumer disconnected');
  }
}

export default KafkaConsumer;
