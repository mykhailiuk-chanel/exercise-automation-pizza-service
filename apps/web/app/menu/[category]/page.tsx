import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getProducts } from "@/lib/api-client";
import { MENU_PAGE_SIZE } from "@/lib/menu-config";
import { CategoryNav } from "@/components/category-nav";
import { MenuProductGrid } from "@/components/menu-product-grid";

export const dynamicParams = true;

type Params = { category: string };

async function getCategoryOrNotFound(slug: string) {
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();
  return { categories, category };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: `${category.name} | Pizza Palace Menu`,
    description: `Browse ${category.name} pizzas on Pizza Palace, a free demo site for QA automation practice.`,
  };
}

export default async function MenuCategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category: slug } = await params;
  const { categories, category } = await getCategoryOrNotFound(slug);
  const products = await getProducts({ category: slug, pageSize: MENU_PAGE_SIZE });

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold">{category.name}</h1>

      <div className="mt-6">
        <CategoryNav categories={categories} activeSlug={slug} />
      </div>

      {products.items.length === 0 ? (
        <p className="mt-8 text-zinc-600 dark:text-zinc-400">
          No products in this category yet.
        </p>
      ) : (
        <MenuProductGrid
          key={slug}
          initialItems={products.items}
          total={products.total}
          category={slug}
        />
      )}
    </main>
  );
}
