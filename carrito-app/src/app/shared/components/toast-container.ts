import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-toast-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toasts" aria-live="polite">
      @for (n of notifications.items(); track n.id) {
        <div class="toast" [class]="'toast toast-' + n.type" role="status">
          <span>{{ n.message }}</span>
          <button type="button" aria-label="Cerrar" (click)="notifications.dismiss(n.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: `
    .toasts { position: fixed; right: 16px; bottom: 16px; z-index: 1000; display: grid; gap: 8px; max-width: min(380px, calc(100vw - 32px)); }
    .toast { display: flex; gap: 12px; align-items: flex-start; justify-content: space-between; padding: 12px 14px;
      border-radius: 8px; color: #fff; box-shadow: 0 6px 20px rgba(0,0,0,.15); font-size: .95rem; }
    .toast-success { background: #15803d; }
    .toast-error { background: #b91c1c; }
    .toast-info { background: #1d4ed8; }
    button { border: 0; background: none; color: inherit; font-size: 1.2rem; line-height: 1; cursor: pointer; }
  `,
})
export class ToastContainer {
  protected readonly notifications = inject(NotificationService);
}
