const { PrismaClient } = require('@prisma/client');

// Database configuration
const databaseConfig = {
  // Log queries in development
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
  
  // Error formatting
  errorFormat: 'pretty',
};

// Create Prisma client instance
const prisma = new PrismaClient(databaseConfig);

// Connection event handlers
prisma.$on('beforeExit', async () => {
  console.log('Disconnecting from database...');
});

// Test database connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

// Graceful disconnect
async function disconnect() {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error);
  }
}

module.exports = {
  prisma,
  testConnection,
  disconnect,
};
