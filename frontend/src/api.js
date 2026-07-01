export const API_BASE_URL = "http://127.0.0.1:8000";

export function salvarTokens({ access, refresh }) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

export function getAccessToken() {
  return localStorage.getItem("access_token");
}

export function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}

export function limparTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_id"); // limpa o ID junto ao fazer logout
}

export function isAuthenticated() {
  return !!getAccessToken();
}

// ── Helpers de usuário logado ─────────────────────────────────
export function salvarUserId(id) {
  localStorage.setItem("user_id", String(id));
}

export function getLoggedUserId() {
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : null;
}

// ── Helper de fetch autenticado ──────────────────────────────
export async function apiFetch(path, options = {}) {
  const { skipAuth = false, ...fetchOptions } = options;
  const token = skipAuth ? null : getAccessToken();
  const isFormData = fetchOptions.body instanceof FormData;

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...fetchOptions.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  return response;
}