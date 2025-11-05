export const AppErrors = {
    USER_ALREADY_EXIST: { code: "USER_ALREADY_EXIST", statusCode: 409 },
    INVALID_CREDENTIALS: { code: "INVALID_CREDENTIALS", statusCode: 401 },
    USER_NOT_FOUND: { code: "USER_NOT_FOUND", statusCode: 404 },
    UNAUTHORIZED: { code: "UNAUTHORIZED", statusCode: 403 },
    VALIDATION_ERROR: { code: "VALIDATION_ERROR", statusCode: 400 },
    SERVER_ERROR: { code: "SERVER_ERROR", statusCode: 500 },
    FORBIDDEN: { code: "FORBIDDEN", statusCode: 403 },
    DROP_NOT_FOUND: { code: "DROP_NOT_FOUND", statusCode: 404 },
    ALREADY_JOINED: { code: "ALREADY_JOINED", statusCode: 409 },
    USER_NOT_JOINED_DROP: { code: "USER_NOT_JOINED_DROP", statusCode: 400 },
    DROP_NOT_YET_RELEASED: { code: "DROP_NOT_YET_RELEASED", statusCode: 400 },
    DROP_CLAIM_WINDOW_CLOSED: { code: "DROP_CLAIM_WINDOW_CLOSED", statusCode: 400 },
    DROP_ALREADY_CLAIMED: { code: "DROP_ALREADY_CLAIMED", statusCode: 400 },
    STOCK_EXHAUSTED: { code: "STOCK_EXHAUSTED", statusCode: 400 },
} as const;

export const ValidationErrors = {
    PASSWORD_MIN_6_CHAR: { code: "PASSWORD_MIN_6_CHAR", statusCode: 400 },
    PASSWORD_MAX_100_CHAR: { code: "PASSWORD_MAX_100_CHAR", statusCode: 400 },
    EMAIL_INVALID: { code: "EMAIL_INVALID", statusCode: 400 },
} as const;

export const SuccessMessages = {
    REGISTRATION_SUCCESSFUL: { code: "REGISTRATION_SUCCESSFUL", statusCode: 200 },
    DROPS_FETCHED_SUCCESSFULLY: { code: "DROPS_FETCHED_SUCCESSFULLY", statusCode: 200 },
    JOINED_DROP_SUCCESSFULLY: { code: "JOINED_DROP_SUCCESSFULLY", statusCode: 200 },
    LEFT_DROP_SUCCESSFULLY: { code: "LEFT_DROP_SUCCESSFULLY", statusCode: 200 },
    LOGIN_SUCCESSFUL: { code: "LOGIN_SUCCESSFUL", statusCode: 200 },
    DROP_CREATED_SUCCESSFULLY: { code: "DROP_CREATED_SUCCESSFULLY", statusCode: 201 },
    DROP_UPDATED_SUCCESSFULLY: { code: "DROP_UPDATED_SUCCESSFULLY", statusCode: 200 },
    DROP_DELETED_SUCCESSFULLY: { code: "DROP_DELETED_SUCCESSFULLY", statusCode: 200 },
} as const;