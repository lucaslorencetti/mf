import { OrderMessage } from '../types';
import { Kafka } from 'kafkajs';

const sampleOrders = [
  {
    order_id: '12345',
    customer_id: 'cust123',
    products: [
      { id: 'prod1', quantity: 2 },
      { id: 'prod2', quantity: 1 },
    ],
    total_amount: 35.5,
    created_at: new Date().toISOString(),
  },
  {
    order_id: '12346',
    customer_id: 'cust124',
    products: [{ id: 'prod3', quantity: 1 }],
    total_amount: 15.99,
    created_at: new Date().toISOString(),
  },
  {
    order_id: '12347',
    customer_id: 'cust125',
    products: [
      { id: 'prod1', quantity: 3 },
      { id: 'prod4', quantity: 2 },
    ],
    total_amount: 87.75,
    created_at: new Date().toISOString(),
  },
];

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'mock-producer',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
});

const producer = kafka.producer();

const sendOrder = async (order: OrderMessage) => {
  try {
    await producer.send({
      topic: process.env.KAFKA_TOPICS_ORDERS || 'orders',
      messages: [
        {
          key: order.order_id,
          value: JSON.stringify(order),
        },
      ],
    });
    console.log(`SCRIPT - Order ${order.order_id} sent successfully`);
  } catch (error) {
    console.error(`SCRIPT - Error sending order ${order.order_id}:`, error);
  }
};

const sendSampleOrders = async () => {
  try {
    await producer.connect();
    console.log('SCRIPT - Producer connected to Kafka');

    for (const order of sampleOrders) {
      await sendOrder(order);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('SCRIPT - All sample orders sent');
  } catch (error) {
    console.error('SCRIPT - Error in producer:', error);
  } finally {
    await producer.disconnect();
    console.log('SCRIPT - Producer disconnected');
  }
};

export { sendSampleOrders };
