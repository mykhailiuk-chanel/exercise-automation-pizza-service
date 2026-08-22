export interface AdminTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

export function AdminTable<T extends { id: string }>({
  columns,
  rows,
  onEdit,
  onDelete,
  testId,
}: {
  columns: AdminTableColumn<T>[];
  rows: T[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  testId: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table
        data-testid={testId}
        qa-data={testId}
        className="w-full min-w-max text-left text-sm"
      >
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-800">
            {columns.map((col) => (
              <th
                key={col.key}
                data-testid={`${testId}-header-${col.key}`}
                qa-data={`${testId}-header-${col.key}`}
                className="py-2 pr-4"
              >
                {col.header}
              </th>
            ))}
            <th className="py-2 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              data-testid={`${testId}-row`}
              qa-data={`${testId}-row`}
              className="border-b border-zinc-100 dark:border-zinc-900"
            >
              {columns.map((col) => (
                <td key={col.key} className="py-2 pr-4">
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
              <td className="flex gap-3 py-2 pr-4">
                <button
                  type="button"
                  onClick={() => onEdit(row)}
                  data-testid={`${testId}-row-edit`}
                  qa-data={`${testId}-row-edit`}
                  className="text-sm font-medium underline underline-offset-4"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(row)}
                  data-testid={`${testId}-row-delete`}
                  qa-data={`${testId}-row-delete`}
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
  );
}
