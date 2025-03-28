import express from 'express';
import cors from 'cors';
import routes from './routes';
import kafka from './kafka';
import jobs from './jobs';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', routes);

process.on('SIGINT', async () => {
  try {
    await jobs.stopAllJobs();
    await kafka.disconnect();

    console.log('API - Server shut down gracefully');
    process.exit(0);
  } catch (error) {
    console.error('API - Error during shutdown:', error);
    process.exit(1);
  }
});

(async () => {
  try {
    await kafka.initialize();
    await jobs.initializeJobs();

    const port = Number(process.env.PORT) || 3000;
    app.listen(port, () => {
      console.log(`API - Server running on port ${port}`);
    });
  } catch (error) {
    console.error('API - Failed to start the server:', error);
    process.exit(1);
  }
})();
