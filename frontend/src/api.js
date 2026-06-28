// ============================================================
// api.js — configuração central da API
//
// Esse arquivo é a "porta de entrada" pra qualquer chamada ao back.
// Todas as outras telas (perfil, itens, coleções, favoritos) vão
// importar daqui em vez de escrever fetch() cru espalhado pelo código.
// ============================================================

// URL base do back — ela disse que roda em http://127.0.0.1:8000/
export const API_BASE_URL = "http://127.0.0.1:8000";

// ── Helpers de token ──────────────────────────────────────────
// Salvamos o access e o refresh no localStorage.
// localStorage persiste mesmo se a pessoa fechar a aba/navegador
// (diferente de um state React comum, que se perde ao recarregar a página).

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
}

// Usado nas telas pra saber se tem alguém logado (ex: rota protegida)
export function isAuthenticated() {
  return !!getAccessToken();
}

// ── Helper de fetch autenticado ──────────────────────────────
// Todas as chamadas a endpoints protegidos (perfil, itens, coleções...)
// devem usar esta função em vez de fetch() direto, porque ela:
// 1. Monta a URL completa automaticamente (API_BASE_URL + path)
// 2. Anexa o header Authorization: Bearer <token> automaticamente
// 3. Não define Content-Type quando o body é FormData (upload de imagem) —
//    o navegador precisa definir esse header sozinho com o boundary correto
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
