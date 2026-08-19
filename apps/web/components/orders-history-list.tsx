"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { OrderDto } from "@pizza/shared-types";
import { useAuth } from "@/components/auth-provider";
import { listOrders } from "@/lib/orders-client";
import { formatCents } from "@/lib/format";

export function OrdersHistoryList() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderDto[] | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/account/login?redirect=/account/orders");
    }
  }, [isAuthLoading, user, router]);

  useEffect(() => {
    if (user) {
      listOrders().then(setOrders);
    }
  }, [user]);

  if (isAuthLoading || !user || orders === null) {
    return (
      <p
        data-testid="orders-history-loading"
        qa-data="orders-history-loading"
        className="mt-8"
      >
        Loading…
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <div
        data-testid="orders-history-empty"
        qa-data="orders-history-empty"
        className="mt-8"
      >
        <p className="text-zinc-600 dark:text-zinc-400">
          You haven&apos;t placed any orders yet.
        </p>
        <Link
          href="/menu"
          className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <ul
      data-testid="orders-history-list"
      qa-data="orders-history-list"
      className="mt-8 flex flex-col gap-3"
    >
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={`/account/orders/${order.id}`}
            data-testid="orders-history-item"
            qa-data="orders-history-item"
            data-order-status={order.status}
            className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 text-sm hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <div>
              <p className="font-mono">#{order.id.slice(0, 8)}</p>
              <p className="text-zinc-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <span
              data-testid="orders-history-item-status"
              qa-data="orders-history-item-status"
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium capitalize dark:bg-zinc-900"
            >
              {order.status.replace(/_/g, " ")}
            </span>
            <span className="font-semibold">
              {formatCents(order.totalCents)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
