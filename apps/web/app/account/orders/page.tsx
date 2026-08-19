import type { Metadata } from "next";
import { OrdersHistoryList } from "@/components/orders-history-list";

export const metadata: Metadata = {
  title: "Your Orders | Pizza Palace",
  description: "Your past orders.",
  robots: { index: false },
};

export default function OrdersHistoryPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold">Your Orders</h1>
      <OrdersHistoryList />
    </main>
  );
}
