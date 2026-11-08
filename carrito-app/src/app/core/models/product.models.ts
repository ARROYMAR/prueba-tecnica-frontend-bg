export interface Producto {
  id: number;
  codigo: string;
  producto: string;
  descripcion: string | null;
  categoriaId: number;
  
  /** Descripción de la categoría. */
  categoria: string;
  precio: number;
  stock: number;
  estado: boolean;
}

export interface Categoria {
  id: number;
  descripcion: string;
}

export interface ProductoFiltro {
  buscar?: string | null;
  categoriaId?: number | null;
  precioMin?: number | null;
  precioMax?: number | null;
  conStock?: boolean;
  pagina: number;
  tamanoPagina: number;
}
