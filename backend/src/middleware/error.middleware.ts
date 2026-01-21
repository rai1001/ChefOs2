import { Request, Response, NextFunction } from 'express';
import { logger } from '@/app';

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(statusCode: number, message: string, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    logger.error(err);

    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
};
