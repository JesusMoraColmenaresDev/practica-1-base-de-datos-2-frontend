import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExcelRow } from "@/lib/api";

interface ExcelTableProps {
  columns: string[];
  rows: ExcelRow[];
}

export function ExcelTable({ columns, rows }: ExcelTableProps) {
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col} className="truncate">
              {col}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={i}>
            {columns.map((col) => (
              <TableCell key={col} className="truncate">
                {row[col] ?? "—"}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
