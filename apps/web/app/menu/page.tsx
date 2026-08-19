import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/api-client";
import { MENU_PAGE_SIZE } from "@/lib/menu-config";
import { CategoryNav } from "@/components/category-nav";
import { MenuProductGrid } from "@/components/menu-product-grid";

export const metadata: Metadata = {
  title: "Menu | Pizza Palace",
  description:
    "Browse the full Pizza Palace menu — classic and specialty pizzas, vegan options, sides, and drinks. A free demo site for QA automation practice.",
};

export default async function MenuPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ pageSize: MENU_PAGE_SIZE }),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold">Menu</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Every pizza here is fake — this is a practice site for QA automation,
        not a real pizzeria.
      </p>

      <div className="mt-6">
        <CategoryNav categories={categories} />
      </div>

      <MenuProductGrid
        key="all"
        initialItems={products.items}
        total={products.total}
      />
    </main>
  );
}
