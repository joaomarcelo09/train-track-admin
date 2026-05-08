import { useMemo, useState } from 'react'
import { Button } from './Button'

export type Column<T> = {
  key: string
  header: string
  sortable?: boolean
  render: (item: T) => React.ReactNode
  sortValue?: (item: T) => string | number
}

type DataTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  getRowKey: (item: T) => string | number
  emptyMessage: string
}

const pageSize = 8

export function DataTable<T>({
  data,
  columns,
  getRowKey,
  emptyMessage,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)

  const sortedData = useMemo(() => {
    const column = columns.find((item) => item.key === sortKey)
    if (!column?.sortable) {
      return data
    }

    return [...data].sort((a, b) => {
      const left = column.sortValue?.(a) ?? String(column.render(a))
      const right = column.sortValue?.(b) ?? String(column.render(b))
      const result =
        typeof left === 'number' && typeof right === 'number'
          ? left - right
          : String(left).localeCompare(String(right))

      return direction === 'asc' ? result : -result
    })
  }, [columns, data, direction, sortKey])

  const pageCount = Math.max(1, Math.ceil(sortedData.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageRows = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function handleSort(key: string) {
    setPage(1)
    if (sortKey === key) {
      setDirection((value) => (value === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(key)
    setDirection('asc')
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-100">
            <tr>
              {columns.map((column) => (
                <th
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  key={column.key}
                  scope="col"
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 hover:text-slate-900"
                      onClick={() => handleSort(column.key)}
                    >
                      {column.header}
                      <span aria-hidden="true">
                        {sortKey === column.key ? (direction === 'asc' ? '^' : 'v') : '-'}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {pageRows.map((item) => (
              <tr className="hover:bg-slate-50" key={getRowKey(item)}>
                {columns.map((column) => (
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700" key={column.key}>
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pageRows.length === 0 ? (
        <div className="px-4 py-10 text-center text-sm text-slate-500">{emptyMessage}</div>
      ) : (
        <footer className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {pageRows.length} of {sortedData.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {pageCount}
            </span>
            <Button
              type="button"
              variant="secondary"
              disabled={currentPage === pageCount}
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            >
              Next
            </Button>
          </div>
        </footer>
      )}
    </div>
  )
}
