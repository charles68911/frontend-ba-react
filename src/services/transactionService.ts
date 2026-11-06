
import api from "@/lib/axios";
import type {
  PaymentMethod,
  PaymentStatus,
  Transaction,
} from "@/types";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type BackendTransaction = {
  id: number;
  saleId: number;
  customerId: number | null;
  customerName: string | null;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  amountPaid: number | string;
  transactionDate: string;
};

export interface RecordPaymentInput {
  saleId: string;
  paymentMethod: PaymentMethod;
  amountPaid: number;
}

export interface RecordPaymentResult {
  transaction: {
    id: number;
    saleId: number;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    amountPaid: string;
    transactionDate: string;
  };
  paymentSummary: {
    saleId: number;
    totalAmount: number;
    previousAmountPaid: number;
    currentPayment: number;
    totalPaid: number;
    remainingBalance: number;
    paymentStatus: PaymentStatus;
  };
}

export const transactionService = {
  // Get all transactions
  async getAll(): Promise<Transaction[]> {
    const { data } = await api.get<ApiResponse<BackendTransaction[]>>(
      "/transactions",
    );

    return data.data.map((transaction): Transaction => ({
      id: String(transaction.id),
      saleId: String(transaction.saleId),
      customerId: String(transaction.customerId ?? ""),
      customerName: transaction.customerName ?? "Unknown Customer",
      date: transaction.transactionDate,
      amount: Number(transaction.amountPaid),
      paymentMethod: transaction.paymentMethod,
      paymentStatus: transaction.paymentStatus,
      referenceNo: `TRX-${transaction.id}`,
    }));
  },

  // Record an additional payment for an existing sale
  async recordPayment(
    input: RecordPaymentInput,
  ): Promise<RecordPaymentResult> {
    const { data } = await api.post<
      ApiResponse<RecordPaymentResult>
    >("/transactions/payment", {
      saleId: Number(input.saleId),
      paymentMethod: input.paymentMethod,
      amountPaid: input.amountPaid,
    });

    return data.data;
  },

  // Update transaction payment status
  async updatePaymentStatus(
    id: string,
    paymentStatus: PaymentStatus,
  ): Promise<BackendTransaction> {
    const { data } = await api.patch<ApiResponse<BackendTransaction>>(
      `/transactions/${id}/status`,
      { paymentStatus },
    );

    return data.data;
  },
};
