import type { Metadata } from "next";
import { AdminToppingsView } from "@/components/admin/admin-toppings-view";

export const metadata: Metadata = {
  title: "Admin · Toppings | Pizza Palace",
  description: "Manage pizza toppings.",
  robots: { index: false },
};

export default function AdminToppingsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold">Toppings</h1>
      <AdminToppingsView />
    </main>
  );
}
