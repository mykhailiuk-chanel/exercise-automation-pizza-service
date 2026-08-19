import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/order-confirmation";

export const metadata: Metadata = {
  title: "Order Detail | Pizza Palace",
  description: "Order detail and status.",
  robots: { index: false },
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold">
        Order <span className="font-mono text-2xl">#{orderId.slice(0, 8)}</span>
      </h1>
      <OrderConfirmation orderId={orderId} />
    </main>
  );
}
