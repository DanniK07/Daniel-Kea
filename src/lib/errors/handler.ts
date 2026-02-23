/**
 * Manejo centralizado de errores.
 * Proporciona respuestas consistentes y seguras sin exponer detalles internos.
 */

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: unknown) {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "No autorizado") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Acceso denegado") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Recurso no encontrado") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

/**
 * Convierte un error desconocido en una respuesta segura.
 * En producción, no expone detalles internos.
 */
export function handleError(error: unknown): {
  message: string;
  statusCode: number;
  code?: string;
  details?: unknown;
} {
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
      ...(error instanceof ValidationError && error.details
        ? { details: error.details }
        : {}),
    };
  }

  if (error instanceof Error) {
    // En desarrollo, mostrar el mensaje real
    if (process.env.NODE_ENV === "development") {
      return {
        message: error.message,
        statusCode: 500,
        code: "INTERNAL_ERROR",
      };
    }
  }

  // En producción, mensaje genérico
  return {
    message: "Ha ocurrido un error. Por favor, inténtalo de nuevo.",
    statusCode: 500,
    code: "INTERNAL_ERROR",
  };
}
