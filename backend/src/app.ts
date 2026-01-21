import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pino } from 'pino';

const app = express();
export const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: { colorize: true }
    }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

import authRoutes from '@/routes/auth.routes';
import { errorHandler } from '@/middleware/error.middleware';

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);

// Error handling
app.use(errorHandler);


export default app;
