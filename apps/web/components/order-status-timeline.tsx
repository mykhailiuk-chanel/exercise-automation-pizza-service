import type { OrderDto } from "@pizza/shared-types";

const STAGES: { status: OrderDto["status"]; label: string }[] = [
  { status: "pending", label: "Pending" },
  { status: "confirmed", label: "Confirmed" },
  { status: "preparing", label: "Preparing" },
  { status: "out_for_delivery", label: "Out for delivery" },
  { status: "delivered", label: "Delivered" },
];

export function OrderStatusTimeline({ order }: { order: OrderDto }) {
  if (order.status === "cancelled") {
    return (
      <p
        data-testid="order-status-timeline-cancelled"
        qa-data="order-status-timeline-cancelled"
        className="mt-4 text-sm font-medium text-red-600"
      >
        This order was cancelled.
      </p>
    );
  }

  const historyByStatus = new Map(
    order.statusHistory.map((h) => [h.status, h.changedAt]),
  );
  const currentIndex = STAGES.findIndex((s) => s.status === order.status);

  return (
    <ol
      data-testid="order-status-timeline"
      qa-data="order-status-timeline"
      className="mt-4 flex flex-col gap-3"
    >
      {STAGES.map((stage, i) => {
        const changedAt = historyByStatus.get(stage.status);
        const reached = i <= currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <li
            key={stage.status}
            data-testid="order-status-timeline-stage"
            qa-data="order-status-timeline-stage"
            data-stage-status={stage.status}
            data-stage-reached={reached}
            className="flex items-center gap-3 text-sm"
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                reached
                  ? "bg-foreground text-background"
                  : "border border-zinc-300 text-zinc-400 dark:border-zinc-700"
              }`}
            >
              {reached ? "✓" : ""}
            </span>
            <span
              className={
                isCurrent ? "font-semibold" : reached ? "" : "text-zinc-400"
              }
            >
              {stage.label}
            </span>
            {changedAt && (
              <span className="text-xs text-zinc-500">
                {new Date(changedAt).toLocaleTimeString()}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
