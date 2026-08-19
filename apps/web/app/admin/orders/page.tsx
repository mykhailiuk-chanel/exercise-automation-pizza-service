import type { Metadata } from "next";
import { AdminOrdersView } from "@/components/admin/admin-orders-view";

export const metadata: Metadata = {
  title: "Admin · Orders | Pizza Palace",
  description: "Manage and override order statuses.",
  robots: { index: false },
};

export default function AdminOrdersPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold">Orders</h1>
      <AdminOrdersView />
    </main>
  );
}
