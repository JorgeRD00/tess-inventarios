import { PrismaClient } from '@prisma/client';

/**
 * Singleton instance of PrismaClient
 * Ensures only one database connection is used throughout the application
 */
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

export default prisma;

/**
 * Graceful shutdown handler
 * Disconnects from database when application exits
 */
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
