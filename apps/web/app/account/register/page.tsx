import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/register-form";

export const metadata: Metadata = {
  title: "Register | Pizza Palace",
  description: "Create a Pizza Palace account.",
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold">Create an account</h1>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
