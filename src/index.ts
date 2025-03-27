import express from 'express';
import cors from 'cors';
import config from './config';
import routes from './routes';
import kafka from './kafka';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', routes);

// Start the server
const startServer = async () => {
  try {
    // Initialize Kafka
    await kafka.initialize();
    
    // Start the Express server
    app.listen(config.api.port, () => {
      console.log(`Server running on port ${config.api.port}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  try {
    await kafka.disconnect();
    console.log('Server shut down gracefully');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

startServer();
