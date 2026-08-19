"use client";

import { useEffect, useState } from "react";
import type { ToppingDto, ToppingInput } from "@pizza/shared-types";
import { useRequireAdmin } from "@/components/admin/use-require-admin";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminTable } from "@/components/admin/admin-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { RequiredMark } from "@/components/required-mark";
import { useToast } from "@/components/toast-provider";
import {
  createAdminTopping,
  deleteAdminTopping,
  listAdminToppings,
  updateAdminTopping,
} from "@/lib/admin-client";
import { formatCents } from "@/lib/format";

const CATEGORIES: ToppingDto["category"][] = [
  "meat",
  "veggie",
  "cheese",
  "sauce",
];

const EMPTY_FORM: ToppingInput = {
  name: "",
  category: "veggie",
  priceModifierCents: 0,
  available: true,
};

export function AdminToppingsView() {
  const { isLoading, isAdmin } = useRequireAdmin();
  const { showToast } = useToast();
  const [toppings, setToppings] = useState<ToppingDto[] | null>(null);
  const [form, setForm] = useState<ToppingInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ToppingDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = () => listAdminToppings().then(setToppings);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  function startEdit(topping: ToppingDto) {
    setEditingId(topping.id);
    setForm({
      name: topping.name,
      category: topping.category,
      priceModifierCents: topping.priceModifierCents,
      available: topping.available,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateAdminTopping(editingId, form);
      } else {
        await createAdminTopping(form);
      }
      await load();
      showToast(editingId ? "Topping updated" : "Topping created");
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save topping");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    try {
      await deleteAdminTopping(pendingDelete.id);
      await load();
      showToast("Topping deleted");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Couldn't delete topping",
      );
    } finally {
      setPendingDelete(null);
    }
  }

  if (isLoading || !isAdmin) return null;

  return (
    <div data-testid="admin-toppings" qa-data="admin-toppings" className="mt-8">
      <AdminNav />

      {toppings === null ? (
        <p className="mt-6">Loading…</p>
      ) : (
        <div className="mt-6">
          <AdminTable
            testId="admin-toppings-table"
            rows={toppings}
            columns={[
              { key: "name", header: "Name" },
              { key: "category", header: "Category" },
              {
                key: "priceModifierCents",
                header: "Price modifier",
                render: (t) => formatCents(t.priceModifierCents),
              },
              {
                key: "available",
                header: "Available",
                render: (t) => (t.available ? "Yes" : "No"),
              },
            ]}
            onEdit={startEdit}
            onDelete={setPendingDelete}
          />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        data-testid="admin-topping-form"
        qa-data="admin-topping-form"
        className="mt-8 flex max-w-md flex-col gap-3"
      >
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit topping" : "Add a topping"}
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
            data-testid="admin-topping-form-name"
            qa-data="admin-topping-form-name"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">
            Category
            <RequiredMark />
          </span>
          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value as ToppingDto["category"],
              })
            }
            data-testid="admin-topping-form-category"
            qa-data="admin-topping-form-category"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">
            Price modifier (cents)
          </span>
          <input
            type="number"
            min={0}
            value={form.priceModifierCents}
            onChange={(e) =>
              setForm({
                ...form,
                priceModifierCents: Number(e.target.value),
              })
            }
            data-testid="admin-topping-form-price"
            qa-data="admin-topping-form-price"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) =>
              setForm({ ...form, available: e.target.checked })
            }
            data-testid="admin-topping-form-available"
            qa-data="admin-topping-form-available"
          />
          Available
        </label>

        {error && (
          <p
            data-testid="admin-topping-form-error"
            qa-data="admin-topping-form-error"
            className="text-sm text-red-600"
          >
            {error}
          </p>
        )}

        <div className="mt-2 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            data-testid="admin-topping-form-submit"
            qa-data="admin-topping-form-submit"
            className="self-start rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving…"
              : editingId
                ? "Update topping"
                : "Create topping"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="self-start text-sm font-medium underline underline-offset-4"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete topping"
        message={`Delete "${pendingDelete?.name}"? This can't be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
