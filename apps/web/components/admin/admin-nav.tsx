"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/toppings", label: "Toppings" },
  { href: "/admin/sizes", label: "Sizes" },
  { href: "/admin/crusts", label: "Crusts" },
  { href: "/admin/coupons", label: "Coupons" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      data-testid="admin-nav"
      qa-data="admin-nav"
      aria-label="Admin"
      className="flex flex-wrap gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800"
    >
      {LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            data-testid={`admin-nav-${link.label.toLowerCase()}-link`}
            qa-data={`admin-nav-${link.label.toLowerCase()}-link`}
            data-active={isActive}
            className={`text-sm font-medium underline-offset-4 hover:underline ${
              isActive ? "underline font-semibold" : ""
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
