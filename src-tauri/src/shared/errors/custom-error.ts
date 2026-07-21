/**
 * Base custom error class for application-specific errors
 */
export class CustomError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error - when input data is invalid
 */
export class ValidationError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

/**
 * Not found error - when a resource doesn't exist
 */
export class NotFoundError extends CustomError {
  constructor(resource: string, id?: string) {
    const message = id 
      ? `${resource} with id '${id}' not found` 
      : `${resource} not found`;
    super(message, 'NOT_FOUND', 404);
  }
}

/**
 * Conflict error - when a resource already exists
 */
export class ConflictError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 'CONFLICT', 409, details);
  }
}

/**
 * Business logic error - when business rules are violated
 */
export class BusinessError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 'BUSINESS_ERROR', 422, details);
  }
}
