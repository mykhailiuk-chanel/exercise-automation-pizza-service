import Link from "next/link";
import type { ProductDto } from "@pizza/shared-types";
import { formatCents } from "@/lib/format";

export function ProductCard({ product }: { product: ProductDto }) {
  return (
    <li
      data-testid="menu-product-card"
      qa-data="menu-product-card"
      className="flex flex-col rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
    >
      <h3
        data-testid="menu-product-card-name"
        qa-data="menu-product-card-name"
        className="text-lg font-semibold"
      >
        {product.name}
      </h3>
      <p className="mt-1 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
        {product.description}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span
          data-testid="menu-product-card-price"
          qa-data="menu-product-card-price"
          className="font-medium"
        >
          {formatCents(product.basePriceCents)}
        </span>
        <Link
          href={`/product/${product.slug}`}
          data-testid="menu-product-card-view-link"
          qa-data="menu-product-card-view-link"
          className="text-sm font-medium underline underline-offset-4"
        >
          View details
        </Link>
      </div>
    </li>
  );
}
