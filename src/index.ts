import express from 'express';
import cors from 'cors';
import routes from './routes';
import kafka from './kafka';
import jobs from './jobs';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', routes);

// Handle graceful shutdown
process.on('SIGINT', async () => {
  try {
    // Stop all scheduled jobs
    await jobs.stopAllJobs();

    // Disconnect Kafka
    await kafka.disconnect();

    console.log('Server shut down gracefully');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
(async () => {
  try {
    // Initialize Kafka
    await kafka.initialize();

    // Initialize all scheduled jobs
    await jobs.initializeJobs();

    // Start the Express server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
})();
