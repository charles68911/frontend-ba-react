
export type ProductCategory =
  | "Fish"
  | "Shellfish"
  | "Crustaceans"
  | "Processed"
  | "Others";

export type CustomerType =
  | "Restaurant"
  | "Resort"
  | "Wholesale"
  | "Retail"
  | "Household";

export type PaymentMethod = "Cash" | "GCash" | "Bank Transfer" | "Credit";

export type PaymentStatus = "Paid" | "Pending" | "Partial" | "Refunded";

export type StockMovementType = "Stock In" | "Stock Out" | "Adjustment";

export type UserRole = "Administrator" | "Staff";

// AUTHENTICATION

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface LoginResult {
  success: boolean;
  message?: string;
}

// CUSTOMERS

export interface Customer {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  address: string;
  type: CustomerType;
  notes: string;
  createdAt: string;
}

export type CustomerInput = Omit<Customer, "id" | "createdAt">;

// PRODUCTS

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unit: "kg" | "pack" | "piece";
  price: number;
  cost: number;
  stock: number;
  reorderPoint: number;
  supplier: string;
  description: string;
  createdAt: string;
}

export type ProductInput = Omit<Product, "id" | "createdAt">;

// SALES

export interface SaleItem {
  productId: string;
  productName: string;
  unit: Product["unit"];
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  items: SaleItem[];
  totalAmount: number;
  amountPaid: number;
  remainingBalance: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes: string;
}

export interface SaleItemInput {
  productId: string;
  quantity: number;
}

export interface CreateSaleInput {
  customerId: string;
  productId: string;
  quantity: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
}

// TRANSACTIONS

export interface Transaction {
  id: string;
  saleId: string;
  customerId: string;
  customerName: string;
  date: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  referenceNo: string;
}

// INVENTORY

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: StockMovementType;
  quantity: number;
  unit: Product["unit"];
  reason: string;
  date: string;
  reference: string;
}

// ANALYTICS

export interface ProductPerformance {
  productId: string;
  productName: string;
  category: ProductCategory;
  unitsSold: number;
  revenue: number;
}

export interface CustomerPerformance {
  customerId: string;
  customerName: string;
  orders: number;
  totalSpent: number;
  lastPurchase: string;
  averageOrder: number;
}

export interface DailySalesPoint {
  date: string;
  label: string;
  sales: number;
  transactions: number;
}

export interface MonthlySalesPoint {
  month: string;
  label: string;
  sales: number;
  transactions: number;
}

export interface DemandForecast {
  productId: string;
  productName: string;
  unit: Product["unit"];
  averageDailyDemand: number;
  forecast7Days: number;
  forecast30Days: number;
  currentStock: number;
  daysOfStock: number;
}

export interface RestockRecommendation {
  product: Product;
  forecast30Days: number;
  suggestedQuantity: number;
  daysOfStock: number;
  priority: "High" | "Medium" | "Low";
  reason: string;
}
