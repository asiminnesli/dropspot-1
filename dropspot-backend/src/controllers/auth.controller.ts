import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import { AppErrors, SuccessMessages } from "../constants/AppErrors";
import { throwAppError } from "../utils/throwAppError";
import { default as ms } from "ms";
import { successResponse } from "../utils/response";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const register = async (req: Request, res: Response) => {
    const parsedData = registerSchema.parse(req.body);
    const { email, password, fullName } = parsedData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) { throwAppError(AppErrors.USER_ALREADY_EXIST); return; }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            fullName,
            role: "USER",
        },
        select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            createdAt: true,
        }
    });

    return successResponse(res, { user }, SuccessMessages.REGISTRATION_SUCCESSFUL);
};

export const login = async (req: Request, res: Response) => {
    const parsedData = loginSchema.parse(req.body);
    const { email, password } = parsedData;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) { throwAppError(AppErrors.USER_NOT_FOUND); return; }

    const { password: userPass, ...userWithoutPassword } = user;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) { throwAppError(AppErrors.USER_NOT_FOUND); return; }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    logger.info(`Kullanıcı giriş yaptı: ${email}`);

    return successResponse(res, {
        token,
        user: userWithoutPassword
    }, SuccessMessages.LOGIN_SUCCESSFUL);
}