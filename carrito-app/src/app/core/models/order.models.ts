export interface OrdenResumen {
  id: number;
  ordenCreacion: string;
  cantidadTotal: number;
  subtotal: number;
  porcDescuento: number;
  descuento: number;
  total: number;
}

export interface OrdenDetalle {
  productoId: number;
  productoCodigo: string;
  productoNombre: string;
  precio: number;
  cantidad: number;
  total: number;
}

export interface Orden extends OrdenResumen {
  detalles: OrdenDetalle[];
}
