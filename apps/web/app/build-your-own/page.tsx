import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCrusts, getProductBySlug, getSizes, getToppings } from "@/lib/api-client";
import { PizzaBuilder } from "@/components/pizza-builder";

export const metadata: Metadata = {
  title: "Build Your Own | Pizza Palace",
  description:
    "Pick a size and crust, then drag toppings onto your pizza to build your own.",
  robots: { index: false },
};

export default async function BuildYourOwnPage() {
  const [product, sizes, crusts, toppings] = await Promise.all([
    getProductBySlug("build-your-own"),
    getSizes(),
    getCrusts(),
    getToppings(),
  ]);
  if (!product) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold">Build Your Own</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Starting from {product.name.toLowerCase()} — pick your size, crust,
        and toppings.
      </p>

      <div className="mt-8">
        <PizzaBuilder
          product={product}
          sizes={sizes}
          crusts={crusts}
          toppings={toppings}
        />
      </div>
    </main>
  );
}
