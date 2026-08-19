import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout-view";

export const metadata: Metadata = {
  title: "Checkout | Pizza Palace",
  description: "Review your order and check out.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <CheckoutView />
    </main>
  );
}
