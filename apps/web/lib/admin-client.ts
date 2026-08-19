"use client";

import type {
  AdminOrderSummaryDto,
  CouponDto,
  CouponInput,
  CrustDto,
  CrustInput,
  OrderStatus,
  ProductDto,
  ProductInput,
  SizeDto,
  SizeInput,
  ToppingDto,
  ToppingInput,
} from "@pizza/shared-types";
import { authFetch } from "@/lib/auth-client";

async function parseAdminError(res: Response): Promise<string> {
  const body = await res.json().catch(() => null);
  return body && typeof body === "object" && "message" in body
    ? String((body as { message: unknown }).message)
    : `Request failed with ${res.status}`;
}

async function adminGet<T>(path: string): Promise<T> {
  const res = await authFetch(`/admin${path}`);
  if (!res.ok) throw new Error(await parseAdminError(res));
  return res.json() as Promise<T>;
}

async function adminWrite<T>(
  path: string,
  method: "POST" | "PUT",
  input: unknown,
): Promise<T> {
  const res = await authFetch(`/admin${path}`, {
    method,
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseAdminError(res));
  return res.json() as Promise<T>;
}

async function adminPatch(path: string, input: unknown): Promise<void> {
  const res = await authFetch(`/admin${path}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseAdminError(res));
}

async function adminDelete(path: string): Promise<void> {
  const res = await authFetch(`/admin${path}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await parseAdminError(res));
}

// Orders
export const listAdminOrders = (): Promise<AdminOrderSummaryDto[]> =>
  adminGet("/orders");
export const updateOrderStatus = (
  id: string,
  status: OrderStatus,
): Promise<void> => adminPatch(`/orders/${id}/status`, { status });
export const deleteAdminOrder = (id: string): Promise<void> =>
  adminDelete(`/orders/${id}`);
export const deleteAllAdminOrders = (): Promise<void> =>
  adminDelete("/orders");

// Products
export const listAdminProducts = (): Promise<ProductDto[]> =>
  adminGet("/products");
export const createAdminProduct = (input: ProductInput): Promise<ProductDto> =>
  adminWrite("/products", "POST", input);
export const updateAdminProduct = (
  id: string,
  input: ProductInput,
): Promise<ProductDto> => adminWrite(`/products/${id}`, "PUT", input);
export const deleteAdminProduct = (id: string): Promise<void> =>
  adminDelete(`/products/${id}`);

// Toppings
export const listAdminToppings = (): Promise<ToppingDto[]> =>
  adminGet("/toppings");
export const createAdminTopping = (input: ToppingInput): Promise<ToppingDto> =>
  adminWrite("/toppings", "POST", input);
export const updateAdminTopping = (
  id: string,
  input: ToppingInput,
): Promise<ToppingDto> => adminWrite(`/toppings/${id}`, "PUT", input);
export const deleteAdminTopping = (id: string): Promise<void> =>
  adminDelete(`/toppings/${id}`);

// Sizes
export const listAdminSizes = (): Promise<SizeDto[]> => adminGet("/sizes");
export const createAdminSize = (input: SizeInput): Promise<SizeDto> =>
  adminWrite("/sizes", "POST", input);
export const updateAdminSize = (
  id: string,
  input: SizeInput,
): Promise<SizeDto> => adminWrite(`/sizes/${id}`, "PUT", input);
export const deleteAdminSize = (id: string): Promise<void> =>
  adminDelete(`/sizes/${id}`);

// Crusts
export const listAdminCrusts = (): Promise<CrustDto[]> => adminGet("/crusts");
export const createAdminCrust = (input: CrustInput): Promise<CrustDto> =>
  adminWrite("/crusts", "POST", input);
export const updateAdminCrust = (
  id: string,
  input: CrustInput,
): Promise<CrustDto> => adminWrite(`/crusts/${id}`, "PUT", input);
export const deleteAdminCrust = (id: string): Promise<void> =>
  adminDelete(`/crusts/${id}`);

// Coupons
export const listAdminCoupons = (): Promise<CouponDto[]> =>
  adminGet("/coupons");
export const createAdminCoupon = (input: CouponInput): Promise<CouponDto> =>
  adminWrite("/coupons", "POST", input);
export const updateAdminCoupon = (
  id: string,
  input: CouponInput,
): Promise<CouponDto> => adminWrite(`/coupons/${id}`, "PUT", input);
export const deleteAdminCoupon = (id: string): Promise<void> =>
  adminDelete(`/coupons/${id}`);
