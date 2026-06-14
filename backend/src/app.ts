import express, { Express } from 'express';
import cors from 'cors';
import authRoutes from './auth/routes/auth.routes';
import errorMiddleware from './middleware/error.middleware';
import { environment } from './config/environment';
import LoggerUtil from './utilities/logger.util';

const app: Express = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(
  cors({
    origin: environment.FRONTEND_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorMiddleware);

export default app;