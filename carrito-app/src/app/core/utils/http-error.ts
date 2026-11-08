import { HttpErrorResponse } from '@angular/common/http';

import { ProblemDetails } from '../models/api.models';

const DEFAULT_MESSAGE = 'Ocurrió un error inesperado. Intenta nuevamente.';

/** Convierte cualquier error HTTP en un mensaje claro para el usuario. */
export function getErrorMessage(error: unknown, fallback = DEFAULT_MESSAGE): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }

  if (error.status === 0) {
    return 'No se pudo conectar con el servidor. Verifica que la API esté en ejecución.';
  }

  const problem = error.error as ProblemDetails | null;

  // Errores de validación (400): se muestran los mensajes del backend.
  if (problem?.errors) {
    const messages = Object.values(problem.errors).flat();
    if (messages.length) {
      return messages.join(' ');
    }
  }

  if (problem?.detail) {
    return problem.detail;
  }

  switch (error.status) {
    case 401:
      return 'Tu sesión expiró. Inicia sesión nuevamente.';
    case 403:
      return 'No tienes permisos para realizar esta acción.';
    case 404:
      return 'El recurso solicitado no existe.';
    default:
      return fallback;
  }
}

export function isInsufficientStockError(error: unknown): boolean {
  return (
    error instanceof HttpErrorResponse &&
    error.status === 409 &&
    (error.error as ProblemDetails | null)?.codigo === 'STOCK_INSUFICIENTE'
  );
}
