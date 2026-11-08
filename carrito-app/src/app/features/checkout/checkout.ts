import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { OrderService } from '../../core/services/order.service';
import { getErrorMessage, isInsufficientStockError } from '../../core/utils/http-error';
import { Spinner } from '../../shared/components/spinner';
import { CartSummary } from '../cart/cart-summary';

/** Resumen final antes de comprar. */
@Component({
  selector: 'app-checkout',
  imports: [CurrencyPipe, RouterLink, Spinner, CartSummary],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkout implements OnInit {
  protected readonly cartService = inject(CartService);
  private readonly orders = inject(OrderService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    // Se recarga desde el servidor para confirmar con precios y stock actualizados.
    this.cartService
      .load()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ error: (err) => this.error.set(getErrorMessage(err, 'No se pudo cargar el carrito.')) });
  }

  confirm(): void {
    this.submitting.set(true);
    this.error.set(null);

    this.orders
      .checkout()
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (order) => {
          this.notifications.success(`¡Compra realizada! Orden #${order.id}.`);
          this.router.navigate(['/orders', order.id], { queryParams: { nueva: 1 } });
        },
        error: (err) => {
          this.error.set(getErrorMessage(err, 'No se pudo completar la compra.'));
          if (isInsufficientStockError(err)) {
            // El stock cambió mientras el usuario compraba: se refresca para mostrar lo disponible.
            this.cartService.load().subscribe({ error: () => undefined });
          }
        },
      });
  }
}
