import Link from "next/link";
import type { CategoryDto } from "@pizza/shared-types";

export function CategoryNav({
  categories,
  activeSlug,
}: {
  categories: CategoryDto[];
  activeSlug?: string;
}) {
  return (
    <nav
      data-testid="menu-category-nav"
      qa-data="menu-category-nav"
      aria-label="Menu categories"
    >
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/menu"
            data-testid="menu-category-nav-link"
            qa-data="menu-category-nav-link"
            aria-current={!activeSlug ? "page" : undefined}
            className={`inline-block rounded-full border px-4 py-1.5 text-sm font-medium ${
              !activeSlug
                ? "border-transparent bg-foreground text-background"
                : "border-zinc-300 dark:border-zinc-700"
            }`}
          >
            All
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/menu/${category.slug}`}
              data-testid="menu-category-nav-link"
              qa-data="menu-category-nav-link"
              aria-current={activeSlug === category.slug ? "page" : undefined}
              className={`inline-block rounded-full border px-4 py-1.5 text-sm font-medium ${
                activeSlug === category.slug
                  ? "border-transparent bg-foreground text-background"
                  : "border-zinc-300 dark:border-zinc-700"
              }`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
