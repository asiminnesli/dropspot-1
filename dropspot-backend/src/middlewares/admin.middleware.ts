import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { throwAppError } from "../utils/throwAppError";
import { AppErrors } from "../constants/AppErrors";
import { prisma, prismaType } from "../db";

export const adminMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throwAppError(AppErrors.UNAUTHORIZED);
        return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string; };

    req.body = req.body ? { ...req.body } : {};
    req.body.dropspot = req.body.dropspot ? { ...req.body.dropspot, user: decoded } : { user: decoded };

    if (decoded.role != "ADMIN") {
        throwAppError(AppErrors.FORBIDDEN);
    }
    next();
};