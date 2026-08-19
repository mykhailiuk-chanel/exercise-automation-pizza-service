import type { Metadata } from "next";
import { AdminCrustsView } from "@/components/admin/admin-crusts-view";

export const metadata: Metadata = {
  title: "Admin · Crusts | Pizza Palace",
  description: "Manage pizza crusts.",
  robots: { index: false },
};

export default function AdminCrustsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold">Crusts</h1>
      <AdminCrustsView />
    </main>
  );
}
