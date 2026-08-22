"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export function SiteHeader() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header
      data-testid="site-header"
      qa-data="site-header"
      className="border-b border-zinc-200 dark:border-zinc-800"
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          data-testid="site-header-logo"
          qa-data="site-header-logo"
          className="text-lg font-bold"
        >
          🍕 Pizza Palace
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-6">
          <Link
            href="/for-testers"
            data-testid="site-header-for-testers-link"
            qa-data="site-header-for-testers-link"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            For Testers
          </Link>
          <Link
            href="/menu"
            data-testid="site-header-menu-link"
            qa-data="site-header-menu-link"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Menu
          </Link>
          <Link
            href="/build-your-own"
            data-testid="site-header-build-your-own-link"
            qa-data="site-header-build-your-own-link"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Build Your Own
          </Link>
          <Link
            href="/cart"
            data-testid="site-header-cart-link"
            qa-data="site-header-cart-link"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Cart
          </Link>

          {!isLoading && user && (
            <>
              <Link
                href="/account/addresses"
                data-testid="site-header-addresses-link"
                qa-data="site-header-addresses-link"
                className="text-sm font-medium underline-offset-4 hover:underline"
              >
                Addresses
              </Link>
              <Link
                href="/account/orders"
                data-testid="site-header-orders-link"
                qa-data="site-header-orders-link"
                className="text-sm font-medium underline-offset-4 hover:underline"
              >
                Orders
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  data-testid="site-header-admin-link"
                  qa-data="site-header-admin-link"
                  className="text-sm font-medium underline-offset-4 hover:underline"
                >
                  Admin
                </Link>
              )}
              <span
                data-testid="site-header-user-name"
                qa-data="site-header-user-name"
                className="text-sm text-zinc-500"
              >
                {user.firstName}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                data-testid="site-header-logout"
                qa-data="site-header-logout"
                className="text-sm font-medium underline-offset-4 hover:underline"
              >
                Log out
              </button>
            </>
          )}

          {!isLoading && !user && (
            <Link
              href="/account/login"
              data-testid="site-header-login-link"
              qa-data="site-header-login-link"
              className="text-sm font-medium underline-offset-4 hover:underline"
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
