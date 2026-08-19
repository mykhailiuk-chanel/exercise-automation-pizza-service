import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Log in | Pizza Palace",
  description: "Log in to your Pizza Palace account.",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold">Log in</h1>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
