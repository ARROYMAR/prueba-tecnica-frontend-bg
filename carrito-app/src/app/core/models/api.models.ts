export interface ResultadoPaginado<T> {
  items: T[];
  pagina: number;
  tamanoPagina: number;
  totalRegistros: number;
  totalPaginas: number;
}

export interface ProblemDetails {
  status?: number;
  title?: string;
  detail?: string;
  /** "STOCK_INSUFICIENTE" cuando falta stock. */
  codigo?: string;
  stockDisponible?: number;
  /** Errores de validación: { campo: [mensajes] } */
  errors?: Record<string, string[]>;
}
