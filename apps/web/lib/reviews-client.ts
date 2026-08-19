"use client";

import type { ReviewDto, ReviewInput } from "@pizza/shared-types";
import { authFetch, getAccessToken } from "@/lib/auth-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3053/api/v1";

/** Public endpoint — attach the token only if we have one, to get `isOwn` back. */
export async function fetchReviews(slug: string): Promise<ReviewDto[]> {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE_URL}/products/${slug}/reviews`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error("Failed to load reviews");
  return res.json() as Promise<ReviewDto[]>;
}

export async function submitReview(
  slug: string,
  input: ReviewInput,
): Promise<ReviewDto> {
  const res = await authFetch(`/products/${slug}/reviews`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      body && typeof body === "object" && "message" in body
        ? String((body as { message: unknown }).message)
        : "Couldn't submit review";
    throw new Error(message);
  }
  return res.json() as Promise<ReviewDto>;
}

export async function deleteReview(slug: string): Promise<void> {
  const res = await authFetch(`/products/${slug}/reviews`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Couldn't delete review");
}
