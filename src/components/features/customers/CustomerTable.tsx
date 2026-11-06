import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { formatDate } from "@/lib/format";
import type { Customer } from "@/types";

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function CustomerTable({
  customers,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Customer</TableHeader>
          <TableHeader>Type</TableHeader>
          <TableHeader>Contact</TableHeader>
          <TableHeader>Address</TableHeader>
          <TableHeader>Since</TableHeader>
          <TableHeader className="text-right">Actions</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell>
              <p className="font-medium text-neutral-800">{customer.name}</p>
              <p className="mt-0.5 text-xs text-neutral-500">{customer.id}</p>
            </TableCell>
            <TableCell>
              <Badge>{customer.type}</Badge>
            </TableCell>
            <TableCell>
              <p className="whitespace-nowrap text-neutral-800">
                {customer.contactNumber}
              </p>
              {customer.email && (
                <p className="mt-0.5 max-w-44 truncate text-xs text-neutral-500">
                  {customer.email}
                </p>
              )}
            </TableCell>
            <TableCell>
              <span className="line-clamp-2 max-w-52 text-neutral-600">
                {customer.address}
              </span>
            </TableCell>
            <TableCell className="whitespace-nowrap text-neutral-500">
              {formatDate(customer.createdAt)}
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(customer)}
                  className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                  aria-label={`Edit ${customer.name}`}
                  title="Edit customer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(customer)}
                  className="text-sm font-medium text-red-600 transition-colors hover:text-red-700 hover:underline"
                  aria-label={`Delete ${customer.name}`}
                  title="Delete customer"
                >
                  Delete
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
