import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export interface TableColumn<T> {
  /** Unique key for the column */
  key: string;
  /** Header text to display */
  header: string;
  /** Function to render the cell content */
  render: (item: T, index: number) => React.ReactNode;
  /** Optional custom className for the column cells */
  cellClassName?: string;
  /** Optional custom className for the header cell */
  headerClassName?: string;
}

interface ReusableTableProps<T> {
  /** Array of data to display in the table */
  data: T[];
  /** Column configuration */
  columns: TableColumn<T>[];
  /** Optional message to show when there's no data */
  emptyMessage?: string;
  /** Optional className for the table container */
  containerClassName?: string;
  /** Optional function to get unique key for each row */
  getRowKey?: (item: T, index: number) => string | number;
}

export function TableModal<T>({
  data,
  columns,
  emptyMessage = "No data available",
  containerClassName = "",
  getRowKey
}: ReusableTableProps<T>) {
  return (
    <div className={containerClassName}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.headerClassName}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-8 text-gray-500"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => {
              const rowKey = getRowKey
                ? getRowKey(item, index)
                : (item as any).id || `row-${index}`;
              return (
                <TableRow key={rowKey}>
                  {columns.map((column) => (
                    <TableCell
                      // IMPORTANT: Key should combine the row's unique identity + column key
                      key={`${rowKey}-${column.key}`}
                      className={column.cellClassName}
                    >
                      {column.render(item, index)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
