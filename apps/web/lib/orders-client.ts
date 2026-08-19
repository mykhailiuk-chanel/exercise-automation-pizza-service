"use client";

import type { CheckoutInput, OrderDto } from "@pizza/shared-types";
import { authFetch } from "@/lib/auth-client";
import { getOrCreateCartId } from "@/lib/cart-client";

async function parseErrorMessage(res: Response): Promise<string> {
  const body = await res.json().catch(() => null);
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message: unknown }).message;
    return Array.isArray(message) ? message.join(", ") : String(message);
  }
  return `Request failed with ${res.status}`;
}

export async function checkout(input: CheckoutInput): Promise<OrderDto> {
  const res = await authFetch("/orders/checkout", {
    method: "POST",
    headers: { "X-Cart-Id": getOrCreateCartId() },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<OrderDto>;
}

export async function getOrder(orderId: string): Promise<OrderDto> {
  const res = await authFetch(`/orders/${orderId}`);
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<OrderDto>;
}

export async function listOrders(): Promise<OrderDto[]> {
  const res = await authFetch("/orders");
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<OrderDto[]>;
}
