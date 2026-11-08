import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../core/services/auth.service';
import { CartService } from '../core/services/cart.service';

/** Estructura de las páginas internas: menú superior + contenido. */
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout implements OnInit {
  protected readonly auth = inject(AuthService);
  protected readonly cart = inject(CartService);

  ngOnInit(): void {
    // Carga el carrito para mostrar el contador en el menú.
    // Si falla no se interrumpe la navegación: el carrito se reintenta al abrir su página.
    this.cart.load().subscribe({ error: () => undefined });
  }
}
