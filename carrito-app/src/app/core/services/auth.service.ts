import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, Session } from '../models/auth.models';

const SESSION_KEY = 'carrito.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Estado de la sesión como signal: los componentes reaccionan solos al cambio.
  private readonly _session = signal<Session | null>(this.readSession());

  readonly session = this._session.asReadonly();
  readonly isLoggedIn = computed(() => {
    const s = this._session();
    return !!s && new Date(s.expira).getTime() > Date.now();
  });
  readonly isAdmin = computed(() => this._session()?.rol === 'Admin');

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(tap((res) => this.saveSession(res)));
  }

  logout(redirect = true): void {
    localStorage.removeItem(SESSION_KEY);
    this._session.set(null);
    if (redirect) {
      this.router.navigate(['/login']);
    }
  }

  getToken(): string | null {
    return this.isLoggedIn() ? this._session()!.token : null;
  }

  private saveSession(res: LoginResponse): void {
    const session: Session = { ...res };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    this._session.set(session);
  }

  private readSession(): Session | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  }
}
