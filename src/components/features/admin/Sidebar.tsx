import { NavLink } from "react-router";
import { cn } from "@/lib/cn";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  to: string;
}

const mainLinks: NavItem[] = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Customers", to: "/customers" },
  { label: "Products", to: "/products" },
  { label: "Sales", to: "/sales" },
  { label: "Transactions", to: "/transactions" },
  { label: "Inventory", to: "/inventory" },
];

const analyticsLinks: NavItem[] = [
  { label: "Descriptive", to: "/analytics/descriptive" },
  { label: "Predictive", to: "/analytics/predictive" },
  { label: "Prescriptive", to: "/analytics/prescriptive" },
];

function NavigationLink({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "block rounded-md px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-brand font-medium text-white"
            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
        )
      }
    >
      {item.label}
    </NavLink>
  );
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Dark layer shown behind the sidebar on small screens. */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-neutral-900/40 transition-opacity lg:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-neutral-200 bg-white transition-transform duration-200 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-neutral-200 px-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-md bg-brand text-xs font-bold text-white">
              CS
            </span>
            <div>
              <p className="text-sm leading-tight font-semibold text-neutral-800">
                Central Seafoods
              </p>
              <p className="text-[11px] text-neutral-500">
                Sales &amp; Inventory
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-neutral-500 hover:text-neutral-900 lg:hidden"
            aria-label="Close navigation"
          >
            Close
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-xs font-medium text-neutral-400">Main</p>
          <div className="space-y-0.5">
            {mainLinks.map((item) => (
              <NavigationLink key={item.to} item={item} onNavigate={onClose} />
            ))}
          </div>

          <p className="mt-6 mb-2 px-3 text-xs font-medium text-neutral-400">
            Analytics
          </p>
          <div className="space-y-0.5">
            {analyticsLinks.map((item) => (
              <NavigationLink key={item.to} item={item} onNavigate={onClose} />
            ))}
          </div>
        </nav>

      </aside>
    </>
  );
}
