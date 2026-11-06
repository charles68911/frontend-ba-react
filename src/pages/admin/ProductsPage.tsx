
import { useMemo, useState } from "react";

import { Alert } from "@/components/common/Alert";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { SectionCard } from "@/components/common/SectionCard";
import { useAppData } from "@/components/context/AppDataContext";
import { ProductForm } from "@/components/features/products/ProductForm";
import { ProductTable } from "@/components/features/products/ProductTable";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

import type {
  Product,
  ProductCategory,
  ProductInput,
} from "@/types";

type StockFilter = "All" | "In stock" | "Low stock" | "Out of stock";

const categories: ProductCategory[] = [
  "Fish",
  "Shellfish",
  "Crustaceans",
  "Processed",
  "Others",
];

export function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } =
    useAppData();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "All" | ProductCategory
  >("All");
  const [stockFilter, setStockFilter] = useState<StockFilter>("All");

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [notice, setNotice] = useState("");
  const [noticeTone, setNoticeTone] = useState<"success" | "error">(
    "success",
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        categoryFilter === "All" || product.category === categoryFilter;

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "Out of stock" && product.stock <= 0) ||
        (stockFilter === "Low stock" &&
          product.stock > 0 &&
          product.stock <= product.reorderPoint) ||
        (stockFilter === "In stock" &&
          product.stock > product.reorderPoint);

      return matchesCategory && matchesSearch && matchesStock;
    });
  }, [products, search, categoryFilter, stockFilter]);

  function openAddForm() {
    setNotice("");
    setEditingProduct(null);
    setFormOpen(true);
  }

  function openEditForm(product: Product) {
    setNotice("");
    setEditingProduct(product);
    setFormOpen(true);
  }

  async function handleSubmit(input: ProductInput) {
    const result = editingProduct
      ? await updateProduct(editingProduct.id, input)
      : await addProduct(input);

    setNotice(
      result.message ??
        (result.success
          ? "Product saved successfully!"
          : "Failed to save product."),
    );

    setNoticeTone(result.success ? "success" : "error");

    if (result.success) {
      setEditingProduct(null);
    }

    return result;
  }

  async function handleDelete() {
    if (!deleteTarget || isDeleting) return;

    setIsDeleting(true);
    setNotice("");

    try {
      const result = await deleteProduct(deleteTarget.id);

      setNotice(
        result.message ??
          (result.success
            ? "Product deleted successfully!"
            : "Failed to delete product."),
      );

      setNoticeTone(result.success ? "success" : "error");

      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Management"
        description="Manage seafood products, prices, stock levels, and reorder points."
        action={
          <Button onClick={openAddForm}>
            Add Product
          </Button>
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
        title="Product Catalog"
        description={`${filteredProducts.length} of ${products.length} products shown`}
        contentClassName="p-0 sm:p-0"
        action={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search products..."
              className="sm:w-52"
            />

            <Select
              aria-label="Filter by category"
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value as "All" | ProductCategory,
                )
              }
              containerClassName="sm:w-36"
            >
              <option value="All">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>

            <Select
              aria-label="Filter by stock status"
              value={stockFilter}
              onChange={(event) =>
                setStockFilter(event.target.value as StockFilter)
              }
              containerClassName="sm:w-36"
            >
              <option value="All">All stock</option>
              <option value="In stock">In stock</option>
              <option value="Low stock">Low stock</option>
              <option value="Out of stock">Out of stock</option>
            </Select>
          </div>
        }
      >
        {filteredProducts.length > 0 ? (
          <ProductTable
            products={filteredProducts}
            onEdit={openEditForm}
            onDelete={setDeleteTarget}
          />
        ) : (
          <EmptyState
            title="No products found"
            description="Try changing the search term or filters, or add a new product."
            action={
              <Button onClick={openAddForm}>
                Add Product
              </Button>
            }
          />
        )}
      </SectionCard>

      <ProductForm
        open={formOpen}
        product={editingProduct}
        onClose={() => {
          setFormOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => {
          if (!isDeleting) {
            setDeleteTarget(null);
          }
        }}
        onConfirm={handleDelete}
        title="Delete product?"
        description={
          deleteTarget
            ? `This will permanently remove ${deleteTarget.name} and its inventory record. Products with existing sales records cannot be deleted.`
            : ""
        }
      />
    </div>
  );
}
