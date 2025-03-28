import { Consumer, Kafka } from 'kafkajs';

import { processOrder } from '../../services/orderService';
import { OrderMessage } from '../../types';

class OrderConsumer {
  private consumer: Consumer;
  private topic: string;

  constructor(kafka: Kafka) {
    this.consumer = kafka.consumer({ groupId: 'order-group' });
    this.topic = 'orders';
  }

  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      console.log('KAFKA - Order consumer connected');

      await this.consumer.subscribe({
        topic: this.topic,
        fromBeginning: false,
      });
    } catch (error) {
      console.error('KAFKA - Error connecting order consumer:', error);
      throw error;
    }
  }

  async consume(): Promise<void> {
    try {
      await this.consumer.run({
        eachMessage: async ({ message }) => {
          if (!message.value) return;

          const orderData: OrderMessage = JSON.parse(message.value.toString());
          console.log(`KAFKA - Received order: ${orderData.order_id}`);
          await processOrder(orderData);
        },
      });
    } catch (error) {
      console.error('KAFKA - Error consuming order messages:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
    console.log('KAFKA - Order consumer disconnected');
  }
}

export default OrderConsumer;
