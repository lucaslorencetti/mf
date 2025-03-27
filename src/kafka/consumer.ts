import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface OrderMessage {
  order_id: string;
  customer_id: string;
  products: {
    id: string;
    quantity: number;
  }[];
  total_amount: number;
  created_at: string;
}

export class KafkaConsumer {
  private consumer: Consumer;

  constructor() {
    const kafka = new Kafka({
      clientId: 'order-consumer-' + crypto.randomUUID(),
      brokers: [process.env.KAFKA_BOOTSTRAP_SERVERS || 'localhost:9092'],
    });

    this.consumer = kafka.consumer({
      groupId: process.env.KAFKA_GROUP_ID || 'orders-consumer-group',
    });
  }

  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      console.log('Kafka consumer connected');

      await this.consumer.subscribe({
        topic: process.env.KAFKA_TOPICS || 'orders',
        fromBeginning: true,
      });
    } catch (error) {
      console.error('Error connecting to Kafka:', error);
      throw error;
    }
  }

  async consume(): Promise<void> {
    try {
      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          const { message } = payload;
          if (message.value) {
            const orderData: OrderMessage = JSON.parse(
              message.value.toString(),
            );
            await this.processOrder(orderData);
          }
        },
      });
    } catch (error) {
      console.error('Error consuming Kafka messages:', error);
      throw error;
    }
  }

  private async processOrder(orderData: OrderMessage): Promise<void> {
    try {
      console.log(`Processing order: ${orderData.order_id}`);

      // Create the order in the database
      await prisma.order.create({
        data: {
          id: orderData.order_id,
          customerId: orderData.customer_id,
          totalAmount: orderData.total_amount,
          createdAt: new Date(orderData.created_at),
          products: {
            create: orderData.products.map(product => ({
              productId: product.id,
              quantity: product.quantity,
            })),
          },
        },
      });

      // Update product stock (if needed)
      for (const product of orderData.products) {
        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
          where: { id: product.id },
        });

        if (existingProduct) {
          // Update stock
          await prisma.product.update({
            where: { id: product.id },
            data: { stock: existingProduct.stock - product.quantity },
          });
        } else {
          // Create product with default values if it doesn't exist
          await prisma.product.create({
            data: {
              id: product.id,
              name: `Product ${product.id}`, // Default name
              price: 0, // Default price
              stock: 100 - product.quantity, // Default stock minus ordered quantity
            },
          });
        }
      }

      console.log(`Order ${orderData.order_id} processed successfully`);
    } catch (error) {
      console.error(`Error processing order ${orderData.order_id}:`, error);
    }
  }

  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
    console.log('Kafka consumer disconnected');
  }
}

export default KafkaConsumer;
