import type { Metadata } from "next";
import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";

export const metadata: Metadata = {
  title: "Admin | Pizza Palace",
  description: "Admin dashboard for managing Pizza Palace.",
  robots: { index: false },
};

export default function AdminPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold">Admin</h1>
      <AdminDashboardView />
    </main>
  );
}
