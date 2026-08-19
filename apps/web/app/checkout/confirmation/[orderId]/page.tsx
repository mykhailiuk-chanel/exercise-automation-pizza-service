import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/order-confirmation";

export const metadata: Metadata = {
  title: "Order Confirmed | Pizza Palace",
  description: "Your Pizza Palace order confirmation.",
  robots: { index: false },
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold">Order placed!</h1>
      <OrderConfirmation orderId={orderId} />
    </main>
  );
}
