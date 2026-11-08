import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  BehaviorSubject,
  EMPTY,
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  tap,
} from 'rxjs';

import { ResultadoPaginado } from '../../../core/models/api.models';
import { Categoria, Producto, ProductoFiltro } from '../../../core/models/product.models';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProductService } from '../../../core/services/product.service';
import { getErrorMessage } from '../../../core/utils/http-error';
import { Spinner } from '../../../shared/components/spinner';

const PAGE_SIZE = 12;

@Component({
  selector: 'app-product-list',
  imports: [ReactiveFormsModule, CurrencyPipe, RouterLink, Spinner],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly notifications = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly cart = inject(CartService);

  readonly filters = this.fb.group({
    buscar: [''],
    categoriaId: [null as number | null],
    precioMin: [null as number | null],
    precioMax: [null as number | null],
    conStock: [false],
  });

  readonly categories = signal<Categoria[]>([]);
  readonly result = signal<ResultadoPaginado<Producto> | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  /** Ids de productos que se están agregando (para deshabilitar su botón). */
  readonly adding = signal<ReadonlySet<number>>(new Set());

  private readonly query$ = new BehaviorSubject<ProductoFiltro>({ pagina: 1, tamanoPagina: PAGE_SIZE });

  ngOnInit(): void {
    this.productService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (c) => this.categories.set(c),
        error: () => this.notifications.error('No se pudieron cargar las categorías.'),
      });

    // Cada cambio en los filtros vuelve a la página 1.
    this.filters.valueChanges
      .pipe(
        debounceTime(350),
        map((f) => ({
          buscar: f.buscar ?? '',
          categoriaId: f.categoriaId ?? null,
          precioMin: f.precioMin ?? null,
          precioMax: f.precioMax ?? null,
          conStock: !!f.conStock,
        })),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((f) => this.query$.next({ ...f, pagina: 1, tamanoPagina: PAGE_SIZE }));

    // switchMap cancela la búsqueda anterior si el usuario sigue escribiendo.
    this.query$
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap((q) =>
          this.productService.search(q).pipe(
            catchError((err) => {
              this.error.set(getErrorMessage(err, 'No se pudieron cargar los productos.'));
              this.loading.set(false);
              return EMPTY;
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res) => {
        this.result.set(res);
        this.loading.set(false);
      });
  }

  goToPage(page: number): void {
    this.query$.next({ ...this.query$.value, pagina: page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  retry(): void {
    this.query$.next({ ...this.query$.value });
  }

  clearFilters(): void {
    this.filters.reset({ buscar: '', categoriaId: null, precioMin: null, precioMax: null, conStock: false });
  }

  /** Unidades que todavía se pueden agregar (stock menos lo que ya está en el carrito). */
  remaining(product: Producto): number {
    return Math.max(product.stock - (this.cart.quantities().get(product.id) ?? 0), 0);
  }

  addToCart(product: Producto, rawQuantity: string): void {
    const quantity = Number(rawQuantity);
    const max = this.remaining(product);

    if (!Number.isInteger(quantity) || quantity < 1) {
      this.notifications.error('La cantidad debe ser un número entero mayor a 0.');
      return;
    }
    if (quantity > max) {
      this.notifications.error(
        max === 0
          ? `Ya tienes en el carrito todo el stock disponible de "${product.producto}".`
          : `Stock insuficiente: solo puedes agregar ${max} unidad(es) más de "${product.producto}".`
      );
      return;
    }

    this.setAdding(product.id, true);
    this.cart
      .add(product.id, quantity)
      .pipe(finalize(() => this.setAdding(product.id, false)))
      .subscribe({
        next: () => this.notifications.success(`"${product.producto}" agregado al carrito (${quantity}).`),
        error: (err) => {
          this.notifications.error(getErrorMessage(err));
          this.retry(); // refresca el stock mostrado
        },
      });
  }

  private setAdding(id: number, value: boolean): void {
    this.adding.update((set) => {
      const next = new Set(set);
      if (value) next.add(id);
      else next.delete(id);
      return next;
    });
  }
}
