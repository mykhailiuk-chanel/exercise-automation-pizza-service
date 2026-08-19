"use client";

import type { CaptchaChallengeDto } from "@pizza/shared-types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3053/api/v1";

export async function getCaptchaChallenge(): Promise<CaptchaChallengeDto> {
  const res = await fetch(`${API_BASE_URL}/captcha/challenge`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Couldn't load verification challenge");
  return res.json() as Promise<CaptchaChallengeDto>;
}
