"use client";

import { useEffect, useState } from "react";
import type { SizeDto, SizeInput } from "@pizza/shared-types";
import { useRequireAdmin } from "@/components/admin/use-require-admin";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminTable } from "@/components/admin/admin-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { RequiredMark } from "@/components/required-mark";
import { useToast } from "@/components/toast-provider";
import {
  createAdminSize,
  deleteAdminSize,
  listAdminSizes,
  updateAdminSize,
} from "@/lib/admin-client";
import { formatCents } from "@/lib/format";

const EMPTY_FORM: SizeInput = {
  name: "",
  priceModifierCents: 0,
  sortOrder: 0,
};

export function AdminSizesView() {
  const { isLoading, isAdmin } = useRequireAdmin();
  const { showToast } = useToast();
  const [sizes, setSizes] = useState<SizeDto[] | null>(null);
  const [form, setForm] = useState<SizeInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SizeDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = () => listAdminSizes().then(setSizes);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  function startEdit(size: SizeDto) {
    setEditingId(size.id);
    setForm({
      name: size.name,
      priceModifierCents: size.priceModifierCents,
      sortOrder: size.sortOrder,
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
        await updateAdminSize(editingId, form);
      } else {
        await createAdminSize(form);
      }
      await load();
      showToast(editingId ? "Size updated" : "Size created");
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save size");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    try {
      await deleteAdminSize(pendingDelete.id);
      await load();
      showToast("Size deleted");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Couldn't delete size");
    } finally {
      setPendingDelete(null);
    }
  }

  if (isLoading || !isAdmin) return null;

  return (
    <div data-testid="admin-sizes" qa-data="admin-sizes" className="mt-8">
      <AdminNav />

      {sizes === null ? (
        <p className="mt-6">Loading…</p>
      ) : (
        <div className="mt-6">
          <AdminTable
            testId="admin-sizes-table"
            rows={sizes}
            columns={[
              { key: "name", header: "Name" },
              {
                key: "priceModifierCents",
                header: "Price modifier",
                render: (s) => formatCents(s.priceModifierCents),
              },
              { key: "sortOrder", header: "Sort order" },
            ]}
            onEdit={startEdit}
            onDelete={setPendingDelete}
          />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        data-testid="admin-size-form"
        qa-data="admin-size-form"
        className="mt-8 flex max-w-md flex-col gap-3"
      >
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit size" : "Add a size"}
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
            data-testid="admin-size-form-name"
            qa-data="admin-size-form-name"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          />
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
            data-testid="admin-size-form-price"
            qa-data="admin-size-form-price"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">Sort order</span>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) =>
              setForm({ ...form, sortOrder: Number(e.target.value) })
            }
            data-testid="admin-size-form-sort-order"
            qa-data="admin-size-form-sort-order"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          />
        </label>

        {error && (
          <p
            data-testid="admin-size-form-error"
            qa-data="admin-size-form-error"
            className="text-sm text-red-600"
          >
            {error}
          </p>
        )}

        <div className="mt-2 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            data-testid="admin-size-form-submit"
            qa-data="admin-size-form-submit"
            className="self-start rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            {isSubmitting ? "Saving…" : editingId ? "Update size" : "Create size"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              data-testid="admin-size-form-cancel"
              qa-data="admin-size-form-cancel"
              className="self-start text-sm font-medium underline underline-offset-4"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete size"
        message={`Delete "${pendingDelete?.name}"? This can't be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
