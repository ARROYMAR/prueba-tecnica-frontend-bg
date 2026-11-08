import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, numberAttribute, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Orden } from '../../../core/models/order.models';
import { OrderService } from '../../../core/services/order.service';
import { getErrorMessage } from '../../../core/utils/http-error';
import { Spinner } from '../../../shared/components/spinner';
import { CartSummary } from '../../cart/cart-summary';

@Component({
  selector: 'app-order-detail',
  imports: [CurrencyPipe, DatePipe, RouterLink, Spinner, CartSummary],
  templateUrl: './order-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetail implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly route = inject(ActivatedRoute);

  readonly order = signal<Orden | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  /** Viene de checkout: se muestra el mensaje de compra exitosa. */
  readonly isNew = signal(false);

  ngOnInit(): void {
    const id = numberAttribute(this.route.snapshot.paramMap.get('id'), 0);
    this.isNew.set(this.route.snapshot.queryParamMap.has('nueva'));

    this.orderService
      .getById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (order) => this.order.set(order),
        error: (err) => this.error.set(getErrorMessage(err, 'No se pudo cargar la orden.')),
      });
  }
}
