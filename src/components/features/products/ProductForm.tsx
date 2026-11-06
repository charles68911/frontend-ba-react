
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { ActionResult } from "@/components/context/AppDataContext";
import type {
  Product,
  ProductCategory,
  ProductInput,
} from "@/types";

interface ProductFormProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSubmit: (input: ProductInput) => Promise<ActionResult>;
}

interface FormValues {
  name: string;
  category: ProductCategory;
  unit: Product["unit"];
  price: string;
  cost: string;
  stock: string;
  reorderPoint: string;
  description: string;
}

const emptyValues: FormValues = {
  name: "",
  category: "Fish",
  unit: "kg",
  price: "",
  cost: "",
  stock: "0",
  reorderPoint: "10",
  description: "",
};

const categories: ProductCategory[] = [
  "Fish",
  "Shellfish",
  "Crustaceans",
  "Processed",
  "Others",
];

const units: Product["unit"][] = ["kg", "pack", "piece"];

function toFormValues(product: Product): FormValues {
  return {
    name: product.name,
    category: product.category,
    unit: product.unit,
    price: String(product.price),
    cost: String(product.cost),
    stock: String(product.stock),
    reorderPoint: String(product.reorderPoint),
    description: product.description,
  };
}

export function ProductForm({
  open,
  product,
  onClose,
  onSubmit,
}: ProductFormProps) {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    setValues(product ? toFormValues(product) : emptyValues);
    setErrors({});
    setIsSubmitting(false);
  }, [open, product]);

  function updateField<K extends keyof FormValues>(
    field: K,
    value: FormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function validate() {
    const nextErrors: Record<string, string> = {};

    const price = Number(values.price);
    const cost = Number(values.cost);
    const stock = Number(values.stock);
    const reorderPoint = Number(values.reorderPoint);

    if (!values.name.trim()) {
      nextErrors.name = "Product name is required.";
    }

    if (!Number.isFinite(price) || price <= 0) {
      nextErrors.price = "Enter a selling price greater than zero.";
    }

    if (!Number.isFinite(cost) || cost < 0) {
      nextErrors.cost = "Enter a valid cost price.";
    }

    if (!Number.isInteger(stock) || stock < 0) {
      nextErrors.stock =
        "Stock must be a whole number and cannot be negative.";
    }

    if (!Number.isInteger(reorderPoint) || reorderPoint < 0) {
      nextErrors.reorderPoint =
        "Reorder point must be a whole number and cannot be negative.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || !validate()) return;

    setIsSubmitting(true);

    try {
      const result = await onSubmit({
        name: values.name.trim(),
        category: values.category,
        unit: values.unit,
        price: Number(values.price),
        cost: Number(values.cost),
        stock: Number(values.stock),
        reorderPoint: Number(values.reorderPoint),
        supplier: "",
        description: values.description.trim(),
      });

      if (result.success) {
        onClose();
      } else {
        setErrors((current) => ({
          ...current,
          submit: result.message || "Unable to save the product.",
        }));
      }
    } catch {
      setErrors((current) => ({
        ...current,
        submit: "Something went wrong. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={product ? "Edit Product" : "Add New Product"}
      description={
        product
          ? "Update pricing, stock details, and reorder settings."
          : "Add a seafood product to the catalog and inventory."
      }
      size="lg"
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="product-form"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : product
                ? "Save Changes"
                : "Add Product"}
          </Button>
        </>
      }
    >
      <form
        id="product-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4"
      >
        {errors.submit && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {errors.submit}
          </p>
        )}

        <Input
          label="Product name"
          placeholder="e.g. Fresh Tanigue"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          error={errors.name}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Category"
            value={values.category}
            onChange={(event) =>
              updateField("category", event.target.value as ProductCategory)
            }
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>

          <Select
            label="Selling unit"
            value={values.unit}
            onChange={(event) =>
              updateField("unit", event.target.value as Product["unit"])
            }
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Selling price (₱)"
            type="number"
            min="0"
            step="0.01"
            value={values.price}
            onChange={(event) => updateField("price", event.target.value)}
            error={errors.price}
          />

          <Input
            label="Cost price (₱)"
            type="number"
            min="0"
            step="0.01"
            value={values.cost}
            onChange={(event) => updateField("cost", event.target.value)}
            error={errors.cost}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Available stock"
            type="number"
            min="0"
            step="1"
            value={values.stock}
            onChange={(event) => updateField("stock", event.target.value)}
            error={errors.stock}
          />

          <Input
            label="Reorder point"
            type="number"
            min="0"
            step="1"
            value={values.reorderPoint}
            onChange={(event) =>
              updateField("reorderPoint", event.target.value)
            }
            error={errors.reorderPoint}
            hint="Minimum stock level before restocking is needed."
          />
        </div>

        <Textarea
          label="Description (optional)"
          placeholder="Product details, origin, or handling notes..."
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
        />
      </form>
    </Modal>
  );
}
