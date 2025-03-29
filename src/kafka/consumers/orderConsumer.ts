import { Consumer, Kafka } from 'kafkajs';

import { processOrder } from '../../services/orderService';
import { OrderMessage } from '../../types';
import { logError, logInfo } from '../../utils/errorUtils';

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
      logInfo('KAFKA - Order consumer connected');

      await this.consumer.subscribe({
        topic: this.topic,
        fromBeginning: false,
      });
    } catch (error) {
      logError('KAFKA - Error connecting order consumer:', error);
      throw error;
    }
  }

  async consume(): Promise<void> {
    try {
      await this.consumer.run({
        eachMessage: async ({ message }) => {
          if (!message.value) return;

          const orderData: OrderMessage = JSON.parse(message.value.toString());
          logInfo(`KAFKA - Received order: ${orderData.order_id}`);
          await processOrder(orderData);
        },
      });
    } catch (error) {
      logError('KAFKA - Error consuming order messages:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
    logInfo('KAFKA - Order consumer disconnected');
  }
}

export default OrderConsumer;
