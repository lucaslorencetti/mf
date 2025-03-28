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

// function startListening(port: number) {
//   app
//     .listen(port, () => console.log(`Listening on ${port}`))
//     .on('error', (error) => {
//       console.log(error);
//       if (error.code === 'EADDRINUSE' && port < 3100) {
//         startListening(port + 1);
//       } else {
//         // Different error or no port available
//       }
//     });
// }

(async () => {
  try {
    await kafka.initialize();
    await jobs.initializeJobs();

    const port = Number(process.env.PORT) || 3000;
    // startListening(port);
    app.listen(port, () => {
      console.log(`API - Server running on port ${port}`);
    });
  } catch (error) {
    console.error('API - Failed to start the server:', error);
    process.exit(1);
  }
})();
