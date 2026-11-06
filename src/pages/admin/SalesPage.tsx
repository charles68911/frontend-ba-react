
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { SearchInput } from "@/components/common/SearchInput";
import { SectionCard } from "@/components/common/SectionCard";

import { useAppData } from "@/components/context/AppDataContext";

import { SaleDetailsModal } from "@/components/features/sales/SaleDetailsModal";
import { SaleForm } from "@/components/features/sales/SaleForm";
import { SaleHistoryTable } from "@/components/features/sales/SaleHistoryTable";

import { Select } from "@/components/ui/Select";

import type { PaymentStatus, Sale } from "@/types";

const PAGE_SIZE = 8;

export function SalesPage() {
  const { sales } = useAppData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | PaymentStatus
  >("All");

  const [page, setPage] = useState(1);
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);

  // Filter sales and display the lowest sale ID first
  const filteredSales = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sales
      .filter((sale) => {
        const matchesStatus =
          statusFilter === "All" ||
          sale.paymentStatus === statusFilter;

        const matchesSearch =
          !query ||
          sale.id.toLowerCase().includes(query) ||
          sale.customerName.toLowerCase().includes(query) ||
          sale.items.some((item) =>
            item.productName.toLowerCase().includes(query),
          );

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        const idA = Number(a.id.replace(/\D/g, ""));
        const idB = Number(b.id.replace(/\D/g, ""));

        return idA - idB;
      });
  }, [sales, search, statusFilter]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredSales.length / PAGE_SIZE),
  );

  const safePage = Math.min(page, pageCount);

  const paginatedSales = filteredSales.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Management"
        description="Record customer orders and review the complete sales history."
      />

      <SaleForm />

      <SectionCard
        title="Sales History"
        description={`${filteredSales.length} of ${sales.length} sales shown`}
        contentClassName="p-0 sm:p-0"
        action={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search sale ID, customer..."
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
              containerClassName="sm:w-40"
            >
              <option value="All">All status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
            </Select>
          </div>
        }
      >
        {filteredSales.length > 0 ? (
          <>
            <SaleHistoryTable
              sales={paginatedSales}
              onView={setViewingSale}
            />

            <Pagination
              page={safePage}
              pageCount={pageCount}
              totalItems={filteredSales.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              itemLabel="sales"
            />
          </>
        ) : (
          <EmptyState
            title="No sales found"
            description="Try changing the search term or status filter, or record a new sale above."
          />
        )}
      </SectionCard>

      <SaleDetailsModal
        sale={viewingSale}
        onClose={() => setViewingSale(null)}
      />
    </div>
  );
}
