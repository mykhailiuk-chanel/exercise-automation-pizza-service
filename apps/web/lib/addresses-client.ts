"use client";

import type { AddressDto, AddressInput } from "@pizza/shared-types";
import { authFetch } from "@/lib/auth-client";

async function addressRequest(
  path: string,
  init?: RequestInit,
): Promise<AddressDto> {
  const res = await authFetch(`/addresses${path}`, init);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      body && typeof body === "object" && "message" in body
        ? String((body as { message: unknown }).message)
        : `Request failed with ${res.status}`;
    throw new Error(message);
  }
  return res.json() as Promise<AddressDto>;
}

export async function fetchAddresses(): Promise<AddressDto[]> {
  const res = await authFetch("/addresses");
  if (!res.ok) throw new Error("Failed to load addresses");
  return res.json() as Promise<AddressDto[]>;
}

export function createAddress(input: AddressInput): Promise<AddressDto> {
  return addressRequest("", { method: "POST", body: JSON.stringify(input) });
}

export function updateAddress(
  id: string,
  input: AddressInput,
): Promise<AddressDto> {
  return addressRequest(`/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteAddress(id: string): Promise<void> {
  const res = await authFetch(`/addresses/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete address");
}
