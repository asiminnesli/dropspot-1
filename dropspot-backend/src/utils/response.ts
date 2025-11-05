import { SuccessMessages } from "../constants/AppErrors"
export function successResponse(res: any, data: any, message: typeof SuccessMessages[keyof typeof SuccessMessages]) {
    return res.status(message.statusCode).json({
        success: true,
        message: message.code,
        data,

    });
}