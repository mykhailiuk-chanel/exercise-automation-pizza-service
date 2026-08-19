"use client";

import type { CouponPreviewDto } from "@pizza/shared-types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3053/api/v1";

export async function previewCoupon(
  code: string,
  subtotalCents: number,
): Promise<CouponPreviewDto> {
  const res = await fetch(`${API_BASE_URL}/coupons/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, subtotalCents }),
  });
  if (!res.ok) {
    return { valid: false, discountCents: 0, message: "Couldn't check coupon" };
  }
  return res.json() as Promise<CouponPreviewDto>;
}
