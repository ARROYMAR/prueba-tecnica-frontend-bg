import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Orden, OrdenResumen } from '../models/order.models';
import { CartService } from './cart.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly cart = inject(CartService);
  private readonly baseUrl = `${environment.apiUrl}/orders`;

  /** Finaliza la compra con el carrito actual. */
  checkout(): Observable<Orden> {
    return this.http.post<Orden>(this.baseUrl, {}).pipe(tap(() => this.cart.markAsEmpty()));
  }

  getHistory(): Observable<OrdenResumen[]> {
    return this.http.get<OrdenResumen[]>(this.baseUrl);
  }

  getById(id: number): Observable<Orden> {
    return this.http.get<Orden>(`${this.baseUrl}/${id}`);
  }
}
