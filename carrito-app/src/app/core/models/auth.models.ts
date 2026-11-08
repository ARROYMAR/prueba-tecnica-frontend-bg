/** Cuerpo que se envía a POST /api/auth/login */
export interface LoginRequest {
  username: string;
  password: string;
}

/** Respuesta de la API (los nombres coinciden con el LoginResponse del backend). */
export interface LoginResponse {
  token: string;
  expiresAt: string;
  usuario: string;
  nombre: string;
  rol: string;
}

/** Datos de sesión que se guardan en el navegador. */
export type Session = LoginResponse;
