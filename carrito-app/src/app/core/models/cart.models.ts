export interface CarritoDetalle {
  productoId: number;
  codigo: string;
  producto: string;
  categoria: string;
  precio: number;
  cantidad: number;
  stockDisponible: number;
  /** precio x cantidad */
  total: number;
  stockSuficiente: boolean;
}

export interface Carrito {
  detalles: CarritoDetalle[];
  cantidadTotal: number;
  subtotal: number;
  porcDescuento: number;
  descuento: number;
  total: number;
  tieneProblemasStock: boolean;
}

export const CARRITO_VACIO: Carrito = {
  detalles: [],
  cantidadTotal: 0,
  subtotal: 0,
  porcDescuento: 0,
  descuento: 0,
  total: 0,
  tieneProblemasStock: false,
};
