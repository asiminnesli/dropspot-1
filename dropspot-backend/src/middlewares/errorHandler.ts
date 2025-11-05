import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ZodError) {
        logger.warn(`ZodError: ${err.message} - ${req.method} ${req.url}`);
        return res.status(400).json({
            success: false,
            data: JSON.parse(err.message),
            message: "Geçersiz veri girişi.",
        });
    }

    if (err instanceof AppError) {
        logger.warn(`AppError: ${err.message} - ${req.method} ${req.url}`);
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    logger.error(`Unexpected error: ${err.message} - ${req.method} ${req.url}`);
    return res.status(500).json({
        success: false,
        message: "Sunucu hatası oluştu.",
    });
};