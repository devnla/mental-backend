<?php

namespace App\Traits;

use App\Enums\ApiErrorCode;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;

trait ApiResponse
{
    /**
     * Return a success JSON response
     */
    protected function successResponse(
        mixed $data = null,
        string $message = 'Success',
        int $statusCode = 200
    ): JsonResponse {
        $response = [
            'success' => true,
            'message' => $message,
        ];

        if ($data !== null) {
            $response['data'] = $data;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Return an error JSON response
     */
    protected function errorResponse(
        string $message,
        ApiErrorCode $errorCode = ApiErrorCode::OPERATION_FAILED,
        mixed $errors = null,
        ?int $statusCode = null
    ): JsonResponse {
        $statusCode = $statusCode ?? $errorCode->httpStatus();

        $response = [
            'success' => false,
            'message' => $message,
            'error_code' => $errorCode->value,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Return a validation error response
     */
    protected function validationErrorResponse(
        array|Collection $errors,
        string $message = 'Validation failed',
        ApiErrorCode $errorCode = ApiErrorCode::VALIDATION_ERROR
    ): JsonResponse {
        return $this->errorResponse(
            message: $message,
            errorCode: $errorCode,
            errors: $errors,
            statusCode: 422
        );
    }

    /**
     * Return a resource created response
     */
    protected function createdResponse(
        mixed $data = null,
        string $message = 'Resource created successfully'
    ): JsonResponse {
        return $this->successResponse($data, $message, 201);
    }

    /**
     * Return a resource updated response
     */
    protected function updatedResponse(
        mixed $data = null,
        string $message = 'Resource updated successfully'
    ): JsonResponse {
        return $this->successResponse($data, $message, 200);
    }

    /**
     * Return a resource deleted response
     */
    protected function deletedResponse(
        string $message = 'Resource deleted successfully'
    ): JsonResponse {
        return $this->successResponse(null, $message, 200);
    }

    /**
     * Return a not found response
     */
    protected function notFoundResponse(
        string $message = 'Resource not found',
        ApiErrorCode $errorCode = ApiErrorCode::RESOURCE_NOT_FOUND
    ): JsonResponse {
        return $this->errorResponse($message, $errorCode, null, 404);
    }

    /**
     * Return an unauthorized response
     */
    protected function unauthorizedResponse(
        string $message = 'Unauthorized',
        ApiErrorCode $errorCode = ApiErrorCode::UNAUTHORIZED
    ): JsonResponse {
        return $this->errorResponse($message, $errorCode, null, 403);
    }

    /**
     * Return an unauthenticated response
     */
    protected function unauthenticatedResponse(
        string $message = 'Unauthenticated',
        ApiErrorCode $errorCode = ApiErrorCode::UNAUTHENTICATED
    ): JsonResponse {
        return $this->errorResponse($message, $errorCode, null, 401);
    }

    /**
     * Return a paginated response
     */
    protected function paginatedResponse(
        mixed $paginator,
        string $message = 'Success'
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $paginator->items(),
            'pagination' => [
                'total' => $paginator->total(),
                'per_page' => $paginator->perPage(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
        ], 200);
    }
}
