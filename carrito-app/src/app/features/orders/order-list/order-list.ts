import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { OrdenResumen } from '../../../core/models/order.models';
import { OrderService } from '../../../core/services/order.service';
import { getErrorMessage } from '../../../core/utils/http-error';
import { Spinner } from '../../../shared/components/spinner';

@Component({
  selector: 'app-order-list',
  imports: [CurrencyPipe, DatePipe, RouterLink, Spinner],
  templateUrl: './order-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderList implements OnInit {
  private readonly orderService = inject(OrderService);

  readonly orders = signal<OrdenResumen[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.orderService
      .getHistory()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (orders) => this.orders.set(orders),
        error: (err) => this.error.set(getErrorMessage(err, 'No se pudo cargar el historial.')),
      });
  }
}
