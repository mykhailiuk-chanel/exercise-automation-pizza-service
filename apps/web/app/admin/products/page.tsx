import type { Metadata } from "next";
import { AdminProductsView } from "@/components/admin/admin-products-view";

export const metadata: Metadata = {
  title: "Admin · Products | Pizza Palace",
  description: "Manage the product catalog.",
  robots: { index: false },
};

export default function AdminProductsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold">Products</h1>
      <AdminProductsView />
    </main>
  );
}
