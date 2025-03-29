import cors from 'cors';
import express from 'express';

import { prisma } from './db/prisma';
import jobs from './jobs';
import kafka from './kafka';
import routes from './routes';
import { logError, logInfo } from './utils/errorUtils';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', routes);

process.on('SIGINT', async () => {
  try {
    await jobs.stopAllJobs();
    await kafka.disconnect();
    await prisma.$disconnect();

    logInfo('API - Server shut down gracefully');
    process.exit(0);
  } catch (error) {
    logError('API - Error during shutdown:', error);
    process.exit(1);
  }
});

(async () => {
  try {
    await kafka.initialize();
    await jobs.initializeJobs();

    const port = Number(process.env.PORT) || 3000;
    app.listen(port, () => {
      prisma
        .$connect()
        .then(() => {
          logInfo('DB connected!');
        })
        .catch(error => logError('DB Error:', error));

      logInfo(`API - Server running on port ${port}`);
    });
  } catch (error) {
    logError('API - Failed to start the server:', error);
    process.exit(1);
  }
})();
