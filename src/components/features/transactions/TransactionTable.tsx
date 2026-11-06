import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { getPaymentStatusTone } from "@/lib/status";
import type { Transaction } from "@/types";

interface TransactionTableProps {
  transactions: Transaction[];
  onView: (transaction: Transaction) => void;
}

export function TransactionTable({
  transactions,
  onView,
}: TransactionTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Transaction</TableHeader>
          <TableHeader>Customer</TableHeader>
          <TableHeader>Date</TableHeader>
          <TableHeader>Amount</TableHeader>
          <TableHeader>Payment method</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader className="text-right">Details</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>
              <p className="font-medium whitespace-nowrap text-brand">
                {transaction.id}
              </p>
              <p className="text-xs text-neutral-500">
                {transaction.referenceNo}
              </p>
            </TableCell>
            <TableCell>
              <p className="max-w-48 truncate font-medium text-neutral-800">
                {transaction.customerName}
              </p>
              <p className="text-xs text-neutral-500">
                Sale {transaction.saleId}
              </p>
            </TableCell>
            <TableCell className="whitespace-nowrap text-neutral-500">
              {formatDateTime(transaction.date)}
            </TableCell>
            <TableCell className="font-semibold whitespace-nowrap text-neutral-800">
              {formatCurrency(transaction.amount)}
            </TableCell>
            <TableCell className="whitespace-nowrap text-neutral-600">
              {transaction.paymentMethod}
            </TableCell>
            <TableCell>
              <Badge tone={getPaymentStatusTone(transaction.paymentStatus)}>
                {transaction.paymentStatus}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onView(transaction)}
                  className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                  aria-label={`View transaction ${transaction.id}`}
                  title="View transaction details"
                >
                  View
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
