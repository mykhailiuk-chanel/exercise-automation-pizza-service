"use client";

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div
      data-testid="admin-confirm-dialog"
      qa-data="admin-confirm-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div className="w-full max-w-sm rounded-lg bg-background p-6 shadow-lg">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            data-testid="admin-confirm-dialog-cancel"
            qa-data="admin-confirm-dialog-cancel"
            className="text-sm font-medium underline underline-offset-4"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            data-testid="admin-confirm-dialog-confirm"
            qa-data="admin-confirm-dialog-confirm"
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
