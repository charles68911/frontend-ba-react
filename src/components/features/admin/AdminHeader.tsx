import { useLocation, useNavigate } from "react-router";
import { useAuth } from "@/components/context/AuthContext";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/customers": "Customer Management",
  "/products": "Product Management",
  "/sales": "Sales Management",
  "/transactions": "Transaction Management",
  "/inventory": "Inventory Management",
  "/analytics/descriptive": "Descriptive Analytics",
  "/analytics/predictive": "Predictive Analytics",
  "/analytics/prescriptive": "Prescriptive Analytics",
};

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] ?? "Central Seafoods";

  const formattedDate = new Intl.DateTimeFormat("en-PH", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
      <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100 lg:hidden"
            aria-label="Open navigation"
          >
            Menu
          </button>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-800">
              {pageTitle}
            </p>
            <p className="hidden text-xs text-neutral-500 sm:block">
              Central Seafoods · Cordova, Cebu
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-neutral-500 md:block">
            {formattedDate}
          </span>

          <span className="hidden max-w-40 truncate text-sm text-neutral-600 sm:block">
            {user?.name ?? "Administrator"}
          </span>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
            aria-label="Sign out"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
