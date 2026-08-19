import type { Metadata } from "next";
import { AddressesView } from "@/components/addresses-view";

export const metadata: Metadata = {
  title: "Your Addresses | Pizza Palace",
  description: "Manage your delivery addresses.",
  robots: { index: false },
};

export default function AddressesPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold">Your Addresses</h1>
      <AddressesView />
    </main>
  );
}
