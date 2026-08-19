import type { Metadata } from "next";
import { AdminSizesView } from "@/components/admin/admin-sizes-view";

export const metadata: Metadata = {
  title: "Admin · Sizes | Pizza Palace",
  description: "Manage pizza sizes.",
  robots: { index: false },
};

export default function AdminSizesPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold">Sizes</h1>
      <AdminSizesView />
    </main>
  );
}
