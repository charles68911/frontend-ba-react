
import api from "@/lib/axios";
import type { Product, StockMovement } from "@/types";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type BackendInventory = {
  id: number;
  productId: number;
  productName: string | null;
  category: Product["category"] | null;
  currentStock: number;
  reorderLevel: number;
  lastUpdated: string;
};

export const inventoryService = {
  // Get all inventory records
  async getAll(): Promise<BackendInventory[]> {
    const { data } = await api.get<ApiResponse<BackendInventory[]>>(
      "/inventory"
    );

    return data.data;
  },

  // Get stock movement history
  async getMovements(): Promise<StockMovement[]> {
    return [];
  },

  // Add stock
  async addStock(
    productId: string,
    quantity: number,
    reason: string
  ): Promise<BackendInventory> {
    const { data } = await api.post<ApiResponse<BackendInventory>>(
      `/inventory/${productId}/stock-in`,
      { quantity, reason }
    );

    return data.data;
  },

  // Adjust stock
  async adjustStock(
    productId: string,
    newQuantity: number,
    reason: string
  ): Promise<BackendInventory> {
    const { data } = await api.patch<ApiResponse<BackendInventory>>(
      `/inventory/${productId}/adjust`,
      { newQuantity, reason }
    );

    return data.data;
  },
};
