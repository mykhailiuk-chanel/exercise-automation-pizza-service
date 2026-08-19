import type { Metadata } from "next";
import { AdminCouponsView } from "@/components/admin/admin-coupons-view";

export const metadata: Metadata = {
  title: "Admin · Coupons | Pizza Palace",
  description: "Manage coupon codes.",
  robots: { index: false },
};

export default function AdminCouponsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold">Coupons</h1>
      <AdminCouponsView />
    </main>
  );
}
