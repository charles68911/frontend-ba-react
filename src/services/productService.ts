
import api from "@/lib/axios";
import type { Product, ProductInput } from "@/types";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type BackendProduct = {
  id: number;
  productName: string;
  category: Product["category"];
  unitPrice: number | string;
  costPrice: number | string;
  createdAt: string;
};

type BackendInventory = {
  id: number;
  productId: number;
  currentStock: number;
  reorderLevel: number;
  lastUpdated: string;
};

type ProductMutationResponse = {
  product: BackendProduct;
  inventory: BackendInventory;
};

// CONVERT BACKEND DATA TO FRONTEND PRODUCT
function mapProduct(
  product: BackendProduct,
  inventory: BackendInventory,
): Product {
  return {
    id: String(product.id),
    name: product.productName,
    category: product.category,
    unit: "kg",
    price: Number(product.unitPrice),
    cost: Number(product.costPrice),
    stock: inventory.currentStock,
    reorderPoint: inventory.reorderLevel,
    supplier: "",
    description: "",
    createdAt: product.createdAt,
  };
}

// PRODUCT SERVICE
export const productService = {
  // GET ALL PRODUCTS
  async getAll(): Promise<Product[]> {
    const [productResponse, inventoryResponse] = await Promise.all([
      api.get<ApiResponse<BackendProduct[]>>("/products"),
      api.get<ApiResponse<BackendInventory[]>>("/inventory"),
    ]);

    const inventoryByProductId = new Map(
      inventoryResponse.data.data.map((item) => [
        item.productId,
        item,
      ]),
    );

    return productResponse.data.data.map((product) => {
      const inventory = inventoryByProductId.get(product.id);

      return mapProduct(
        product,
        inventory ?? {
          id: 0,
          productId: product.id,
          currentStock: 0,
          reorderLevel: 0,
          lastUpdated: product.createdAt,
        },
      );
    });
  },

  // CREATE PRODUCT
  async create(input: ProductInput): Promise<Product> {
    const { data } = await api.post<
      ApiResponse<ProductMutationResponse>
    >("/products", input);

    return mapProduct(data.data.product, data.data.inventory);
  },

  // UPDATE PRODUCT
  async update(
    id: string,
    input: ProductInput,
  ): Promise<Product> {
    const { data } = await api.put<
      ApiResponse<ProductMutationResponse>
    >(`/products/${id}`, input);

    return mapProduct(data.data.product, data.data.inventory);
  },

  // DELETE PRODUCT
  async remove(id: string): Promise<void> {
    // Let Axios throw if the backend returns an error (such as HTTP 409).
    // The product should only be removed from frontend state after success.
    await api.delete(`/products/${id}`);
  },
};
