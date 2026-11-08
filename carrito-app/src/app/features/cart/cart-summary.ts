import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Bloque de totales reutilizado en carrito, confirmación y detalle de orden. */
@Component({
  selector: 'app-cart-summary',
  imports: [CurrencyPipe, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="summary-row">
      <span>Subtotal ({{ itemCount() }} {{ itemCount() === 1 ? 'unidad' : 'unidades' }})</span>
      <span>{{ subtotal() | currency: 'USD' }}</span>
    </div>
    @if (discount() > 0) {
      <div class="summary-row discount">
        <span>Descuento ({{ discountPercent() | number: '1.0-2' }}%)</span>
        <span>-{{ discount() | currency: 'USD' }}</span>
      </div>
    }
    <div class="summary-row total">
      <span>Total</span>
      <span>{{ total() | currency: 'USD' }}</span>
    </div>
  `,
})
export class CartSummary {
  readonly itemCount = input.required<number>();
  readonly subtotal = input.required<number>();
  readonly discountPercent = input.required<number>();
  readonly discount = input.required<number>();
  readonly total = input.required<number>();
}
