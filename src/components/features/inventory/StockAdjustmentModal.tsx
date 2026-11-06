
import { useEffect, useState, type FormEvent } from "react";
import type { ActionResult } from "@/components/context/AppDataContext";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import type { Product } from "@/types";

interface StockAdjustmentModalProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSubmit: (
    quantity: number,
    reason: string,
  ) => ActionResult | Promise<ActionResult>;
}

export function StockAdjustmentModal({
  open,
  product,
  onClose,
  onSubmit,
}: StockAdjustmentModalProps) {
  const [quantity, setQuantity] = useState("10");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !product) return;

    setQuantity("10");
    setReason("");
    setError("");
  }, [open, product]);

  const parsedQuantity = Number(quantity);
  const previewStock =
    product && Number.isFinite(parsedQuantity)
      ? product.stock + parsedQuantity
      : product?.stock ?? 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!product) return;

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      setError("Enter a valid quantity greater than zero.");
      return;
    }

    if (!reason.trim()) {
      setError("Please provide a reason for adding stock.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await onSubmit(parsedQuantity, reason.trim());

      if (!result.success) {
        setError(result.message ?? "Unable to add stock.");
        return;
      }

      onClose();
    } catch (error) {
      console.error("Failed to add stock:", error);
      setError("Something went wrong while adding stock.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      open={open && Boolean(product)}
      onClose={onClose}
      title="Add Stock"
      description={
        product
          ? `${product.name} · current stock ${product.stock} ${product.unit}`
          : undefined
      }
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            type="submit"
            form="stock-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Stock"}
          </Button>
        </>
      }
    >
      <form
        id="stock-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4"
      >
        {error && <Alert tone="error">{error}</Alert>}

        <Input
          label={`Quantity to add (${product?.unit ?? "unit"})`}
          type="number"
          min="1"
          step="1"
          value={quantity}
          onChange={(event) => {
            setQuantity(event.target.value);
            setError("");
          }}
        />

        <div className="grid grid-cols-2 gap-3 rounded-md bg-neutral-50 p-4 text-sm">
          <div>
            <p className="text-xs text-neutral-500">Current stock</p>
            <p className="mt-0.5 font-semibold text-neutral-800">
              {product?.stock ?? 0} {product?.unit}
            </p>
          </div>

          <div>
            <p className="text-xs text-neutral-500">New stock</p>
            <p className="mt-0.5 font-semibold text-brand">
              {Number.isFinite(previewStock) ? previewStock : 0}{" "}
              {product?.unit}
            </p>
          </div>
        </div>

        <Textarea
          label="Reason"
          placeholder="e.g. New supplier delivery or stock replenishment"
          value={reason}
          onChange={(event) => {
            setReason(event.target.value);
            setError("");
          }}
        />
      </form>
    </Modal>
  );
}
