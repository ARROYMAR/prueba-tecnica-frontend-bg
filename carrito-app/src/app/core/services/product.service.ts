import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ResultadoPaginado } from '../models/api.models';
import { Categoria, Producto, ProductoFiltro } from '../models/product.models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/products`;

  /** Las categorías casi no cambian: se piden una sola vez y se reutilizan. */
  private categories$?: Observable<Categoria[]>;

  search(filtro: ProductoFiltro): Observable<ResultadoPaginado<Producto>> {
    let params = new HttpParams().set('pagina', filtro.pagina).set('tamanoPagina', filtro.tamanoPagina);

    if (filtro.buscar?.trim()) params = params.set('buscar', filtro.buscar.trim());
    if (filtro.categoriaId != null) params = params.set('categoriaId', filtro.categoriaId);
    if (filtro.precioMin != null) params = params.set('precioMin', filtro.precioMin);
    if (filtro.precioMax != null) params = params.set('precioMax', filtro.precioMax);
    if (filtro.conStock) params = params.set('conStock', true);

    return this.http.get<ResultadoPaginado<Producto>>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
  }

  getCategories(): Observable<Categoria[]> {
    this.categories$ ??= this.http
      .get<Categoria[]>(`${environment.apiUrl}/categories`)
      .pipe(shareReplay({ bufferSize: 1, refCount: false }));
    return this.categories$;
  }
}
