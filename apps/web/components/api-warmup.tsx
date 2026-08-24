"use client";

import { useEffect } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3053/api/v1";

/**
 * Fires a best-effort ping on mount to wake a sleeping Render free-tier
 * instance as early as possible, before the user navigates to a page that
 * actually needs data (e.g. Cart).
 */
export function ApiWarmup() {
  useEffect(() => {
    fetch(`${API_BASE_URL}/health`, { cache: "no-store" }).catch(() => {});
  }, []);

  return null;
}
