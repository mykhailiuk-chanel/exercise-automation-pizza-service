"use client";

import { useRequireAdmin } from "@/components/admin/use-require-admin";
import { AdminNav } from "@/components/admin/admin-nav";

export function AdminDashboardView() {
  const { user, isLoading, isAdmin } = useRequireAdmin();

  if (isLoading || !isAdmin) return null;

  return (
    <div data-testid="admin-dashboard" qa-data="admin-dashboard" className="mt-8">
      <AdminNav />
      <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
        Signed in as {user?.email}. Manage orders, catalog, and coupons from
        the links above.
      </p>
    </div>
  );
}
