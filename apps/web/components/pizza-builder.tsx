"use client";

import { useMemo, useState } from "react";
import type {
  CrustDto,
  ProductDto,
  SizeDto,
  ToppingDto,
} from "@pizza/shared-types";
import { formatCents } from "@/lib/format";
import { addCartItem } from "@/lib/cart-client";
import { useToast } from "@/components/toast-provider";

const TOPPING_CATEGORY_LABELS: Record<ToppingDto["category"], string> = {
  meat: "Meat",
  veggie: "Veggie",
  cheese: "Cheese",
  sauce: "Sauce",
};

export function PizzaBuilder({
  product,
  sizes,
  crusts,
  toppings,
}: {
  product: ProductDto;
  sizes: SizeDto[];
  crusts: CrustDto[];
  toppings: ToppingDto[];
}) {
  const { showToast } = useToast();
  const [sizeId, setSizeId] = useState(sizes[0]?.id ?? "");
  const [crustId, setCrustId] = useState(crusts[0]?.id ?? "");
  const [selectedToppingIds, setSelectedToppingIds] = useState<string[]>(
    product.defaultToppingIds,
  );
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const size = sizes.find((s) => s.id === sizeId);
  const crust = crusts.find((c) => c.id === crustId);
  const selectedToppings = useMemo(
    () => toppings.filter((t) => selectedToppingIds.includes(t.id)),
    [toppings, selectedToppingIds],
  );
  const trayToppings = useMemo(
    () => toppings.filter((t) => !selectedToppingIds.includes(t.id)),
    [toppings, selectedToppingIds],
  );

  const unitPriceCents =
    product.basePriceCents +
    (size?.priceModifierCents ?? 0) +
    (crust?.priceModifierCents ?? 0) +
    selectedToppings.reduce((sum, t) => sum + t.priceModifierCents, 0);
  const totalCents = unitPriceCents * quantity;

  function addTopping(toppingId: string) {
    setSelectedToppingIds((prev) =>
      prev.includes(toppingId) ? prev : [...prev, toppingId],
    );
  }

  function removeTopping(toppingId: string) {
    setSelectedToppingIds((prev) => prev.filter((id) => id !== toppingId));
  }

  async function handleAddToCart() {
    setIsSubmitting(true);
    try {
      await addCartItem({
        productId: product.id,
        sizeId,
        crustId,
        toppingIds: selectedToppingIds,
        quantity,
      });
      showToast("Added to cart!");
    } catch {
      showToast("Couldn't add to cart — please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const toppingsByCategory = useMemo(() => {
    const groups = new Map<ToppingDto["category"], ToppingDto[]>();
    for (const topping of trayToppings) {
      const group = groups.get(topping.category) ?? [];
      group.push(topping);
      groups.set(topping.category, group);
    }
    return groups;
  }, [trayToppings]);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <fieldset>
          <legend className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Size
          </legend>
          <div
            data-testid="pizza-builder-size-options"
            qa-data="pizza-builder-size-options"
            className="mt-2 flex flex-wrap gap-2"
          >
            {sizes.map((s) => (
              <label
                key={s.id}
                data-testid="pizza-builder-size-option"
                qa-data="pizza-builder-size-option"
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm ${
                  s.id === sizeId
                    ? "border-transparent bg-foreground text-background"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
              >
                <input
                  type="radio"
                  name="size"
                  value={s.id}
                  checked={s.id === sizeId}
                  onChange={() => setSizeId(s.id)}
                  data-testid="pizza-builder-size-radio"
                  qa-data="pizza-builder-size-radio"
                  className="sr-only"
                />
                {s.name}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Crust
          </legend>
          <div
            data-testid="pizza-builder-crust-options"
            qa-data="pizza-builder-crust-options"
            className="mt-2 flex flex-wrap gap-2"
          >
            {crusts.map((c) => (
              <label
                key={c.id}
                data-testid="pizza-builder-crust-option"
                qa-data="pizza-builder-crust-option"
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm ${
                  c.id === crustId
                    ? "border-transparent bg-foreground text-background"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
              >
                <input
                  type="radio"
                  name="crust"
                  value={c.id}
                  checked={c.id === crustId}
                  onChange={() => setCrustId(c.id)}
                  data-testid="pizza-builder-crust-radio"
                  qa-data="pizza-builder-crust-radio"
                  className="sr-only"
                />
                {c.name}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Toppings — drag onto the pizza, or use the + button
          </h2>
          {[...toppingsByCategory.entries()].map(([category, items]) => (
            <div key={category} className="mt-3">
              <h3 className="text-xs font-medium text-zinc-500">
                {TOPPING_CATEGORY_LABELS[category]}
              </h3>
              <ul
                data-testid="pizza-builder-topping-tray"
                qa-data="pizza-builder-topping-tray"
                className="mt-1 flex flex-wrap gap-2"
              >
                {items.map((topping) => (
                  <li key={topping.id}>
                    <button
                      type="button"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", topping.id);
                        e.dataTransfer.effectAllowed = "copy";
                      }}
                      onClick={() => addTopping(topping.id)}
                      data-testid="pizza-builder-tray-topping"
                      qa-data="pizza-builder-tray-topping"
                      data-topping-id={topping.id}
                      className="cursor-grab rounded-full border border-zinc-300 px-3 py-1 text-sm active:cursor-grabbing dark:border-zinc-700"
                    >
                      + {topping.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div
          data-testid="pizza-builder-canvas"
          qa-data="pizza-builder-canvas"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const toppingId = e.dataTransfer.getData("text/plain");
            if (toppingId) addTopping(toppingId);
          }}
          className={`flex min-h-64 flex-col items-center justify-center rounded-full border-4 border-dashed p-8 text-center transition-colors ${
            dragOver
              ? "border-amber-500 bg-amber-50 dark:bg-amber-950"
              : "border-zinc-300 dark:border-zinc-700"
          }`}
        >
          {selectedToppings.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Drop toppings here to build your pizza
            </p>
          ) : (
            <ul
              data-testid="pizza-builder-selected-toppings"
              qa-data="pizza-builder-selected-toppings"
              className="flex flex-wrap justify-center gap-2"
            >
              {selectedToppings.map((topping) => (
                <li key={topping.id}>
                  <button
                    type="button"
                    onClick={() => removeTopping(topping.id)}
                    data-testid="pizza-builder-selected-topping-remove"
                    qa-data="pizza-builder-selected-topping-remove"
                    data-topping-id={topping.id}
                    className="rounded-full bg-foreground px-3 py-1 text-sm text-background"
                  >
                    {topping.name} ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <span className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Quantity
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              data-testid="pizza-builder-quantity-decrement"
              qa-data="pizza-builder-quantity-decrement"
              className="h-8 w-8 rounded-full border border-zinc-300 dark:border-zinc-700"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span
              data-testid="pizza-builder-quantity"
              qa-data="pizza-builder-quantity"
              className="w-6 text-center"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              data-testid="pizza-builder-quantity-increment"
              qa-data="pizza-builder-quantity-increment"
              className="h-8 w-8 rounded-full border border-zinc-300 dark:border-zinc-700"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <p
          data-testid="pizza-builder-price"
          qa-data="pizza-builder-price"
          className="mt-6 text-2xl font-bold"
        >
          {formatCents(totalCents)}
        </p>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isSubmitting || !sizeId || !crustId}
          data-testid="pizza-builder-add-to-cart"
          qa-data="pizza-builder-add-to-cart"
          className="mt-4 w-full rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background disabled:opacity-50"
        >
          {isSubmitting ? "Adding…" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
