
import api from "@/lib/axios";
import type { Customer, CustomerInput } from "@/types";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type BackendCustomer = {
  id: number;
  customerName: string;
  customerType: Customer["type"];
  location: string;
  contactNumber: string | null;
  createdAt: string;
};

// Convert backend customer fields into frontend customer fields
function mapCustomer(customer: BackendCustomer): Customer {
  return {
    id: String(customer.id),
    name: customer.customerName,
    contactNumber: customer.contactNumber ?? "",
    email: "",
    address: customer.location,
    type: customer.customerType,
    notes: "",
    createdAt: customer.createdAt,
  };
}

export const customerService = {
  // Get all customers
  async getAll(): Promise<Customer[]> {
    const { data } = await api.get<ApiResponse<BackendCustomer[]>>(
      "/customers",
    );

    return data.data.map(mapCustomer);
  },

  // Add a customer
  async create(input: CustomerInput): Promise<Customer> {
    const { data } = await api.post<ApiResponse<BackendCustomer>>(
      "/customers",
      input,
    );

    return mapCustomer(data.data);
  },

  // Update a customer
  async update(id: string, input: CustomerInput): Promise<Customer> {
    const { data } = await api.put<ApiResponse<BackendCustomer>>(
      `/customers/${id}`,
      input,
    );

    return mapCustomer(data.data);
  },

  // Delete a customer
  async remove(id: string): Promise<void> {
    await api.delete(`/customers/${id}`);
  },
};
