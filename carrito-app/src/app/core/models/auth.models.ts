export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface LoginResponse {
  token: string;

  expira: string;
  usuario: string;
  nombre: string;
  rol: string;
}

/** Datos de sesión que se guardan en el navegador. */
export type Session = LoginResponse;
