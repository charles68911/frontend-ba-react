import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
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
import type { Sale, Transaction } from "@/types";

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  sale: Sale | null;
  onClose: () => void;
  onMarkPaid: (transaction: Transaction) => void;
}

export function TransactionDetailsModal({
  transaction,
  sale,
  onClose,
  onMarkPaid,
}: TransactionDetailsModalProps) {
  const canMarkPaid =
    transaction &&
    (transaction.paymentStatus === "Pending" ||
      transaction.paymentStatus === "Partial");

  return (
    <Modal
      open={Boolean(transaction)}
      onClose={onClose}
      title={transaction ? `Transaction ${transaction.id}` : "Transaction"}
      description={transaction ? formatDateTime(transaction.date) : undefined}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {transaction && canMarkPaid && (
            <Button onClick={() => onMarkPaid(transaction)}>
              Mark as Paid
            </Button>
          )}
        </>
      }
    >
      {transaction && (
        <div className="space-y-5">
          <div className="grid gap-4 rounded-md bg-neutral-50 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-neutral-500">Reference number</p>
              <p className="mt-0.5 font-medium text-neutral-800">
                {transaction.referenceNo}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Related sale</p>
              <p className="mt-0.5 font-medium text-neutral-800">
                {transaction.saleId}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Customer</p>
              <p className="mt-0.5 font-medium text-neutral-800">
                {transaction.customerName}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Payment</p>
              <p className="mt-0.5 flex flex-wrap items-center gap-2 font-medium text-neutral-800">
                {transaction.paymentMethod}
                <Badge tone={getPaymentStatusTone(transaction.paymentStatus)}>
                  {transaction.paymentStatus}
                </Badge>
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Amount</p>
              <p className="mt-0.5 text-lg font-bold text-brand">
                {formatCurrency(transaction.amount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Date recorded</p>
              <p className="mt-0.5 font-medium text-neutral-800">
                {formatDateTime(transaction.date)}
              </p>
            </div>
          </div>

          {sale ? (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-neutral-700">
                Products in this transaction
              </h3>
              <div className="overflow-hidden rounded-md border border-neutral-200">
                <Table className="min-w-[440px]">
                  <TableHead>
                    <TableRow>
                      <TableHeader>Product</TableHeader>
                      <TableHeader>Qty</TableHeader>
                      <TableHeader>Unit price</TableHeader>
                      <TableHeader className="text-right">Subtotal</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sale.items.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell className="font-medium text-neutral-800">
                          {item.productName}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right font-semibold whitespace-nowrap">
                          {formatCurrency(item.subtotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <p className="rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
              The original sale record is no longer available, but this
              transaction history is preserved.
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}
