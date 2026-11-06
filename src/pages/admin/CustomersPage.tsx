
import { useMemo, useState } from "react";
import { Alert } from "@/components/common/Alert";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { SectionCard } from "@/components/common/SectionCard";
import { useAppData } from "@/components/context/AppDataContext";
import { CustomerForm } from "@/components/features/customers/CustomerForm";
import { CustomerTable } from "@/components/features/customers/CustomerTable";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import type { Customer, CustomerInput, CustomerType } from "@/types";

export function CustomersPage() {
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  } = useAppData();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | CustomerType>("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [notice, setNotice] = useState("");
  const [noticeTone, setNoticeTone] = useState<"success" | "error">("success");

  // Filter and sort customers by ID in ascending order.
  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers
      .filter((customer) => {
        const matchesType =
          typeFilter === "All" || customer.type === typeFilter;

        const matchesSearch =
          !query ||
          customer.name.toLowerCase().includes(query) ||
          customer.contactNumber.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.address.toLowerCase().includes(query);

        return matchesType && matchesSearch;
      })
      .sort((a, b) => Number(a.id) - Number(b.id));
  }, [customers, search, typeFilter]);

  function openAddForm() {
    setEditingCustomer(null);
    setFormOpen(true);
  }

  function openEditForm(customer: Customer) {
    setEditingCustomer(customer);
    setFormOpen(true);
  }

  async function handleSubmit(input: CustomerInput) {
    const result = editingCustomer
      ? await updateCustomer(editingCustomer.id, input)
      : await addCustomer(input);

    setNoticeTone(result.success ? "success" : "error");
    setNotice(
      result.message ??
        (result.success
          ? "Customer saved successfully."
          : "Failed to save customer."),
    );

    if (result.success) {
      setFormOpen(false);
      setEditingCustomer(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    const customer = deleteTarget;
    const result = await deleteCustomer(customer.id);

    setNoticeTone(result.success ? "success" : "error");
    setNotice(
      result.message ??
        (result.success
          ? `${customer.name} was removed from the customer list.`
          : `Failed to remove ${customer.name}.`),
    );

    if (result.success) {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Management"
        description="Keep customer contact details and purchasing relationships in one place."
        action={
          <Button onClick={openAddForm}>Add Customer</Button>
        }
      />

      {notice && (
        <Alert
          tone={noticeTone}
          onClose={() => setNotice("")}
        >
          {notice}
        </Alert>
      )}

      <SectionCard
        title="Customer Directory"
        description={`${filteredCustomers.length} of ${customers.length} customers shown`}
        contentClassName="p-0 sm:p-0"
        action={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search customers..."
              className="sm:w-56"
            />

            <Select
              aria-label="Filter customers by type"
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value as "All" | CustomerType)
              }
              containerClassName="sm:w-40"
            >
              <option value="All">All types</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Resort">Resort</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Retail">Retail</option>
              <option value="Household">Household</option>
            </Select>
          </div>
        }
      >
        {filteredCustomers.length > 0 ? (
          <CustomerTable
            customers={filteredCustomers}
            onEdit={openEditForm}
            onDelete={setDeleteTarget}
          />
        ) : (
          <EmptyState
            title="No customers found"
            description="Try a different search term or add a new customer record."
            action={<Button onClick={openAddForm}>Add Customer</Button>}
          />
        )}
      </SectionCard>

      <CustomerForm
        open={formOpen}
        customer={editingCustomer}
        onClose={() => {
          setFormOpen(false);
          setEditingCustomer(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete customer?"
        description={
          deleteTarget
            ? `This will permanently delete ${deleteTarget.name} if they have no existing sales records. Customers with existing sales cannot be deleted.`
            : ""
        }
      />
    </div>
  );
}
