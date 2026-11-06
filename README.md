# Central Seafoods Sales & Inventory Analytics

Responsive admin frontend for the Central Seafoods Sales and Inventory Business Analytics System. Built with React, Vite, TypeScript, Tailwind CSS v4, React Router, Axios, Lucide React, and Recharts.

The system runs entirely on deterministic sample data. No backend or database is required to explore it.

## Demo account

| Field    | Value                                                  |
| -------- | ------------------------------------------------------ |
| Username | `admin`                                                |
| Email    | `admin@centralseafoods.ph`                             |
| Password | `admin123`                                             |

Check **Remember me** to keep the session in `localStorage`; otherwise it is stored in `sessionStorage`.

## Getting started

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

Other scripts:

```bash
npm run build     # create a production build
npm run preview   # preview the production build
```

## Features

- **Authentication** — sample admin login with validation, show/hide password, remember me, and protected routes.
- **Dashboard** — revenue, sales, customer, and low-stock KPIs; revenue trend; best sellers; recent sales; stock alerts.
- **Customers** — create, edit, delete, search, and filter by customer type.
- **Products** — full CRUD, category and stock filters, search, and validation.
- **Sales** — line-item sale builder with live totals, payment method/status, automatic stock deduction, transaction creation, and stock movement logging.
- **Transactions** — searchable and filterable transaction history with details and mark-as-paid action.
- **Inventory** — current stock, low-stock monitoring, stock-in and adjustments, and movement history.
- **Descriptive analytics** — sales trends, best/least sellers, customer patterns, and inventory status by period.
- **Predictive analytics** — demand forecasts, reorder points, and forecast summaries derived from sample history.
- **Prescriptive analytics** — prioritized restock recommendations, action plan, slow-moving stock, and one-click restock.
- **Responsive layout** — collapsible desktop sidebar and slide-over mobile navigation.

Sample data is stored in memory and resets on page refresh. Only the authentication session persists.

## Project structure

```text
src/
├── assets/
├── components/
│   ├── common/              # Shared page-level components
│   ├── context/             # AuthContext and AppDataContext
│   ├── features/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── analytics/
│   │   ├── customers/
│   │   ├── inventory/
│   │   ├── products/
│   │   ├── sales/
│   │   └── transactions/
│   └── ui/                  # Buttons, inputs, modals, tables, badges
├── lib/                     # Axios client and formatting/status helpers
├── pages/
│   ├── admin/
│   └── auth/
├── services/                # Mock data plus API-ready service modules
├── styles/                  # Tailwind v4 theme and global styles
├── types/                   # Shared TypeScript interfaces
└── main.tsx                 # Entry point, providers, and router
```

Routing is defined with `createBrowserRouter` in `src/main.tsx`. There is intentionally no `App.tsx` and no `routes/` folder.

## Design palette

| Token            | Value     |
| ---------------- | --------- |
| Navy             | `#1E3A5F` |
| Ocean            | `#2878A5` |
| Teal             | `#2A9D8F` |
| Light background | `#F5F7FA` |
| White            | `#FFFFFF` |

Theme tokens are declared in `src/styles/global.css` using Tailwind CSS v4's `@theme` directive.

## Backend integration notes

The UI is intentionally decoupled from transport:

- `src/lib/axios.ts` exposes a configured Axios instance with a base URL from `VITE_API_BASE_URL` and room for auth token injection.
- `src/services/*Service.ts` files define typed request functions per domain (`auth`, `customers`, `products`, `sales`, `transactions`, `inventory`, `analytics`).
- Pages currently read and mutate sample data through `AppDataContext`, so switching to live data means replacing context operations with the corresponding service calls.
- `src/types/index.ts` contains the shared interfaces that match the expected Express.js + Neon PostgreSQL payloads.

A future Express API should provide endpoints for authentication, customer/product CRUD, sale creation (with inventory and transaction updates in one database transaction), stock movements, and analytics aggregates.
