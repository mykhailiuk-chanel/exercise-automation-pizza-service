"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { CartDto } from "@pizza/shared-types";
import { formatCents } from "@/lib/format";
import {
  fetchCart,
  removeCartItem,
  updateCartItemQuantity,
} from "@/lib/cart-client";

export function CartView() {
  const [cart, setCart] = useState<CartDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setCart(await fetchCart());
      setError(null);
    } catch {
      setError("Couldn't load your cart — please refresh the page.");
    }
  }, []);

  useEffect(() => {
    // Fetching on mount is the intended use here, not derived-state-from-props
    // the rule is meant to catch — see https://react.dev/learn/you-might-not-need-an-effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function handleQuantityChange(itemId: string, quantity: number) {
    if (quantity < 1) return;
    setCart(await updateCartItemQuantity(itemId, quantity));
  }

  async function handleRemove(itemId: string) {
    setCart(await removeCartItem(itemId));
  }

  if (error) {
    return <p className="mt-8 text-sm text-red-600">{error}</p>;
  }

  if (!cart) {
    return (
      <p
        data-testid="cart-loading"
        qa-data="cart-loading"
        className="mt-8 text-zinc-600 dark:text-zinc-400"
      >
        Loading your cart…
      </p>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div data-testid="cart-empty" qa-data="cart-empty" className="mt-8">
        <p className="text-zinc-600 dark:text-zinc-400">Your cart is empty.</p>
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
    <div className="mt-8">
      <ul
        data-testid="cart-items"
        qa-data="cart-items"
        className="flex flex-col gap-4"
      >
        {cart.items.map((item) => (
          <li
            key={item.id}
            data-testid="cart-item"
            qa-data="cart-item"
            data-item-id={item.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <div>
              <p
                data-testid="cart-item-name"
                qa-data="cart-item-name"
                className="font-semibold"
              >
                {item.productName}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {item.sizeName}, {item.crustName}
                {item.toppingNames.length > 0
                  ? ` + ${item.toppingNames.join(", ")}`
                  : ""}
              </p>
              <p className="mt-1 text-sm">
                {formatCents(item.unitPriceCents)} each
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                  data-testid="cart-item-quantity-decrement"
                  qa-data="cart-item-quantity-decrement"
                  className="h-8 w-8 rounded-full border border-zinc-300 dark:border-zinc-700"
                  aria-label={`Decrease quantity of ${item.productName}`}
                >
                  −
                </button>
                <span
                  data-testid="cart-item-quantity"
                  qa-data="cart-item-quantity"
                  className="w-6 text-center"
                >
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                  data-testid="cart-item-quantity-increment"
                  qa-data="cart-item-quantity-increment"
                  className="h-8 w-8 rounded-full border border-zinc-300 dark:border-zinc-700"
                  aria-label={`Increase quantity of ${item.productName}`}
                >
                  +
                </button>
              </div>
              <p
                data-testid="cart-item-line-total"
                qa-data="cart-item-line-total"
                className="w-20 text-right font-medium"
              >
                {formatCents(item.lineTotalCents)}
              </p>
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                data-testid="cart-item-remove"
                qa-data="cart-item-remove"
                className="text-sm font-medium text-red-600 underline underline-offset-4"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <span className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Subtotal ({cart.itemCount} {cart.itemCount === 1 ? "item" : "items"})
        </span>
        <span
          data-testid="cart-subtotal"
          qa-data="cart-subtotal"
          className="text-xl font-bold"
        >
          {formatCents(cart.subtotalCents)}
        </span>
      </div>

      <Link
        href="/checkout"
        data-testid="cart-checkout-link"
        qa-data="cart-checkout-link"
        className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
