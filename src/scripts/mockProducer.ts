import { OrderMessage } from '../types';
import { Kafka } from 'kafkajs';

// Sample order data
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

// Create Kafka producer
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'mock-producer',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
});

const producer = kafka.producer();

// Function to send a single order message
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
    console.log(`Order ${order.order_id} sent successfully`);
  } catch (error) {
    console.error(`Error sending order ${order.order_id}:`, error);
  }
};

// Main function to send all sample orders
const sendSampleOrders = async () => {
  try {
    await producer.connect();
    console.log('Producer connected to Kafka');

    // Send each order with a delay
    for (const order of sampleOrders) {
      await sendOrder(order);
      // Wait 1 second between messages
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('All sample orders sent');
  } catch (error) {
    console.error('Error in producer:', error);
  } finally {
    await producer.disconnect();
    console.log('Producer disconnected');
  }
};

// Run the producer if this file is executed directly
if (require.main === module) {
  sendSampleOrders()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { sendSampleOrders };
