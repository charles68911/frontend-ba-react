
import { useState, type FormEvent } from "react";

import { Alert } from "@/components/common/Alert";
import { SectionCard } from "@/components/common/SectionCard";
import { useAppData } from "@/components/context/AppDataContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatCurrency } from "@/lib/format";

import type { PaymentMethod } from "@/types";

const paymentMethods: PaymentMethod[] = [
  "Cash",
  "GCash",
  "Bank Transfer",
  "Credit",
];

export function SaleForm() {
  const { customers, products, createSale } = useAppData();

  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Cash");
  const [amountPaid, setAmountPaid] = useState("0");

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProduct = products.find(
    (product) => product.id === productId,
  );

  const parsedQuantity = Number(quantity);
  const parsedAmountPaid = Number(amountPaid);

  const totalAmount =
    selectedProduct &&
    Number.isInteger(parsedQuantity) &&
    parsedQuantity > 0
      ? selectedProduct.price * parsedQuantity
      : 0;

  const remainingBalance = Math.max(
    0,
    totalAmount - (Number.isFinite(parsedAmountPaid) ? parsedAmountPaid : 0),
  );

  function resetForm() {
    setCustomerId("");
    setProductId("");
    setQuantity("1");
    setPaymentMethod("Cash");
    setAmountPaid("0");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");
    setNotice("");

    if (!customerId) {
      setError("Please select a customer.");
      return;
    }

    if (!selectedProduct) {
      setError("Please select a product.");
      return;
    }

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      setError("Enter a valid whole-number quantity.");
      return;
    }

    if (parsedQuantity > selectedProduct.stock) {
      setError(
        `Only ${selectedProduct.stock} ${selectedProduct.unit} of ${selectedProduct.name} are available.`,
      );
      return;
    }

    if (
      !Number.isFinite(parsedAmountPaid) ||
      parsedAmountPaid < 0
    ) {
      setError("Enter a valid initial payment amount.");
      return;
    }

    if (parsedAmountPaid > totalAmount) {
      setError(
        "The initial payment cannot exceed the total sale amount.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createSale({
        customerId,
        productId,
        quantity: parsedQuantity,
        paymentMethod,
        amountPaid: parsedAmountPaid,
      });

      if (!result.success) {
        setError(
          result.message ?? "Unable to record this sale.",
        );
        return;
      }

      setNotice("Sale recorded successfully!");
      resetForm();
    } catch (error) {
      console.error("Failed to submit sale:", error);
      setError(
        "Something went wrong while recording the sale.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SectionCard
      title="Create a Sale"
      description="Select one customer and one product, then record the sale and initial payment."
      contentClassName="p-5"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <Alert tone="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {notice && (
          <Alert tone="success" onClose={() => setNotice("")}>
            {notice}
          </Alert>
        )}

        <Select
          label="Customer"
          value={customerId}
          onChange={(event) => setCustomerId(event.target.value)}
          hint="Customers are managed from the Customer Management page."
        >
          <option value="">Select an existing customer</option>

          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} · {customer.type}
            </option>
          ))}
        </Select>

        <Select
          label="Product"
          value={productId}
          onChange={(event) => setProductId(event.target.value)}
        >
          <option value="">Select a product</option>

          {products.map((product) => (
            <option
              key={product.id}
              value={product.id}
              disabled={product.stock <= 0}
            >
              {product.name} · {formatCurrency(product.price)}/{product.unit} ·
              stock {product.stock}
            </option>
          ))}
        </Select>

        <Input
          label="Quantity"
          type="number"
          min="1"
          step="1"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          placeholder="Enter quantity"
        />

        {selectedProduct && (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-sm font-semibold text-neutral-700">
              Product information
            </p>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-neutral-500">Unit price</p>
                <p className="font-semibold text-neutral-800">
                  {formatCurrency(selectedProduct.price)}
                </p>
              </div>

              <div>
                <p className="text-xs text-neutral-500">Available stock</p>
                <p className="font-semibold text-neutral-800">
                  {selectedProduct.stock} {selectedProduct.unit}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Payment method"
            value={paymentMethod}
            onChange={(event) =>
              setPaymentMethod(
                event.target.value as PaymentMethod,
              )
            }
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </Select>

          <Input
            label="Initial payment amount"
            type="number"
            min="0"
            step="0.01"
            value={amountPaid}
            onChange={(event) =>
              setAmountPaid(event.target.value)
            }
            placeholder="Enter amount paid"
          />
        </div>

        <div className="rounded-xl border border-neutral-200 p-4">
          <h3 className="text-sm font-semibold text-neutral-700">
            Payment summary
          </h3>

          <div className="mt-3 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-neutral-500">
                Total amount
              </span>
              <span className="font-semibold text-neutral-800">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-neutral-500">
                Initial payment
              </span>
              <span className="font-semibold text-neutral-800">
                {formatCurrency(
                  Number.isFinite(parsedAmountPaid)
                    ? parsedAmountPaid
                    : 0,
                )}
              </span>
            </div>

            <div className="flex justify-between gap-3 border-t border-neutral-100 pt-3">
              <span className="font-medium text-neutral-700">
                Remaining balance
              </span>
              <span className="font-bold text-neutral-900">
                {formatCurrency(remainingBalance)}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-neutral-500">
                Payment status
              </span>
              <span className="font-semibold text-neutral-800">
                {parsedAmountPaid <= 0
                  ? "Pending"
                  : parsedAmountPaid >= totalAmount &&
                      totalAmount > 0
                    ? "Paid"
                    : "Partial"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-500">
            Saving deducts the product stock and creates the sale
            and initial payment record.
          </p>

          <Button
            type="submit"
            size="lg"
            disabled={
              isSubmitting ||
              !customerId ||
              !productId ||
              totalAmount <= 0 ||
              parsedAmountPaid < 0 ||
              parsedAmountPaid > totalAmount ||
              parsedQuantity > (selectedProduct?.stock ?? 0)
            }
          >
            {isSubmitting ? "Recording..." : "Record Sale"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
