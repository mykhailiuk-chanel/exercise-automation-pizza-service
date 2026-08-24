"use client";

import { useState } from "react";
import type { CrustDto, ProductDto, SizeDto } from "@pizza/shared-types";
import { addCartItem } from "@/lib/cart-client";
import { useToast } from "@/components/toast-provider";

export function AddToCartForm({
  product,
  sizes,
  crusts,
}: {
  product: ProductDto;
  sizes: SizeDto[];
  crusts: CrustDto[];
}) {
  const { showToast } = useToast();
  const [sizeId, setSizeId] = useState("");
  const [crustId, setCrustId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const missingRequiredOptions = !sizeId || !crustId;

  async function handleAddToCart() {
    if (missingRequiredOptions) {
      showToast("Please select a size and crust before adding to cart.");
      return;
    }
    setIsSubmitting(true);
    try {
      await addCartItem({
        productId: product.id,
        sizeId,
        crustId,
        toppingIds: product.defaultToppingIds,
        quantity,
      });
      showToast("Added to cart!");
    } catch {
      showToast("Couldn't add to cart — please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      data-testid="add-to-cart-form"
      qa-data="add-to-cart-form"
      className="mt-6"
    >
      <div className="flex flex-wrap gap-6">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">Size *</span>
          <select
            value={sizeId}
            onChange={(e) => setSizeId(e.target.value)}
            data-testid="add-to-cart-size-select"
            qa-data="add-to-cart-size-select"
            required
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          >
            <option value="" disabled>
              Select a size
            </option>
            {sizes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">Crust *</span>
          <select
            value={crustId}
            onChange={(e) => setCrustId(e.target.value)}
            data-testid="add-to-cart-crust-select"
            qa-data="add-to-cart-crust-select"
            required
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          >
            <option value="" disabled>
              Select a crust
            </option>
            {crusts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">Quantity</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              data-testid="add-to-cart-quantity-decrement"
              qa-data="add-to-cart-quantity-decrement"
              className="h-8 w-8 rounded-full border border-zinc-300 dark:border-zinc-700"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span
              data-testid="add-to-cart-quantity"
              qa-data="add-to-cart-quantity"
              className="w-6 text-center"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              data-testid="add-to-cart-quantity-increment"
              qa-data="add-to-cart-quantity-increment"
              className="h-8 w-8 rounded-full border border-zinc-300 dark:border-zinc-700"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isSubmitting || missingRequiredOptions}
        data-testid="add-to-cart-submit"
        qa-data="add-to-cart-submit"
        className="mt-4 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background disabled:opacity-50"
      >
        {isSubmitting ? "Adding…" : "Add to Cart"}
      </button>
      {missingRequiredOptions && (
        <p
          data-testid="add-to-cart-required-hint"
          qa-data="add-to-cart-required-hint"
          className="mt-2 text-sm text-red-600"
        >
          Please select a size and crust to continue.
        </p>
      )}
    </div>
  );
}
