"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { RequiredMark } from "@/components/required-mark";

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register({ email, password, firstName, lastName });
      router.push(searchParams.get("redirect") ?? "/account/addresses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="register-form"
      qa-data="register-form"
      className="mt-8 flex max-w-sm flex-col gap-4"
    >
      <p className="text-xs text-zinc-500">
        <RequiredMark /> Required
      </p>
      <div className="flex gap-4">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">
            First name
            <RequiredMark />
          </span>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            data-testid="register-first-name"
            qa-data="register-first-name"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">
            Last name
            <RequiredMark />
          </span>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            data-testid="register-last-name"
            qa-data="register-last-name"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          />
        </label>
      </div>

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
          data-testid="register-email"
          qa-data="register-email"
          className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-500">
          Password (min. 8 characters)
          <RequiredMark />
        </span>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-testid="register-password"
          qa-data="register-password"
          className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
        />
      </label>

      {error && (
        <p
          data-testid="register-error"
          qa-data="register-error"
          className="text-sm text-red-600"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        data-testid="register-submit"
        qa-data="register-submit"
        className="mt-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background disabled:opacity-50"
      >
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/account/login"
          data-testid="register-login-link"
          qa-data="register-login-link"
          className="font-medium underline underline-offset-4"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
