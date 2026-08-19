"use client";

import type {
  AuthTokensDto,
  LoginInput,
  RegisterInput,
  UserDto,
} from "@pizza/shared-types";

const ACCESS_TOKEN_KEY = "pizza_access_token";
const REFRESH_TOKEN_KEY = "pizza_refresh_token";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3053/api/v1";

export function getAccessToken(): string | null {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken(): string | null {
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

function storeTokens(tokens: AuthTokensDto): void {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearTokens(): void {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function parseErrorMessage(res: Response): Promise<string> {
  const body = await res.json().catch(() => null);
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message: unknown }).message;
    return Array.isArray(message) ? message.join(", ") : String(message);
  }
  return `Request failed with ${res.status}`;
}

export async function register(input: RegisterInput): Promise<UserDto> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  const tokens = (await res.json()) as AuthTokensDto;
  storeTokens(tokens);
  return tokens.user;
}

export async function login(input: LoginInput): Promise<UserDto> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  const tokens = (await res.json()) as AuthTokensDto;
  storeTokens(tokens);
  return tokens.user;
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();
  clearTokens();
  if (!refreshToken) return;
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  }).catch(() => undefined);
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) {
    clearTokens();
    return false;
  }
  storeTokens((await res.json()) as AuthTokensDto);
  return true;
}

/**
 * Fetch wrapper that attaches the access token and, on a single 401,
 * transparently refreshes and retries once before giving up.
 */
export async function authFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const withAuth = (): RequestInit => ({
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
      Authorization: `Bearer ${getAccessToken() ?? ""}`,
    },
  });

  let res = await fetch(`${API_BASE_URL}${path}`, withAuth());
  if (res.status === 401 && (await tryRefresh())) {
    res = await fetch(`${API_BASE_URL}${path}`, withAuth());
  }
  return res;
}

export async function getMe(): Promise<UserDto | null> {
  if (!getAccessToken()) return null;
  const res = await authFetch("/auth/me");
  if (!res.ok) return null;
  return res.json() as Promise<UserDto>;
}
