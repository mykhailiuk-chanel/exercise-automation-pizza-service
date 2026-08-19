"use client";

import { useEffect, useRef, useState } from "react";
import type { ProductDto } from "@pizza/shared-types";
import { getProducts } from "@/lib/api-client";
import { MENU_PAGE_SIZE } from "@/lib/menu-config";
import { ProductCard } from "@/components/product-card";

export function MenuProductGrid({
  initialItems,
  total,
  category,
}: {
  initialItems: ProductDto[];
  total: number;
  category?: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = items.length < total;

  async function loadMore() {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const nextPage = page + 1;
    const result = await getProducts({
      category,
      page: nextPage,
      pageSize: MENU_PAGE_SIZE,
    });
    setItems((prev) => [...prev, ...result.items]);
    setPage(nextPage);
    setIsLoading(false);
  }

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isLoading, page]);

  return (
    <>
      <ul
        data-testid="menu-product-grid"
        qa-data="menu-product-grid"
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
      >
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>

      {hasMore && (
        <div
          ref={sentinelRef}
          data-testid="menu-infinite-scroll-sentinel"
          qa-data="menu-infinite-scroll-sentinel"
          className="mt-8 flex justify-center"
        >
          {isLoading ? (
            <p
              data-testid="menu-infinite-scroll-loading"
              qa-data="menu-infinite-scroll-loading"
              className="text-sm text-zinc-500"
            >
              Loading more…
            </p>
          ) : (
            <button
              type="button"
              onClick={loadMore}
              data-testid="menu-load-more"
              qa-data="menu-load-more"
              className="rounded-full border border-zinc-300 px-6 py-2 text-sm font-medium dark:border-zinc-700"
            >
              Load more
            </button>
          )}
        </div>
      )}
    </>
  );
}
