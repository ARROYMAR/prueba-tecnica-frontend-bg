import { Component, inject } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';

/**
 * Pantalla temporal: solo sirve para comprobar que el login y el guard funcionan.
 * Se reemplaza en el siguiente paso por el listado real de productos.
 */
@Component({
  selector: 'app-products',
  template: `
    <main style="padding: 24px; font-family: system-ui, sans-serif">
      <h1>Productos</h1>
      <p>Sesión iniciada como <strong>{{ auth.session()?.nombre }}</strong> ({{ auth.session()?.rol }}).</p>
      <button type="button" (click)="auth.logout()">Cerrar sesión</button>
    </main>
  `,
})
export class Products {
  protected readonly auth = inject(AuthService);
}
