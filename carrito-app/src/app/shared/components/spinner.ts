import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="spinner-wrap" role="status"><span class="spinner"></span><span>{{ text() }}</span></div>`,
  styles: `
    .spinner-wrap { display: flex; gap: 10px; align-items: center; justify-content: center; padding: 40px 0; color: #6b7280; }
    .spinner { width: 22px; height: 22px; border: 3px solid #d1d5db; border-top-color: #2563eb; border-radius: 50%;
      animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `,
})
export class Spinner {
  readonly text = input('Cargando...');
}
