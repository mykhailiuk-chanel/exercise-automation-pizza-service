"use client";

import type { AddCartItemInput, CartDto } from "@pizza/shared-types";

const CART_ID_STORAGE_KEY = "pizza_cart_id";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3053/api/v1";

/**
 * Guest carts have no login/cookie — the browser generates a UUID once,
 * keeps it in localStorage, and sends it as X-Cart-Id on every request.
 * This also means the same cart is trivially reproducible from Postman.
 */
export function getOrCreateCartId(): string {
  let cartId = window.localStorage.getItem(CART_ID_STORAGE_KEY);
  if (!cartId) {
    cartId = crypto.randomUUID();
    window.localStorage.setItem(CART_ID_STORAGE_KEY, cartId);
  }
  return cartId;
}

async function cartRequest(
  path: string,
  init?: RequestInit,
): Promise<CartDto> {
  const res = await fetch(`${API_BASE_URL}/cart${path}`, {
    ...init,
    headers: {
      "X-Cart-Id": getOrCreateCartId(),
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      (body && typeof body === "object" && "message" in body
        ? String((body as { message: unknown }).message)
        : null) ?? `Cart request failed with ${res.status}`;
    throw new Error(message);
  }
  return res.json() as Promise<CartDto>;
}

export function fetchCart(): Promise<CartDto> {
  return cartRequest("");
}

export function addCartItem(input: AddCartItemInput): Promise<CartDto> {
  return cartRequest("/items", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateCartItemQuantity(
  itemId: string,
  quantity: number,
): Promise<CartDto> {
  return cartRequest(`/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(itemId: string): Promise<CartDto> {
  return cartRequest(`/items/${itemId}`, { method: "DELETE" });
}
