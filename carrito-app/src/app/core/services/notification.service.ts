import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
}

/** Mensajes tipo "toast" que desaparecen solos. */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 1;
  private readonly _items = signal<Notification[]>([]);
  readonly items = this._items.asReadonly();

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message, 6000);
  }

  info(message: string): void {
    this.show('info', message);
  }

  dismiss(id: number): void {
    this._items.update((list) => list.filter((n) => n.id !== id));
  }

  private show(type: NotificationType, message: string, durationMs = 3500): void {
    const id = this.nextId++;
    this._items.update((list) => [...list, { id, type, message }]);
    setTimeout(() => this.dismiss(id), durationMs);
  }
}
