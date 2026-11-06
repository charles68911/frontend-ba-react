
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { SearchInput } from "@/components/common/SearchInput";
import { SectionCard } from "@/components/common/SectionCard";
import { StatCard } from "@/components/common/StatCard";
import { useAppData } from "@/components/context/AppDataContext";
import { getTransactionSummary } from "@/components/features/analytics/analyticsUtils";
import { TransactionDetailsModal } from "@/components/features/transactions/TransactionDetailsModal";
import { TransactionTable } from "@/components/features/transactions/TransactionTable";
import { Select } from "@/components/ui/Select";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";

import type {
  PaymentMethod,
  PaymentStatus,
  Transaction,
} from "@/types";

const PAGE_SIZE = 10;

export function TransactionsPage() {
  const {
    transactions,
    sales,
    updateTransactionStatus,
  } = useAppData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | PaymentStatus
  >("All");
  const [methodFilter, setMethodFilter] = useState<
    "All" | PaymentMethod
  >("All");
  const [page, setPage] = useState(1);

  const [viewingTransaction, setViewingTransaction] =
    useState<Transaction | null>(null);

  const [actionMessage, setActionMessage] = useState("");

  // Calculate transaction summary and actual outstanding balances.
  const summary = useMemo(
    () => getTransactionSummary(transactions, sales),
    [transactions, sales],
  );

  // Total money actually collected.
  // Includes both Paid and Partial payment transactions.
  const totalCollected = transactions
    .filter(
      (transaction) =>
        transaction.paymentStatus === "Paid" ||
        transaction.paymentStatus === "Partial",
    )
    .reduce(
      (total, transaction) => total + transaction.amount,
      0,
    );

  // Total amount recorded as refunded.
  const totalRefunded = transactions
    .filter(
      (transaction) =>
        transaction.paymentStatus === "Refunded",
    )
    .reduce(
      (total, transaction) => total + transaction.amount,
      0,
    );

  // Filter transactions.
  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions
      .filter((transaction) => {
        const matchesStatus =
          statusFilter === "All" ||
          transaction.paymentStatus === statusFilter;

        const matchesMethod =
          methodFilter === "All" ||
          transaction.paymentMethod === methodFilter;

        const matchesSearch =
          !query ||
          transaction.id.toLowerCase().includes(query) ||
          transaction.saleId.toLowerCase().includes(query) ||
          transaction.referenceNo.toLowerCase().includes(query) ||
          transaction.customerName.toLowerCase().includes(query);

        return (
          matchesStatus &&
          matchesMethod &&
          matchesSearch
        );
      })
      .sort((a, b) => {
        const idA = Number(a.id.replace(/\D/g, ""));
        const idB = Number(b.id.replace(/\D/g, ""));

        return idA - idB;
      });
  }, [
    transactions,
    search,
    statusFilter,
    methodFilter,
  ]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredTransactions.length / PAGE_SIZE),
  );

  const safePage = Math.min(page, pageCount);

  const paginatedTransactions = filteredTransactions.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, methodFilter]);

  // Always get the latest sale associated with the selected transaction.
  const viewingSale = viewingTransaction
    ? sales.find(
        (sale) => sale.id === viewingTransaction.saleId,
      ) ?? null
    : null;

  // Always get the latest transaction from context.
  const currentViewingTransaction = viewingTransaction
    ? transactions.find(
        (transaction) =>
          transaction.id === viewingTransaction.id,
      ) ?? viewingTransaction
    : null;

  async function handleMarkPaid(transaction: Transaction) {
    setActionMessage("");

    const result = await updateTransactionStatus(
      transaction.id,
      "Paid",
    );

    if (!result.success) {
      setActionMessage(
        result.message ?? "Failed to update payment status.",
      );
      return;
    }

    setActionMessage(
      "Payment status updated successfully!",
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transaction Management"
        description="Review payment records, references, and transaction details."
      />

      {actionMessage && (
        <p
          role="status"
          className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700"
        >
          {actionMessage}
        </p>
      )}

      {/* TRANSACTION SUMMARY */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Collected"
          value={formatCompactCurrency(totalCollected)}
          helper="Money received from customers"
        />

        <StatCard
          title="Outstanding"
          value={formatCompactCurrency(summary.outstanding)}
          helper={`${summary.pending} pending · ${summary.partial} partial`}
        />

        <StatCard
          title="Transactions"
          value={String(transactions.length)}
          helper="All recorded payment records"
        />

        <StatCard
          title="Refunded"
          value={formatCompactCurrency(totalRefunded)}
          helper={`${summary.refunded} refunded transactions`}
        />
      </div>

      {/* TRANSACTION TABLE */}
      <SectionCard
        title="Transaction Records"
        description={`${filteredTransactions.length} of ${transactions.length} transactions shown`}
        contentClassName="p-0 sm:p-0"
        action={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search transaction, customer..."
              className="sm:w-60"
            />

            <Select
              aria-label="Filter by payment status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as "All" | PaymentStatus,
                )
              }
              containerClassName="sm:w-36"
            >
              <option value="All">All status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
            </Select>

            <Select
              aria-label="Filter by payment method"
              value={methodFilter}
              onChange={(event) =>
                setMethodFilter(
                  event.target.value as "All" | PaymentMethod,
                )
              }
              containerClassName="sm:w-40"
            >
              <option value="All">All methods</option>
              <option value="Cash">Cash</option>
              <option value="GCash">GCash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Credit">Credit</option>
            </Select>
          </div>
        }
      >
        {filteredTransactions.length > 0 ? (
          <>
            <TransactionTable
              transactions={paginatedTransactions}
              onView={setViewingTransaction}
            />

            <Pagination
              page={safePage}
              pageCount={pageCount}
              totalItems={filteredTransactions.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              itemLabel="transactions"
            />
          </>
        ) : (
          <EmptyState
            title="No transactions found"
            description="Try changing the search term, status, or payment method filter."
          />
        )}
      </SectionCard>

      {/* TRANSACTION DETAILS */}
      <TransactionDetailsModal
        transaction={currentViewingTransaction}
        sale={viewingSale}
        onClose={() => setViewingTransaction(null)}
        onMarkPaid={handleMarkPaid}
      />

      <p className="text-xs text-neutral-500">
        Outstanding amount includes the remaining balances of
        pending and partially paid sales. Current outstanding
        balance:{" "}
        <span className="font-semibold text-neutral-700">
          {formatCurrency(summary.outstanding)}
        </span>
        .
      </p>
    </div>
  );
}
