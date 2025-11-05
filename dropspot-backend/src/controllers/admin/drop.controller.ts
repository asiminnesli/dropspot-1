import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";
import { throwAppError } from "../../utils/throwAppError";
import { SuccessMessages, AppErrors } from "../../constants/AppErrors";
import { successResponse } from "../../utils/response";
import { th } from "zod/v4/locales";

const prisma = new PrismaClient();

const DropSchema = z.object({
    name: z.string().min(2, "İsim en az 2 karakter olmalı"),
    stock: z.number().min(0, "Stok 0'dan küçük olamaz"),
    tags: z.array(z.string()).optional(),
    mediaUrls: z.array(z.string().url()).optional(),
    claimWindowStart: z.string().datetime(),
    claimWindowEnd: z.string().datetime(),
});

export const getAllDrops = async (req: Request, res: Response) => {
    const drops = await prisma.drop.findMany({ orderBy: { createdAt: "desc" } });
    return successResponse(res, { drops }, SuccessMessages.DROPS_FETCHED_SUCCESSFULLY);
};

export const getDropById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const drop = await prisma.drop.findUnique({ where: { id } });

    if (!drop) {
        throwAppError(AppErrors.DROP_NOT_FOUND);
        return;
    }

    return successResponse(res, { drop }, SuccessMessages.DROPS_FETCHED_SUCCESSFULLY);
};

export const createDrop = async (req: Request, res: Response) => {
    const parsedData = DropSchema.parse(req.body);

    const { name, stock, tags, mediaUrls, claimWindowStart, claimWindowEnd } = parsedData;

    const drop = await prisma.drop.create({
        data: {
            name,
            stock,
            tags: tags ? tags.join("|") : null,
            mediaUrl: mediaUrls ? mediaUrls.join("|") : null,
            claimWindowStart: new Date(claimWindowStart),
            claimWindowEnd: new Date(claimWindowEnd),
        },
    });

    return successResponse(res, { drop }, SuccessMessages.DROP_CREATED_SUCCESSFULLY);
};

export const updateDrop = async (req: Request, res: Response) => {
    const { id } = req.params;

    const parsedData = DropSchema.partial().parse(req.body);

    const { name, stock, tags, mediaUrls, claimWindowStart, claimWindowEnd } = parsedData;

    const existingDrop = await prisma.drop.findUnique({ where: { id } });
    if (!existingDrop) {
        throwAppError(AppErrors.DROP_NOT_FOUND);
        return;
    }

    const drop = await prisma.drop.update({
        where: { id },
        data: {
            name,
            stock,
            tags: tags ? tags.join("|") : undefined,
            mediaUrl: mediaUrls ? mediaUrls.join("|") : undefined,
            claimWindowStart: claimWindowStart ? new Date(claimWindowStart) : undefined,
            claimWindowEnd: claimWindowEnd ? new Date(claimWindowEnd) : undefined,
        },
    });

    return successResponse(res, { drop }, SuccessMessages.DROP_UPDATED_SUCCESSFULLY);
};

export const deleteDrop = async (req: Request, res: Response) => {
    const { id } = req.params;

    const existingDrop = await prisma.drop.findUnique({ where: { id } });
    if (!existingDrop) {
        throwAppError(AppErrors.DROP_NOT_FOUND);
        return;
    }

    await prisma.drop.delete({ where: { id } });

    return successResponse(res, {}, SuccessMessages.DROP_DELETED_SUCCESSFULLY);
};