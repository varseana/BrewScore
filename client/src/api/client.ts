// ⁘[ API CLIENT ]⁘
// wrapper de fetch con auth automatico y refresh

import { useAuthStore } from "@/stores/auth";
import type { AuthTokens } from "@/types";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

class ApiClient {
  private refreshPromise: Promise<boolean> | null = null;

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const { accessToken } = useAuthStore.getState();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

    // si el token expiro, intentar refresh
    if (res.status === 401 && accessToken) {
      const refreshed = await this.tryRefresh();
      if (refreshed) return this.request<T>(path, options);
      // si no se pudo refrescar, limpiar sesion
      useAuthStore.getState().logout();
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "request failed" }));
      throw new ApiError(res.status, body.error || "request failed", body.details);
    }

    return res.json();
  }

  private async tryRefresh(): Promise<boolean> {
    // evitar multiples refreshes simultaneos
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = (async () => {
      const { refreshToken } = useAuthStore.getState();
      if (!refreshToken) return false;

      try {
        const res = await fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
        if (!res.ok) return false;

        const tokens: AuthTokens = await res.json();
        useAuthStore.getState().setTokens(tokens.accessToken, tokens.refreshToken);
        return true;
      } catch {
        return false;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  get<T>(path: string) {
    return this.request<T>(path);
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: "DELETE" });
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
  }
}

export const api = new ApiClient();
