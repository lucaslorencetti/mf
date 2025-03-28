import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'mf-api-' + crypto.randomUUID(),
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
});

export default kafka;
