"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { RequiredMark } from "@/components/required-mark";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      router.push(searchParams.get("redirect") ?? "/account/addresses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="login-form"
      qa-data="login-form"
      className="mt-8 flex max-w-sm flex-col gap-4"
    >
      <p className="text-xs text-zinc-500">
        <RequiredMark /> Required
      </p>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-500">
          Email
          <RequiredMark />
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="login-email"
          qa-data="login-email"
          className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-500">
          Password
          <RequiredMark />
        </span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-testid="login-password"
          qa-data="login-password"
          className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
        />
      </label>

      {error && (
        <p
          data-testid="login-error"
          qa-data="login-error"
          className="text-sm text-red-600"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        data-testid="login-submit"
        qa-data="login-submit"
        className="mt-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background disabled:opacity-50"
      >
        {isSubmitting ? "Logging in…" : "Log in"}
      </button>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Need an account?{" "}
        <Link
          href="/account/register"
          className="font-medium underline underline-offset-4"
        >
          Register
        </Link>
      </p>
    </form>
  );
}
