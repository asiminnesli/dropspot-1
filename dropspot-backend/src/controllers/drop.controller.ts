import { Prisma, PrismaClient } from "@prisma/client";
import * as helper from "../helper/helper";
import { Request, Response } from "express";
import { throwAppError } from "../utils/throwAppError";
import { SuccessMessages, AppErrors } from "../constants/AppErrors";
import { successResponse } from "../utils/response";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

export const getDrops = async (req: Request, res: Response) => {
    const drops = await prisma.drop.findMany({ take: 100 });
    return successResponse(res, { drops }, SuccessMessages.DROPS_FETCHED_SUCCESSFULLY);
};

export const joinDrop = async (req: Request, res: Response) => {
    const dropId = req.params.dropId;
    const userId = req.body.dropspot.user.id;

    if (!userId) { throwAppError(AppErrors.UNAUTHORIZED); return; }

    const drop = await prisma.drop.findUnique({ where: { id: dropId } });

    if (!drop) {
        throwAppError(AppErrors.DROP_NOT_FOUND);
        return;
    }

    try {
        await prisma.waitlist.create({
            data: {
                dropId,
                userId,
            },
        });
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throwAppError(AppErrors.ALREADY_JOINED);
                return;
            } else {
                throwAppError(AppErrors.SERVER_ERROR);
                return;
            }
        }

    }
    return successResponse(res, {}, SuccessMessages.JOINED_DROP_SUCCESSFULLY);
}

export const leaveDrop = async (req: Request, res: Response) => {
    const dropId = req.params.dropId;
    const userId = req.body.dropspot.user.id;

    if (!userId) { throwAppError(AppErrors.UNAUTHORIZED); return; }

    const drop = await prisma.drop.findUnique({ where: { id: dropId } });

    if (!drop) {
        throwAppError(AppErrors.DROP_NOT_FOUND);
        return;
    }

    const waitlistDelete = await prisma.waitlist.deleteMany({
        where: {
            dropId,
            userId,
        },
    });
    if (waitlistDelete.count === 0) {
        throwAppError(AppErrors.USER_NOT_JOINED_DROP);
        return;
    }

    return successResponse(res, {}, SuccessMessages.LEFT_DROP_SUCCESSFULLY);
}

export const claimDrop = async (req: Request, res: Response) => {
    const date = new Date();
    const dropId = req.params.dropId;
    const userId = req.body.dropspot.user.id;

    if (!userId) throwAppError(AppErrors.UNAUTHORIZED);

    await prisma.$transaction(async (tx) => {
        const waitListEntry = await tx.waitlist.findFirst({
            where: { dropId, userId },
            include: { drop: true },
        });
        if (!waitListEntry) { throwAppError(AppErrors.USER_NOT_JOINED_DROP); return; }

        const drop = waitListEntry.drop;
        if (drop.claimWindowStart > date) throwAppError(AppErrors.DROP_NOT_YET_RELEASED);
        if (drop.claimWindowEnd < date) throwAppError(AppErrors.DROP_CLAIM_WINDOW_CLOSED);

        const alreadyClaimed = await tx.claimsLog.findFirst({
            where: { dropId, userId },
        });
        if (alreadyClaimed) throwAppError(AppErrors.DROP_ALREADY_CLAIMED);

        const claimedCount = await tx.claimsLog.count({ where: { dropId } });
        if (claimedCount >= drop.stock) throwAppError(AppErrors.STOCK_EXHAUSTED);

        const claimCode = helper.createClaimCode();

        const claimedDrop = await tx.claimsLog.create({
            data: { dropId, userId, claimedCode: claimCode },
        });

        return successResponse(
            res,
            { claimedDropLog: claimedDrop, drop },
            SuccessMessages.LEFT_DROP_SUCCESSFULLY
        );
    });
};

export const getMyDrops = async (req: Request, res: Response) => {
    const userId = req.body.dropspot.user.id;

    if (!userId) { throwAppError(AppErrors.UNAUTHORIZED); return; }

    const myWaitlist = await prisma.waitlist.findMany({
        where: {
            userId
        },
        select: {
            dropId: true
        }

    });
    return successResponse(res, { myWaitlist: myWaitlist }, SuccessMessages.DROPS_FETCHED_SUCCESSFULLY);
}

export const getMyClaimedDrops = async (req: Request, res: Response) => {
    const userId = req.body.dropspot.user.id;

    if (!userId) { throwAppError(AppErrors.UNAUTHORIZED); return; }

    const myClaimedDrops = await prisma.claimsLog.findMany({
        where: {
            userId
        }
    });
    return successResponse(res, { myClaimedDrops: myClaimedDrops }, SuccessMessages.DROPS_FETCHED_SUCCESSFULLY);
}