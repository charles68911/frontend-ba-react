import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { Customer, CustomerInput, CustomerType } from "@/types";

interface CustomerFormProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSubmit: (input: CustomerInput) => void;
}

interface FormValues {
  name: string;
  contactNumber: string;
  email: string;
  address: string;
  type: CustomerType;
  notes: string;
}

interface FormErrors {
  name?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
}

const emptyValues: FormValues = {
  name: "",
  contactNumber: "",
  email: "",
  address: "",
  type: "Restaurant",
  notes: "",
};

const customerTypes: CustomerType[] = [
  "Restaurant",
  "Resort",
  "Wholesale",
  "Retail",
  "Household",
];

export function CustomerForm({
  open,
  customer,
  onClose,
  onSubmit,
}: CustomerFormProps) {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!open) return;

    setValues(
      customer
        ? {
            name: customer.name,
            contactNumber: customer.contactNumber,
            email: customer.email,
            address: customer.address,
            type: customer.type,
            notes: customer.notes,
          }
        : emptyValues,
    );
    setErrors({});
  }, [open, customer]);

  function updateField<K extends keyof FormValues>(
    field: K,
    value: FormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const nextErrors: FormErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = "Customer name is required.";
    }

    if (!values.contactNumber.trim()) {
      nextErrors.contactNumber = "Contact number is required.";
    }

    if (
      values.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.address.trim()) {
      nextErrors.address = "Address is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    onSubmit({
      name: values.name.trim(),
      contactNumber: values.contactNumber.trim(),
      email: values.email.trim(),
      address: values.address.trim(),
      type: values.type,
      notes: values.notes.trim(),
    });
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={customer ? "Edit Customer" : "Add New Customer"}
      description={
        customer
          ? "Update the customer's contact and account details."
          : "Create a customer record for sales and analytics tracking."
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="customer-form">
            {customer ? "Save Changes" : "Add Customer"}
          </Button>
        </>
      }
    >
      <form
        id="customer-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4"
      >
        <Input
          label="Customer / business name"
          placeholder="e.g. Cordova Bay Resort"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          error={errors.name}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Contact number"
            placeholder="+63 9XX XXX XXXX"
            value={values.contactNumber}
            onChange={(event) =>
              updateField("contactNumber", event.target.value)
            }
            error={errors.contactNumber}
          />
          <Input
            label="Email (optional)"
            type="email"
            placeholder="customer@email.com"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            error={errors.email}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Customer type"
            value={values.type}
            onChange={(event) =>
              updateField("type", event.target.value as CustomerType)
            }
          >
            {customerTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>

          <Input
            label="Address"
            placeholder="Barangay, City"
            value={values.address}
            onChange={(event) => updateField("address", event.target.value)}
            error={errors.address}
          />
        </div>

        <Textarea
          label="Notes (optional)"
          placeholder="Delivery preferences, frequent orders, or other reminders..."
          value={values.notes}
          onChange={(event) => updateField("notes", event.target.value)}
        />
      </form>
    </Modal>
  );
}
