"use client";

import { useEffect, useState } from "react";
import type { CrustDto, CrustInput } from "@pizza/shared-types";
import { useRequireAdmin } from "@/components/admin/use-require-admin";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminTable } from "@/components/admin/admin-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { RequiredMark } from "@/components/required-mark";
import { useToast } from "@/components/toast-provider";
import {
  createAdminCrust,
  deleteAdminCrust,
  listAdminCrusts,
  updateAdminCrust,
} from "@/lib/admin-client";
import { formatCents } from "@/lib/format";

const EMPTY_FORM: CrustInput = {
  name: "",
  priceModifierCents: 0,
  sortOrder: 0,
};

export function AdminCrustsView() {
  const { isLoading, isAdmin } = useRequireAdmin();
  const { showToast } = useToast();
  const [crusts, setCrusts] = useState<CrustDto[] | null>(null);
  const [form, setForm] = useState<CrustInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CrustDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = () => listAdminCrusts().then(setCrusts);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  function startEdit(crust: CrustDto) {
    setEditingId(crust.id);
    setForm({
      name: crust.name,
      priceModifierCents: crust.priceModifierCents,
      sortOrder: crust.sortOrder,
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
        await updateAdminCrust(editingId, form);
      } else {
        await createAdminCrust(form);
      }
      await load();
      showToast(editingId ? "Crust updated" : "Crust created");
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save crust");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    try {
      await deleteAdminCrust(pendingDelete.id);
      await load();
      showToast("Crust deleted");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Couldn't delete crust");
    } finally {
      setPendingDelete(null);
    }
  }

  if (isLoading || !isAdmin) return null;

  return (
    <div data-testid="admin-crusts" qa-data="admin-crusts" className="mt-8">
      <AdminNav />

      {crusts === null ? (
        <p className="mt-6">Loading…</p>
      ) : (
        <div className="mt-6">
          <AdminTable
            testId="admin-crusts-table"
            rows={crusts}
            columns={[
              { key: "name", header: "Name" },
              {
                key: "priceModifierCents",
                header: "Price modifier",
                render: (c) => formatCents(c.priceModifierCents),
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
        data-testid="admin-crust-form"
        qa-data="admin-crust-form"
        className="mt-8 flex max-w-md flex-col gap-3"
      >
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit crust" : "Add a crust"}
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
            data-testid="admin-crust-form-name"
            qa-data="admin-crust-form-name"
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
            data-testid="admin-crust-form-price"
            qa-data="admin-crust-form-price"
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
            data-testid="admin-crust-form-sort-order"
            qa-data="admin-crust-form-sort-order"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          />
        </label>

        {error && (
          <p
            data-testid="admin-crust-form-error"
            qa-data="admin-crust-form-error"
            className="text-sm text-red-600"
          >
            {error}
          </p>
        )}

        <div className="mt-2 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            data-testid="admin-crust-form-submit"
            qa-data="admin-crust-form-submit"
            className="self-start rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving…"
              : editingId
                ? "Update crust"
                : "Create crust"}
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
        title="Delete crust"
        message={`Delete "${pendingDelete?.name}"? This can't be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
