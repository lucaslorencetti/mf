import { PrismaClient } from '@prisma/client';
import { PrismockClient } from 'prismock';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV !== 'test' ? ['error', 'warn'] : undefined,
});

const prismock = new PrismockClient();

const prismaClient = process.env.NODE_ENV === 'test' ? prismock : prisma;

export { prismaClient as prisma };
