
import api from "@/lib/axios";
import type { Sale, CreateSaleInput } from "@/types";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type BackendSale = {
  id: number;
  customerId: number;
  customerName: string | null;
  productId: number;
  productName: string | null;
  unitPrice: number | string | null;
  quantity: number;
  totalAmount: number | string;
  amountPaid: number | string;
  remainingBalance: number | string;
  saleDate: string;
  createdAt: string;
  paymentMethod: Sale["paymentMethod"] | null;
  paymentStatus: Sale["paymentStatus"] | null;
};

type CreateSaleResponse = {
  sales: {
    id: number;
    customerId: number;
    productId: number;
    quantity: number;
    totalAmount: string;
    saleDate: string;
  }[];
  transaction: {
    id: number;
    saleId: number;
    paymentMethod: string;
    paymentStatus: string;
    amountPaid: string;
  };
  paymentSummary?: {
    totalAmount: number;
    amountPaid: number;
    remainingBalance: number;
    paymentStatus: Sale["paymentStatus"];
  };
};

export const saleService = {
  // Get all sales
  async getAll(): Promise<Sale[]> {
    const { data } = await api.get<ApiResponse<BackendSale[]>>(
      "/sales",
    );

    return data.data.map((sale): Sale => ({
      id: String(sale.id),
      customerId: String(sale.customerId),
      customerName: sale.customerName ?? "Unknown Customer",
      date: sale.saleDate,

      items: [
        {
          productId: String(sale.productId),
          productName: sale.productName ?? "Unknown Product",
          unit: "kg",
          quantity: Number(sale.quantity),
          unitPrice: Number(sale.unitPrice ?? 0),
          subtotal: Number(sale.totalAmount),
        },
      ],

      totalAmount: Number(sale.totalAmount),
      amountPaid: Number(sale.amountPaid ?? 0),
      remainingBalance: Number(sale.remainingBalance ?? 0),

      paymentMethod: sale.paymentMethod ?? "Cash",
      paymentStatus: sale.paymentStatus ?? "Pending",
      notes: "",
    }));
  },

  // Create a sale with its initial payment
  async create(
    input: CreateSaleInput,
  ): Promise<ApiResponse<CreateSaleResponse>> {
    const { data } = await api.post<
      ApiResponse<CreateSaleResponse>
    >("/sales", input);

    return data;
  },
};
