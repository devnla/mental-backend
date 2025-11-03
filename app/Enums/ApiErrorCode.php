<?php

namespace App\Enums;

enum ApiErrorCode: int
{
    // Authentication & Authorization (1000-1999)
    case UNAUTHENTICATED = 1001;
    case INVALID_CREDENTIALS = 1002;
    case TOKEN_EXPIRED = 1003;
    case TOKEN_INVALID = 1004;
    case UNAUTHORIZED = 1005;
    case ACCESS_DENIED = 1006;
    case ADMIN_API_ACCESS_DENIED = 1007;
    case EMAIL_NOT_VERIFIED = 1008;

    // Validation Errors (2000-2999)
    case VALIDATION_ERROR = 2001;
    case INVALID_INPUT = 2002;
    case MISSING_REQUIRED_FIELD = 2003;
    case INVALID_EMAIL_FORMAT = 2004;
    case PASSWORD_TOO_SHORT = 2005;
    case PASSWORDS_DO_NOT_MATCH = 2006;

    // Resource Errors (3000-3999)
    case RESOURCE_NOT_FOUND = 3001;
    case USER_NOT_FOUND = 3002;
    case COACH_NOT_FOUND = 3003;
    case RESOURCE_ALREADY_EXISTS = 3004;
    case EMAIL_ALREADY_TAKEN = 3005;

    // Business Logic Errors (4000-4999)
    case OPERATION_FAILED = 4001;
    case INSUFFICIENT_PERMISSIONS = 4002;
    case ACCOUNT_DISABLED = 4003;
    case ACCOUNT_SUSPENDED = 4004;
    case RATE_LIMIT_EXCEEDED = 4005;

    // Server Errors (5000-5999)
    case INTERNAL_SERVER_ERROR = 5001;
    case SERVICE_UNAVAILABLE = 5002;
    case DATABASE_ERROR = 5003;
    case EXTERNAL_API_ERROR = 5004;

    /**
     * Get a human-readable message for the error code
     */
    public function message(): string
    {
        return match ($this) {
            // Authentication & Authorization
            self::UNAUTHENTICATED => 'You are not authenticated. Please login.',
            self::INVALID_CREDENTIALS => 'The provided credentials are incorrect.',
            self::TOKEN_EXPIRED => 'Your session has expired. Please login again.',
            self::TOKEN_INVALID => 'Invalid authentication token.',
            self::UNAUTHORIZED => 'You are not authorized to perform this action.',
            self::ACCESS_DENIED => 'Access denied.',
            self::ADMIN_API_ACCESS_DENIED => 'Admin users cannot access the API.',
            self::EMAIL_NOT_VERIFIED => 'Please verify your email address.',

            // Validation Errors
            self::VALIDATION_ERROR => 'The given data was invalid.',
            self::INVALID_INPUT => 'Invalid input provided.',
            self::MISSING_REQUIRED_FIELD => 'Required field is missing.',
            self::INVALID_EMAIL_FORMAT => 'Invalid email format.',
            self::PASSWORD_TOO_SHORT => 'Password must be at least 8 characters.',
            self::PASSWORDS_DO_NOT_MATCH => 'Password confirmation does not match.',

            // Resource Errors
            self::RESOURCE_NOT_FOUND => 'The requested resource was not found.',
            self::USER_NOT_FOUND => 'User not found.',
            self::COACH_NOT_FOUND => 'Coach not found.',
            self::RESOURCE_ALREADY_EXISTS => 'Resource already exists.',
            self::EMAIL_ALREADY_TAKEN => 'This email is already registered.',

            // Business Logic Errors
            self::OPERATION_FAILED => 'Operation failed. Please try again.',
            self::INSUFFICIENT_PERMISSIONS => 'You do not have sufficient permissions.',
            self::ACCOUNT_DISABLED => 'Your account has been disabled.',
            self::ACCOUNT_SUSPENDED => 'Your account has been suspended.',
            self::RATE_LIMIT_EXCEEDED => 'Too many requests. Please try again later.',

            // Server Errors
            self::INTERNAL_SERVER_ERROR => 'An internal server error occurred.',
            self::SERVICE_UNAVAILABLE => 'Service temporarily unavailable.',
            self::DATABASE_ERROR => 'Database error occurred.',
            self::EXTERNAL_API_ERROR => 'External service error.',
        };
    }

    /**
     * Get HTTP status code for the error
     */
    public function httpStatus(): int
    {
        return match ($this) {
            // 401 Unauthorized
            self::UNAUTHENTICATED,
            self::INVALID_CREDENTIALS,
            self::TOKEN_EXPIRED,
            self::TOKEN_INVALID => 401,

            // 403 Forbidden
            self::UNAUTHORIZED,
            self::ACCESS_DENIED,
            self::ADMIN_API_ACCESS_DENIED,
            self::INSUFFICIENT_PERMISSIONS,
            self::ACCOUNT_DISABLED,
            self::ACCOUNT_SUSPENDED => 403,

            // 404 Not Found
            self::RESOURCE_NOT_FOUND,
            self::USER_NOT_FOUND,
            self::COACH_NOT_FOUND => 404,

            // 409 Conflict
            self::RESOURCE_ALREADY_EXISTS,
            self::EMAIL_ALREADY_TAKEN => 409,

            // 422 Unprocessable Entity
            self::VALIDATION_ERROR,
            self::INVALID_INPUT,
            self::MISSING_REQUIRED_FIELD,
            self::INVALID_EMAIL_FORMAT,
            self::PASSWORD_TOO_SHORT,
            self::PASSWORDS_DO_NOT_MATCH,
            self::EMAIL_NOT_VERIFIED => 422,

            // 429 Too Many Requests
            self::RATE_LIMIT_EXCEEDED => 429,

            // 500 Internal Server Error
            self::INTERNAL_SERVER_ERROR,
            self::DATABASE_ERROR => 500,

            // 503 Service Unavailable
            self::SERVICE_UNAVAILABLE,
            self::EXTERNAL_API_ERROR => 503,

            // 400 Bad Request (default)
            default => 400,
        };
    }
}
