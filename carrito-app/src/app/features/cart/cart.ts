import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, finalize } from 'rxjs';

import { CarritoDetalle } from '../../core/models/cart.models';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { getErrorMessage } from '../../core/utils/http-error';
import { Spinner } from '../../shared/components/spinner';
import { CartSummary } from './cart-summary';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink, Spinner, CartSummary],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart implements OnInit {
  protected readonly cartService = inject(CartService);
  private readonly notifications = inject(NotificationService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  /** true mientras se espera respuesta de una modificación (evita clics dobles). */
  readonly busy = signal(false);

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.error.set(null);
    this.cartService
      .load()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ error: (err) => this.error.set(getErrorMessage(err, 'No se pudo cargar el carrito.')) });
  }

  increase(item: CarritoDetalle): void {
    if (item.cantidad >= item.stockDisponible) {
      this.notifications.error(`Stock insuficiente: solo hay ${item.stockDisponible} unidad(es) de "${item.producto}".`);
      return;
    }
    this.run(this.cartService.updateQuantity(item.productoId, item.cantidad + 1));
  }

  decrease(item: CarritoDetalle): void {
    if (item.cantidad <= 1) {
      this.remove(item);
      return;
    }
    this.run(this.cartService.updateQuantity(item.productoId, item.cantidad - 1));
  }

  /** Corrige la cantidad al máximo disponible cuando el stock bajó. */
  fitToStock(item: CarritoDetalle): void {
    if (item.stockDisponible <= 0) {
      this.remove(item);
    } else {
      this.run(this.cartService.updateQuantity(item.productoId, item.stockDisponible));
    }
  }

  remove(item: CarritoDetalle): void {
    this.run(this.cartService.remove(item.productoId), `"${item.producto}" se quitó del carrito.`);
  }

  clear(): void {
    if (!confirm('¿Vaciar el carrito? Se quitarán todos los productos.')) return;
    this.run(this.cartService.clear(), 'Carrito vaciado.');
  }

  private run(request: Observable<unknown>, successMessage?: string): void {
    this.busy.set(true);
    request.pipe(finalize(() => this.busy.set(false))).subscribe({
      next: () => successMessage && this.notifications.info(successMessage),
      error: (err) => {
        this.notifications.error(getErrorMessage(err));
        this.cartService.load().subscribe({ error: () => undefined }); // re-sincroniza con el servidor
      },
    });
  }
}
