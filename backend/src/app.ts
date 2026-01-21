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
import productFamiliesRouter from '@/routes/product-family.routes';
import ingredientRouter from '@/routes/ingredient.routes';
import unitRouter from '@/routes/unit.routes';
import { errorHandler } from '@/middleware/error.middleware';

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/product-families', productFamiliesRouter);
app.use('/api/v1/ingredients', ingredientRouter);
app.use('/api/v1/units', unitRouter);

// Error handling
app.use(errorHandler);


export default app;
