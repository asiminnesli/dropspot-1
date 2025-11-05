import { AppError } from "./AppError";

export const throwAppError = (errObj: { code: string; statusCode: number }): never => {
    throw new AppError(errObj.code, errObj.statusCode);
};