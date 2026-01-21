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

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
