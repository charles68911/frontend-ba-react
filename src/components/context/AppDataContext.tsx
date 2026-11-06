
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { customerService } from "@/services/customerService";
import { productService } from "@/services/productService";
import { saleService } from "@/services/saleService";
import { transactionService } from "@/services/transactionService";
import { inventoryService } from "@/services/inventoryService";

import { useAuth } from "./AuthContext";

import type {
  CreateSaleInput,
  Customer,
  CustomerInput,
  PaymentStatus,
  Product,
  ProductInput,
  Sale,
  StockMovement,
  Transaction,
} from "@/types";

export interface ActionResult {
  success: boolean;
  message?: string;
  sale?: Sale;
}

type InventoryRecord = Awaited<
  ReturnType<typeof inventoryService.getAll>
>[number];

interface AppDataContextValue {
  customers: Customer[];
  products: Product[];
  sales: Sale[];
  transactions: Transaction[];
  inventoryRecords: InventoryRecord[];
  stockMovements: StockMovement[];

  addCustomer: (input: CustomerInput) => Promise<ActionResult>;
  updateCustomer: (
    id: string,
    input: CustomerInput,
  ) => Promise<ActionResult>;
  deleteCustomer: (id: string) => Promise<ActionResult>;

  addProduct: (input: ProductInput) => Promise<ActionResult>;
  updateProduct: (
    id: string,
    input: ProductInput,
  ) => Promise<ActionResult>;
  deleteProduct: (id: string) => Promise<ActionResult>;

  createSale: (input: CreateSaleInput) => Promise<ActionResult>;

  addStock: (
    productId: string,
    quantity: number,
    reason: string,
  ) => Promise<ActionResult>;

  updateTransactionStatus: (
    transactionId: string,
    status: PaymentStatus,
  ) => Promise<ActionResult>;
}

const AppDataContext = createContext<
  AppDataContextValue | undefined
>(undefined);

function makeMovement(
  product: Product,
  type: StockMovement["type"],
  quantity: number,
  reason: string,
  reference: string,
): StockMovement {
  return {
    id: `MOV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    productId: product.id,
    productName: product.name,
    type,
    quantity,
    unit: product.unit,
    reason,
    date: new Date().toISOString(),
    reference,
  };
}

function getErrorMessage(error: unknown, fallback: string): string {
  const responseMessage = (
    error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    }
  )?.response?.data?.message;

  return responseMessage ?? fallback;
}

export function AppDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [inventoryRecords, setInventoryRecords] = useState<
    InventoryRecord[]
  >([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);

  // FETCH BACKEND DATA AFTER AUTHENTICATION
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      setCustomers([]);
      setProducts([]);
      setSales([]);
      setTransactions([]);
      setInventoryRecords([]);
      setStockMovements([]);
      return;
    }

    let isActive = true;

    async function fetchInitialData() {
      try {
        const [
          customerData,
          productData,
          saleData,
          transactionData,
          inventoryData,
        ] = await Promise.all([
          customerService.getAll(),
          productService.getAll(),
          saleService.getAll(),
          transactionService.getAll(),
          inventoryService.getAll(),
        ]);

        if (!isActive) return;

        setCustomers(customerData);
        setProducts(productData);
        setSales(saleData);
        setTransactions(transactionData);
        setInventoryRecords(inventoryData);
      } catch (error) {
        if (isActive) {
          console.error("Failed to fetch initial data:", error);
        }
      }
    }

    void fetchInitialData();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, isLoading]);

  // CUSTOMER FUNCTIONS

  async function addCustomer(
    input: CustomerInput,
  ): Promise<ActionResult> {
    try {
      const newCustomer = await customerService.create(input);

      setCustomers((current) => [newCustomer, ...current]);

      return {
        success: true,
        message: "Customer added successfully!",
      };
    } catch (error) {
      console.error("Failed to add customer:", error);

      return {
        success: false,
        message: getErrorMessage(
          error,
          "Failed to add customer. Please try again.",
        ),
      };
    }
  }

  async function updateCustomer(
    id: string,
    input: CustomerInput,
  ): Promise<ActionResult> {
    try {
      const updatedCustomer = await customerService.update(id, input);

      setCustomers((current) =>
        current.map((customer) =>
          customer.id === id ? updatedCustomer : customer,
        ),
      );

      return {
        success: true,
        message: "Customer updated successfully!",
      };
    } catch (error) {
      console.error("Failed to update customer:", error);

      return {
        success: false,
        message: getErrorMessage(
          error,
          "Failed to update customer. Please try again.",
        ),
      };
    }
  }

  async function deleteCustomer(id: string): Promise<ActionResult> {
    try {
      await customerService.remove(id);

      setCustomers((current) =>
        current.filter((customer) => customer.id !== id),
      );

      return {
        success: true,
        message: "Customer deleted successfully!",
      };
    } catch (error) {
      console.error("Failed to delete customer:", error);

      return {
        success: false,
        message: getErrorMessage(
          error,
          "Failed to delete customer. Please try again.",
        ),
      };
    }
  }

  // PRODUCT FUNCTIONS

  async function addProduct(
    input: ProductInput,
  ): Promise<ActionResult> {
    try {
      const newProduct = await productService.create(input);

      const updatedInventory = await inventoryService.getAll();

      setProducts((current) => [newProduct, ...current]);
      setInventoryRecords(updatedInventory);

      return {
        success: true,
        message: "Product added successfully!",
      };
    } catch (error) {
      console.error("Failed to add product:", error);

      return {
        success: false,
        message: getErrorMessage(
          error,
          "Failed to add product. Please try again.",
        ),
      };
    }
  }

  async function updateProduct(
    id: string,
    input: ProductInput,
  ): Promise<ActionResult> {
    try {
      const updatedProduct = await productService.update(id, input);
      const updatedInventory = await inventoryService.getAll();

      setProducts((current) =>
        current.map((product) =>
          product.id === id ? updatedProduct : product,
        ),
      );

      setInventoryRecords(updatedInventory);

      return {
        success: true,
        message: "Product updated successfully!",
      };
    } catch (error) {
      console.error("Failed to update product:", error);

      return {
        success: false,
        message: getErrorMessage(
          error,
          "Failed to update product. Please try again.",
        ),
      };
    }
  }

  async function deleteProduct(id: string): Promise<ActionResult> {
    try {
      await productService.remove(id);

      const updatedInventory = await inventoryService.getAll();

      setProducts((current) =>
        current.filter((product) => product.id !== id),
      );

      setInventoryRecords(updatedInventory);

      return {
        success: true,
        message: "Product deleted successfully!",
      };
    } catch (error) {
      console.error("Failed to delete product:", error);

      return {
        success: false,
        message: getErrorMessage(
          error,
          "Failed to delete product. Please try again.",
        ),
      };
    }
  }

  // SALES FUNCTION - ONE PRODUCT PER SALE

  async function createSale(
    input: CreateSaleInput,
  ): Promise<ActionResult> {
    const customer = customers.find(
      (item) => item.id === input.customerId,
    );

    if (!customer) {
      return {
        success: false,
        message: "Please select a valid customer.",
      };
    }

    const product = products.find(
      (item) => item.id === input.productId,
    );

    if (!product) {
      return {
        success: false,
        message: "Please select a valid product.",
      };
    }

    if (!Number.isInteger(input.quantity) || input.quantity <= 0) {
      return {
        success: false,
        message: "Please enter a valid quantity.",
      };
    }

    if (input.quantity > product.stock) {
      return {
        success: false,
        message: `${product.name} only has ${product.stock} ${product.unit} in stock.`,
      };
    }

    const totalAmount =
      Math.round(product.price * input.quantity * 100) / 100;

    if (
      !Number.isFinite(input.amountPaid) ||
      input.amountPaid < 0 ||
      input.amountPaid > totalAmount
    ) {
      return {
        success: false,
        message: "Please enter a valid payment amount.",
      };
    }

    try {
      const response = await saleService.create(input);

      const saleId = String(
        response.data.sales?.[0]?.id ?? "",
      );

      const [
        updatedSales,
        updatedTransactions,
        updatedInventory,
        updatedProducts,
      ] = await Promise.all([
        saleService.getAll(),
        transactionService.getAll(),
        inventoryService.getAll(),
        productService.getAll(),
      ]);

      setSales(updatedSales);
      setTransactions(updatedTransactions);
      setInventoryRecords(updatedInventory);
      setProducts(updatedProducts);

      const createdSale = updatedSales.find(
        (item) => item.id === saleId,
      );

      return {
        success: true,
        message: response.message ?? "Sale recorded successfully!",
        sale: createdSale,
      };
    } catch (error) {
      console.error("Failed to record sale:", error);

      return {
        success: false,
        message: getErrorMessage(
          error,
          "Failed to record sale. Please try again.",
        ),
      };
    }
  }

  // ADD STOCK FUNCTION

  async function addStock(
    productId: string,
    quantity: number,
    reason: string,
  ): Promise<ActionResult> {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return {
        success: false,
        message: "Product not found.",
      };
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return {
        success: false,
        message: "Stock-in quantity must be greater than zero.",
      };
    }

    try {
      const updatedInventory = await inventoryService.addStock(
        productId,
        quantity,
        reason,
      );

      setInventoryRecords((current) => {
        const exists = current.some(
          (record) => record.productId === updatedInventory.productId,
        );

        if (exists) {
          return current.map((record) =>
            record.productId === updatedInventory.productId
              ? updatedInventory
              : record,
          );
        }

        return [...current, updatedInventory];
      });

      setProducts((current) =>
        current.map((item) =>
          item.id === productId
            ? {
                ...item,
                stock: updatedInventory.currentStock,
              }
            : item,
        ),
      );

      setStockMovements((current) => [
        makeMovement(
          {
            ...product,
            stock: updatedInventory.currentStock,
          },
          "Stock In",
          quantity,
          reason.trim() || "Stock replenishment",
          "STOCK-IN",
        ),
        ...current,
      ]);

      return {
        success: true,
        message: "Stock added successfully!",
      };
    } catch (error) {
      console.error("Failed to add stock:", error);

      return {
        success: false,
        message: getErrorMessage(
          error,
          "Failed to add stock. Please try again.",
        ),
      };
    }
  }

  // UPDATE TRANSACTION STATUS

  async function updateTransactionStatus(
    transactionId: string,
    status: PaymentStatus,
  ): Promise<ActionResult> {
    try {
      await transactionService.updatePaymentStatus(
        transactionId,
        status,
      );

      const [updatedTransactions, updatedSales] = await Promise.all([
        transactionService.getAll(),
        saleService.getAll(),
      ]);

      setTransactions(updatedTransactions);
      setSales(updatedSales);

      return {
        success: true,
        message: "Payment status updated successfully!",
      };
    } catch (error) {
      console.error("Failed to update payment status:", error);

      return {
        success: false,
        message: getErrorMessage(
          error,
          "Failed to update payment status. Please try again.",
        ),
      };
    }
  }

  return (
    <AppDataContext.Provider
      value={{
        customers,
        products,
        sales,
        transactions,
        inventoryRecords,
        stockMovements,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addProduct,
        updateProduct,
        deleteProduct,
        createSale,
        addStock,
        updateTransactionStatus,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData must be used inside an AppDataProvider.");
  }

  return context;
}
