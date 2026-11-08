import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CARRITO_VACIO, Carrito } from '../models/cart.models';
import { AuthService } from './auth.service';

/**
 * Estado del carrito compartido por toda la app (contador del menú, productos, carrito, checkout).
 * Los cálculos (subtotal, descuento, total) los hace el backend; aquí solo se guarda la respuesta.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}/cart`;

  private readonly _cart = signal<Carrito>(CARRITO_VACIO);

  readonly cart = this._cart.asReadonly();
  readonly itemCount = computed(() => this._cart().cantidadTotal);
  readonly isEmpty = computed(() => this._cart().detalles.length === 0);

  /** Cantidad de cada producto en el carrito: { productId: cantidad }. */
  readonly quantities = computed(() => {
    const result = new Map<number, number>();
    for (const d of this._cart().detalles) result.set(d.productoId, d.cantidad);
    return result;
  });

  constructor() {
    // Al cerrar sesión se limpia el carrito en memoria.
    effect(() => {
      if (!this.auth.isLoggedIn()) {
        this._cart.set(CARRITO_VACIO);
      }
    });
  }

  load(): Observable<Carrito> {
    return this.http.get<Carrito>(this.baseUrl).pipe(tap((cart) => this._cart.set(cart)));
  }

  add(productId: number, quantity: number): Observable<Carrito> {
    return this.http
      .post<Carrito>(`${this.baseUrl}/items`, { productoId: productId, cantidad: quantity })
      .pipe(tap((cart) => this._cart.set(cart)));
  }

  updateQuantity(productId: number, quantity: number): Observable<Carrito> {
    return this.http
      .put<Carrito>(`${this.baseUrl}/items/${productId}`, { cantidad: quantity })
      .pipe(tap((cart) => this._cart.set(cart)));
  }

  remove(productId: number): Observable<Carrito> {
    return this.http
      .delete<Carrito>(`${this.baseUrl}/items/${productId}`)
      .pipe(tap((cart) => this._cart.set(cart)));
  }

  clear(): Observable<void> {
    return this.http.delete<void>(this.baseUrl).pipe(
      tap(() => this._cart.set(CARRITO_VACIO)),
      map(() => undefined)
    );
  }

  /** El backend vacía el carrito al comprar; aquí solo se refleja en memoria. */
  markAsEmpty(): void {
    this._cart.set(CARRITO_VACIO);
  }
}
