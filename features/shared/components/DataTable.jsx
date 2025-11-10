/**
 * DataTable - Global reusable data table component
 * @module features/shared/components/DataTable
 */
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * DataTable Component
 *
 * A flexible, reusable table component that can display any kind of data
 * with customizable columns and rendering functions.
 *
 * @param {Object} props
 * @param {Array<Object>} props.data - Array of data objects to display
 * @param {Array<Object>} props.columns - Column configuration array
 * @param {string} props.columns[].key - Unique key for the column
 * @param {string} props.columns[].header - Column header text
 * @param {string} [props.columns[].headerClassName] - Optional className for header cell
 * @param {string} [props.columns[].cellClassName] - Optional className for data cells
 * @param {string} [props.columns[].align] - Text alignment: 'left', 'center', 'right' (default: 'left')
 * @param {Function} [props.columns[].render] - Custom render function (row, value) => ReactNode
 * @param {Function} [props.columns[].accessor] - Custom accessor function to get cell value from row
 * @param {string} [props.emptyMessage] - Message to display when no data (default: "No data found")
 * @param {Function} [props.onRowClick] - Optional callback when row is clicked (row, index) => void
 * @param {string} [props.rowClassName] - Optional className for table rows
 * @param {Function} [props.getRowClassName] - Dynamic row className function (row, index) => string
 * @param {string} [props.tableClassName] - Optional className for table wrapper
 * @param {boolean} [props.hoverable] - Enable hover effect on rows (default: true)
 * @param {boolean} [props.striped] - Enable striped rows (default: false)
 *
 * @example
 * const columns = [
 *   {
 *     key: 'name',
 *     header: 'Name',
 *     accessor: (row) => row.firstName + ' ' + row.lastName,
 *   },
 *   {
 *     key: 'email',
 *     header: 'Email',
 *     cellClassName: 'text-muted-foreground',
 *   },
 *   {
 *     key: 'status',
 *     header: 'Status',
 *     align: 'center',
 *     render: (row, value) => <Badge>{value}</Badge>,
 *   },
 *   {
 *     key: 'actions',
 *     header: 'Actions',
 *     align: 'right',
 *     render: (row) => <Button onClick={() => handleEdit(row)}>Edit</Button>,
 *   },
 * ];
 *
 * <DataTable data={users} columns={columns} />
 */
export default function DataTable({
  data = [],
  columns = [],
  emptyMessage = "No data found",
  error = null,
  errorMessage = "Error loading data",
  isPending,
  pendingRows = 5,
  onRowClick,
  rowClassName = "",
  getRowClassName,
  tableClassName = "",
  hoverable = true,
  striped = false,
}) {
  /**
   * Get alignment class based on align prop
   */
  const getAlignClass = (align) => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  /**
   * Get cell value from row data
   */
  const getCellValue = (row, column) => {
    if (column.accessor) {
      return column.accessor(row);
    }
    return row[column.key];
  };

  /**
   * Render cell content
   */
  const renderCell = (row, column) => {
    const value = getCellValue(row, column);

    if (column.render) {
      return column.render(row, value);
    }

    return value;
  };

  /**
   * Get dynamic row className
   */
  const getRowClass = (row, index) => {
    const baseClass = "border-b border-border";
    const hoverClass = hoverable ? "hover:bg-muted/50" : "";
    const stripedClass = striped && index % 2 === 1 ? "bg-muted/20" : "";
    const clickableClass = onRowClick ? "cursor-pointer" : "";
    const customClass = getRowClassName
      ? getRowClassName(row, index)
      : rowClassName;

    return `${baseClass} ${hoverClass} ${stripedClass} ${clickableClass} ${customClass}`.trim();
  };

  return (
    <div className={`w-full overflow-x-auto rounded-lg ${tableClassName}`}>
      <Table className={" "}>
        <TableHeader>
          <TableRow className="border-b border-border">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={`text-foreground ${getAlignClass(column.align)} ${
                  column.headerClassName || ""
                }`}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ? (
            [...Array(pendingRows)].map((_, i) => (
              <TableRow
                key={i}
                className="border-b border-border animate-pulse"
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={`${getAlignClass(column.align)} ${
                      column.cellClassName || ""
                    }`}
                  >
                    <span className="h-6 bg-muted rounded w-2/3 block" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : error ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-red-600 py-8"
              >
                {errorMessage}{" "}
                {typeof error === "string" ? error : error?.message}
              </TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((row, index) => (
              <TableRow
                key={row.id || index}
                className={getRowClass(row, index)}
                onClick={onRowClick ? () => onRowClick(row, index) : undefined}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={`${getAlignClass(column.align)} ${
                      column.cellClassName || ""
                    }`}
                  >
                    {renderCell(row, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-muted-foreground py-8"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
