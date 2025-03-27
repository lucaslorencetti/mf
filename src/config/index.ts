export default {
  kafka: {
    clientId: 'orders-api',
    brokers: ['localhost:9092'],
    groupId: 'orders-consumer-group',
    topics: {
      orders: 'orders',
    },
  },
  api: {
    port: 3000,
  },
};
