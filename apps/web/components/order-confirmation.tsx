"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { OrderDto } from "@pizza/shared-types";
import { getOrder } from "@/lib/orders-client";
import { formatCents } from "@/lib/format";
import { OrderStatusTimeline } from "@/components/order-status-timeline";

export function OrderConfirmation({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(() => {
    return getOrder(orderId)
      .then(setOrder)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Couldn't load order"),
      );
  }, [orderId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleRefresh() {
    setIsRefreshing(true);
    await load();
    setIsRefreshing(false);
  }

  if (error) {
    return (
      <p
        data-testid="order-confirmation-error"
        qa-data="order-confirmation-error"
        className="mt-8 text-sm text-red-600"
      >
        {error}
      </p>
    );
  }

  if (!order) {
    return (
      <p
        data-testid="order-confirmation-loading"
        qa-data="order-confirmation-loading"
        className="mt-8"
      >
        Loading…
      </p>
    );
  }

  return (
    <div
      data-testid="order-confirmation"
      qa-data="order-confirmation"
      className="mt-8"
    >
      <p className="text-lg">
        Your order{" "}
        <span
          data-testid="order-confirmation-id"
          qa-data="order-confirmation-id"
          className="font-mono text-sm"
        >
          #{order.id.slice(0, 8)}
        </span>{" "}
        is{" "}
        <span
          data-testid="order-confirmation-status"
          qa-data="order-confirmation-status"
        >
          {order.status}
        </span>
        .
      </p>

      <OrderStatusTimeline order={order} />

      <button
        type="button"
        onClick={handleRefresh}
        disabled={isRefreshing}
        data-testid="order-confirmation-refresh"
        qa-data="order-confirmation-refresh"
        className="mt-3 text-xs font-medium underline underline-offset-4 disabled:opacity-50"
      >
        {isRefreshing ? "Refreshing…" : "Refresh status"}
      </button>

      <ul className="mt-6 flex flex-col gap-2">
        {order.items.map((item, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span>
              {item.quantity}× {item.productName} ({item.size}, {item.crust}
              {item.toppings.length > 0 ? `, ${item.toppings.join(", ")}` : ""})
            </span>
            <span>{formatCents(item.lineTotalCents)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-4 flex flex-col gap-1 border-t border-zinc-200 pt-3 text-sm dark:border-zinc-800">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatCents(order.subtotalCents)}</dd>
        </div>
        {order.discountCents > 0 && (
          <div className="flex justify-between">
            <dt>Discount {order.couponCode && `(${order.couponCode})`}</dt>
            <dd
              data-testid="order-confirmation-discount"
              qa-data="order-confirmation-discount"
            >
              -{formatCents(order.discountCents)}
            </dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt>Tax</dt>
          <dd>{formatCents(order.taxCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Delivery fee</dt>
          <dd>{formatCents(order.deliveryFeeCents)}</dd>
        </div>
        <div className="flex justify-between text-base font-bold">
          <dt>Total</dt>
          <dd
            data-testid="order-confirmation-total"
            qa-data="order-confirmation-total"
          >
            {formatCents(order.totalCents)}
          </dd>
        </div>
      </dl>

      <Link
        href="/menu"
        className="mt-6 inline-block text-sm font-medium underline underline-offset-4"
      >
        Back to menu
      </Link>
    </div>
  );
}
