import { setupServer } from './server.js';
import { initMongoDB } from './db/initMongoConnection.js';

const bootstrap = async () => {
  try {
    await initMongoDB();
    await setupServer();
  } catch (error) {
    console.error('Failed to start the application:', error);
    process.exit(1);
  }
};

bootstrap();