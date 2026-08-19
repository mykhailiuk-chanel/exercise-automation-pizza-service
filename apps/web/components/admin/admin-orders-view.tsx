"use client";

import { useEffect, useState } from "react";
import type { AdminOrderSummaryDto, OrderStatus } from "@pizza/shared-types";
import { useRequireAdmin } from "@/components/admin/use-require-admin";
import { AdminNav } from "@/components/admin/admin-nav";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/components/toast-provider";
import {
  deleteAdminOrder,
  deleteAllAdminOrders,
  listAdminOrders,
  updateOrderStatus,
} from "@/lib/admin-client";
import { formatCents } from "@/lib/format";

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export function AdminOrdersView() {
  const { isLoading, isAdmin } = useRequireAdmin();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<AdminOrderSummaryDto[] | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] =
    useState<AdminOrderSummaryDto | null>(null);
  const [confirmingDeleteAll, setConfirmingDeleteAll] = useState(false);

  const load = () => listAdminOrders().then(setOrders);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, status);
      await load();
      showToast("Order status updated");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Couldn't update order status",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    try {
      await deleteAdminOrder(pendingDelete.id);
      await load();
      showToast("Order deleted");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Couldn't delete order");
    } finally {
      setPendingDelete(null);
    }
  }

  async function handleDeleteAll() {
    try {
      await deleteAllAdminOrders();
      await load();
      showToast("All orders deleted");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Couldn't delete all orders",
      );
    } finally {
      setConfirmingDeleteAll(false);
    }
  }

  if (isLoading || !isAdmin) return null;

  return (
    <div data-testid="admin-orders" qa-data="admin-orders" className="mt-8">
      <AdminNav />

      {orders !== null && orders.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setConfirmingDeleteAll(true)}
            data-testid="admin-orders-delete-all"
            qa-data="admin-orders-delete-all"
            className="text-sm font-medium text-red-600 underline underline-offset-4"
          >
            Delete all orders
          </button>
        </div>
      )}

      {orders === null ? (
        <p
          data-testid="admin-orders-loading"
          qa-data="admin-orders-loading"
          className="mt-6"
        >
          Loading…
        </p>
      ) : orders.length === 0 ? (
        <p
          data-testid="admin-orders-empty"
          qa-data="admin-orders-empty"
          className="mt-6 text-zinc-600 dark:text-zinc-400"
        >
          No orders yet.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table
            data-testid="admin-orders-table"
            qa-data="admin-orders-table"
            className="w-full min-w-max text-left text-sm"
          >
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="py-2 pr-4">Order</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Placed</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  data-testid="admin-orders-row"
                  qa-data="admin-orders-row"
                  className="border-b border-zinc-100 dark:border-zinc-900"
                >
                  <td className="py-2 pr-4 font-mono">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="py-2 pr-4">{order.userEmail}</td>
                  <td className="py-2 pr-4 text-zinc-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 pr-4 font-semibold">
                    {formatCents(order.totalCents)}
                  </td>
                  <td className="py-2 pr-4">
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value as OrderStatus,
                        )
                      }
                      data-testid="admin-orders-row-status"
                      qa-data="admin-orders-row-status"
                      className="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700 dark:bg-black"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-4">
                    <button
                      type="button"
                      onClick={() => setPendingDelete(order)}
                      data-testid="admin-orders-row-delete"
                      qa-data="admin-orders-row-delete"
                      className="text-sm font-medium text-red-600 underline underline-offset-4"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete order"
        message={`Delete order #${pendingDelete?.id.slice(0, 8)}? This can't be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <ConfirmDialog
        open={confirmingDeleteAll}
        title="Delete all orders"
        message={`This permanently deletes all ${orders?.length ?? 0} orders and their history. This can't be undone.`}
        onConfirm={handleDeleteAll}
        onCancel={() => setConfirmingDeleteAll(false)}
      />
    </div>
  );
}
