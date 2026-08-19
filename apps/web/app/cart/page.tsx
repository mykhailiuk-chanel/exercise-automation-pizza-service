import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Your Cart | Pizza Palace",
  description: "Review your cart before checking out.",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold">Your Cart</h1>
      <CartView />
    </main>
  );
}
