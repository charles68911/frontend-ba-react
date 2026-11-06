
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router";

import { GuestRoute } from "@/components/common/GuestRoute";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

import { AppDataProvider } from "@/components/context/AppDataContext";
import { AuthProvider } from "@/components/context/AuthContext";

import { AdminLayout } from "@/components/features/admin/AdminLayout";

import { CustomersPage } from "@/pages/admin/CustomersPage";
import { DashboardPage } from "@/pages/admin/DashboardPage";
import { DescriptiveAnalyticsPage } from "@/pages/admin/DescriptiveAnalyticsPage";
import { InventoryPage } from "@/pages/admin/InventoryPage";
import { PredictiveAnalyticsPage } from "@/pages/admin/PredictiveAnalyticsPage";
import { PrescriptiveAnalyticsPage } from "@/pages/admin/PrescriptiveAnalyticsPage";
import { ProductsPage } from "@/pages/admin/ProductsPage";
import { SalesPage } from "@/pages/admin/SalesPage";
import { TransactionsPage } from "@/pages/admin/TransactionsPage";

import { LoginPage } from "@/pages/auth/LoginPage";

import "@/styles/global.css";

const router = createBrowserRouter([
  // Guest routes
  {
    element: <GuestRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },

  // Protected administrator routes
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "customers",
            element: <CustomersPage />,
          },
          {
            path: "products",
            element: <ProductsPage />,
          },
          {
            path: "sales",
            element: <SalesPage />,
          },
          {
            path: "transactions",
            element: <TransactionsPage />,
          },
          {
            path: "inventory",
            element: <InventoryPage />,
          },
          {
            path: "analytics/descriptive",
            element: <DescriptiveAnalyticsPage />,
          },
          {
            path: "analytics/predictive",
            element: <PredictiveAnalyticsPage />,
          },
          {
            path: "analytics/prescriptive",
            element: <PrescriptiveAnalyticsPage />,
          },
        ],
      },
    ],
  },

  // Unknown routes
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <AppDataProvider>
        <RouterProvider router={router} />
      </AppDataProvider>
    </AuthProvider>
  </StrictMode>,
);
