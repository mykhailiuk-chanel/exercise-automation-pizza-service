import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCrusts,
  getProductBySlug,
  getSizes,
  getToppings,
} from "@/lib/api-client";
import { formatCents } from "@/lib/format";
import { AddToCartForm } from "@/components/add-to-cart-form";
import { ReviewsSection } from "@/components/reviews-section";

export const dynamicParams = true;

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} | Pizza Palace`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.imageUrl],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [product, toppings, sizes, crusts] = await Promise.all([
    getProductBySlug(slug),
    getToppings(),
    getSizes(),
    getCrusts(),
  ]);
  if (!product) notFound();

  const defaultToppingNames = product.defaultToppingIds
    .map((id) => toppings.find((t) => t.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: (product.basePriceCents / 100).toFixed(2),
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main
      data-testid="product-detail"
      qa-data="product-detail"
      className="mx-auto w-full max-w-3xl flex-1 px-6 py-12"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1
        data-testid="product-detail-name"
        qa-data="product-detail-name"
        className="text-3xl font-bold"
      >
        {product.name}
      </h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        {product.description}
      </p>
      <p
        data-testid="product-detail-price"
        qa-data="product-detail-price"
        className="mt-4 text-xl font-semibold"
      >
        From {formatCents(product.basePriceCents)}
      </p>
      {product.ratingCount > 0 && (
        <p
          data-testid="product-detail-rating"
          qa-data="product-detail-rating"
          className="mt-1 text-sm text-zinc-600 dark:text-zinc-400"
        >
          {"★".repeat(Math.round(product.ratingAverage))}
          {"☆".repeat(5 - Math.round(product.ratingAverage))} (
          {product.ratingAverage.toFixed(1)}, {product.ratingCount}{" "}
          {product.ratingCount === 1 ? "review" : "reviews"})
        </p>
      )}

      {defaultToppingNames.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Comes with
          </h2>
          <ul
            data-testid="product-detail-default-toppings"
            qa-data="product-detail-default-toppings"
            className="mt-2 flex flex-wrap gap-2"
          >
            {defaultToppingNames.map((name) => (
              <li
                key={name}
                className="rounded-full border border-zinc-300 px-3 py-1 text-sm dark:border-zinc-700"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!product.available && (
        <p className="mt-6 text-sm font-medium text-red-600">
          Currently unavailable.
        </p>
      )}

      {product.available && product.isBuildYourOwnBase && (
        <p className="mt-6 text-sm">
          Want to customize your toppings?{" "}
          <Link
            href="/build-your-own"
            className="font-medium underline underline-offset-4"
          >
            Use the pizza builder
          </Link>
          .
        </p>
      )}

      {product.available && !product.isBuildYourOwnBase && (
        <AddToCartForm product={product} sizes={sizes} crusts={crusts} />
      )}

      <ReviewsSection slug={product.slug} />
    </main>
  );
}
