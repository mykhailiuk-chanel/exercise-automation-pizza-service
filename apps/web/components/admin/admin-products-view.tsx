"use client";

import { useEffect, useState } from "react";
import type {
  CategoryDto,
  ProductDto,
  ProductInput,
  ToppingDto,
} from "@pizza/shared-types";
import { useRequireAdmin } from "@/components/admin/use-require-admin";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminTable } from "@/components/admin/admin-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { RequiredMark } from "@/components/required-mark";
import { useToast } from "@/components/toast-provider";
import { getCategories } from "@/lib/api-client";
import {
  createAdminProduct,
  deleteAdminProduct,
  listAdminProducts,
  listAdminToppings,
  updateAdminProduct,
} from "@/lib/admin-client";
import { formatCents } from "@/lib/format";

const EMPTY_FORM: ProductInput = {
  slug: "",
  name: "",
  description: "",
  basePriceCents: 0,
  categoryId: "",
  imageUrl: "",
  isBuildYourOwnBase: false,
  available: true,
  defaultToppingIds: [],
};

export function AdminProductsView() {
  const { isLoading, isAdmin } = useRequireAdmin();
  const { showToast } = useToast();
  const [products, setProducts] = useState<ProductDto[] | null>(null);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [toppings, setToppings] = useState<ToppingDto[]>([]);
  const [form, setForm] = useState<ProductInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ProductDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = () => listAdminProducts().then(setProducts);

  useEffect(() => {
    if (isAdmin) {
      load();
      getCategories().then(setCategories);
      listAdminToppings().then(setToppings);
    }
  }, [isAdmin]);

  function startEdit(product: ProductDto) {
    setEditingId(product.id);
    setForm({
      slug: product.slug,
      name: product.name,
      description: product.description,
      basePriceCents: product.basePriceCents,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl,
      isBuildYourOwnBase: product.isBuildYourOwnBase,
      available: product.available,
      defaultToppingIds: product.defaultToppingIds,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function toggleDefaultTopping(toppingId: string) {
    const current = form.defaultToppingIds ?? [];
    setForm({
      ...form,
      defaultToppingIds: current.includes(toppingId)
        ? current.filter((id) => id !== toppingId)
        : [...current, toppingId],
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateAdminProduct(editingId, form);
      } else {
        await createAdminProduct(form);
      }
      await load();
      showToast(editingId ? "Product updated" : "Product created");
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save product");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    try {
      await deleteAdminProduct(pendingDelete.id);
      await load();
      showToast("Product deleted");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Couldn't delete product",
      );
    } finally {
      setPendingDelete(null);
    }
  }

  if (isLoading || !isAdmin) return null;

  return (
    <div data-testid="admin-products" qa-data="admin-products" className="mt-8">
      <AdminNav />

      {products === null ? (
        <p className="mt-6">Loading…</p>
      ) : (
        <div className="mt-6">
          <AdminTable
            testId="admin-products-table"
            rows={products}
            columns={[
              { key: "name", header: "Name" },
              { key: "slug", header: "Slug" },
              {
                key: "basePriceCents",
                header: "Base price",
                render: (p) => formatCents(p.basePriceCents),
              },
              {
                key: "available",
                header: "Available",
                render: (p) => (p.available ? "Yes" : "No"),
              },
            ]}
            onEdit={startEdit}
            onDelete={setPendingDelete}
          />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        data-testid="admin-product-form"
        qa-data="admin-product-form"
        className="mt-8 flex max-w-md flex-col gap-3"
      >
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit product" : "Add a product"}
        </h2>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">
            Name
            <RequiredMark />
          </span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            data-testid="admin-product-form-name"
            qa-data="admin-product-form-name"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">
            Slug
            <RequiredMark />
          </span>
          <input
            required
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            data-testid="admin-product-form-slug"
            qa-data="admin-product-form-slug"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">
            Description
            <RequiredMark />
          </span>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            data-testid="admin-product-form-description"
            qa-data="admin-product-form-description"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">
            Base price (cents)
            <RequiredMark />
          </span>
          <input
            type="number"
            required
            min={0}
            value={form.basePriceCents}
            onChange={(e) =>
              setForm({ ...form, basePriceCents: Number(e.target.value) })
            }
            data-testid="admin-product-form-price"
            qa-data="admin-product-form-price"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">
            Category
            <RequiredMark />
          </span>
          <select
            required
            value={form.categoryId}
            onChange={(e) =>
              setForm({ ...form, categoryId: e.target.value })
            }
            data-testid="admin-product-form-category"
            qa-data="admin-product-form-category"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">
            Image URL
            <RequiredMark />
          </span>
          <input
            required
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            data-testid="admin-product-form-image-url"
            qa-data="admin-product-form-image-url"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          />
        </label>
        <fieldset className="flex flex-col gap-1 text-sm">
          <legend className="font-medium text-zinc-500">
            Default toppings
          </legend>
          <div
            data-testid="admin-product-form-default-toppings"
            qa-data="admin-product-form-default-toppings"
            className="flex max-h-40 flex-col gap-1 overflow-y-auto rounded border border-zinc-300 p-2 dark:border-zinc-700"
          >
            {toppings.map((topping) => (
              <label key={topping.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(form.defaultToppingIds ?? []).includes(
                    topping.id,
                  )}
                  onChange={() => toggleDefaultTopping(topping.id)}
                  data-testid="admin-product-form-default-topping"
                  qa-data="admin-product-form-default-topping"
                />
                {topping.name}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isBuildYourOwnBase}
            onChange={(e) =>
              setForm({ ...form, isBuildYourOwnBase: e.target.checked })
            }
            data-testid="admin-product-form-is-byo-base"
            qa-data="admin-product-form-is-byo-base"
          />
          Build-your-own base
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) =>
              setForm({ ...form, available: e.target.checked })
            }
            data-testid="admin-product-form-available"
            qa-data="admin-product-form-available"
          />
          Available
        </label>

        {error && (
          <p
            data-testid="admin-product-form-error"
            qa-data="admin-product-form-error"
            className="text-sm text-red-600"
          >
            {error}
          </p>
        )}

        <div className="mt-2 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            data-testid="admin-product-form-submit"
            qa-data="admin-product-form-submit"
            className="self-start rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving…"
              : editingId
                ? "Update product"
                : "Create product"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              data-testid="admin-product-form-cancel"
              qa-data="admin-product-form-cancel"
              className="self-start text-sm font-medium underline underline-offset-4"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete product"
        message={`Delete "${pendingDelete?.name}"? This can't be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
