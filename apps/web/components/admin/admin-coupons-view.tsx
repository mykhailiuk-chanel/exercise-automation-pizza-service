"use client";

import { useEffect, useState } from "react";
import type { CouponDto, CouponInput } from "@pizza/shared-types";
import { useRequireAdmin } from "@/components/admin/use-require-admin";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminTable } from "@/components/admin/admin-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { RequiredMark } from "@/components/required-mark";
import { useToast } from "@/components/toast-provider";
import {
  createAdminCoupon,
  deleteAdminCoupon,
  listAdminCoupons,
  updateAdminCoupon,
} from "@/lib/admin-client";
import { formatCents } from "@/lib/format";

const EMPTY_FORM: CouponInput = {
  code: "",
  type: "percent",
  value: 0,
  minOrderAmountCents: 0,
  maxUses: null,
  expiresAt: null,
  active: true,
};

function toDateInputValue(iso: string | null): string {
  return iso ? iso.slice(0, 10) : "";
}

export function AdminCouponsView() {
  const { isLoading, isAdmin } = useRequireAdmin();
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<CouponDto[] | null>(null);
  const [form, setForm] = useState<CouponInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CouponDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = () => listAdminCoupons().then(setCoupons);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  function startEdit(coupon: CouponDto) {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderAmountCents: coupon.minOrderAmountCents,
      maxUses: coupon.maxUses,
      expiresAt: coupon.expiresAt,
      active: coupon.active,
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
        await updateAdminCoupon(editingId, form);
      } else {
        await createAdminCoupon(form);
      }
      await load();
      showToast(editingId ? "Coupon updated" : "Coupon created");
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save coupon");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    try {
      await deleteAdminCoupon(pendingDelete.id);
      await load();
      showToast("Coupon deleted");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Couldn't delete coupon");
    } finally {
      setPendingDelete(null);
    }
  }

  if (isLoading || !isAdmin) return null;

  return (
    <div data-testid="admin-coupons" qa-data="admin-coupons" className="mt-8">
      <AdminNav />

      {coupons === null ? (
        <p className="mt-6">Loading…</p>
      ) : (
        <div className="mt-6">
          <AdminTable
            testId="admin-coupons-table"
            rows={coupons}
            columns={[
              { key: "code", header: "Code" },
              { key: "type", header: "Type" },
              {
                key: "value",
                header: "Value",
                render: (c) =>
                  c.type === "percent" ? `${c.value}%` : formatCents(c.value),
              },
              {
                key: "usesCount",
                header: "Uses",
                render: (c) => `${c.usesCount}${c.maxUses ? ` / ${c.maxUses}` : ""}`,
              },
              {
                key: "active",
                header: "Active",
                render: (c) => (c.active ? "Yes" : "No"),
              },
            ]}
            onEdit={startEdit}
            onDelete={setPendingDelete}
          />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        data-testid="admin-coupon-form"
        qa-data="admin-coupon-form"
        className="mt-8 flex max-w-md flex-col gap-3"
      >
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit coupon" : "Add a coupon"}
        </h2>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">
            Code
            <RequiredMark />
          </span>
          <input
            required
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            data-testid="admin-coupon-form-code"
            qa-data="admin-coupon-form-code"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">
            Type
            <RequiredMark />
          </span>
          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value as CouponInput["type"],
              })
            }
            data-testid="admin-coupon-form-type"
            qa-data="admin-coupon-form-type"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          >
            <option value="percent">Percent off</option>
            <option value="fixed">Fixed amount off (cents)</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">
            Value
            <RequiredMark />
          </span>
          <input
            type="number"
            required
            min={0}
            value={form.value}
            onChange={(e) =>
              setForm({ ...form, value: Number(e.target.value) })
            }
            data-testid="admin-coupon-form-value"
            qa-data="admin-coupon-form-value"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">
            Minimum order (cents)
          </span>
          <input
            type="number"
            min={0}
            value={form.minOrderAmountCents}
            onChange={(e) =>
              setForm({
                ...form,
                minOrderAmountCents: Number(e.target.value),
              })
            }
            data-testid="admin-coupon-form-min-order"
            qa-data="admin-coupon-form-min-order"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">
            Max uses (blank = unlimited)
          </span>
          <input
            type="number"
            min={1}
            value={form.maxUses ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                maxUses: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            data-testid="admin-coupon-form-max-uses"
            qa-data="admin-coupon-form-max-uses"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">
            Expires (blank = never)
          </span>
          <input
            type="date"
            value={toDateInputValue(form.expiresAt ?? null)}
            onChange={(e) =>
              setForm({
                ...form,
                expiresAt: e.target.value
                  ? new Date(e.target.value).toISOString()
                  : null,
              })
            }
            data-testid="admin-coupon-form-expires-at"
            qa-data="admin-coupon-form-expires-at"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
            data-testid="admin-coupon-form-active"
            qa-data="admin-coupon-form-active"
          />
          Active
        </label>

        {error && (
          <p
            data-testid="admin-coupon-form-error"
            qa-data="admin-coupon-form-error"
            className="text-sm text-red-600"
          >
            {error}
          </p>
        )}

        <div className="mt-2 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            data-testid="admin-coupon-form-submit"
            qa-data="admin-coupon-form-submit"
            className="self-start rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving…"
              : editingId
                ? "Update coupon"
                : "Create coupon"}
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
        title="Delete coupon"
        message={`Delete "${pendingDelete?.code}"? This can't be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
