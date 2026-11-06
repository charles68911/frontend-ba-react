import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { AdminHeader } from "@/components/features/admin/AdminHeader";
import { Sidebar } from "@/components/features/admin/Sidebar";

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="lg:pl-60">
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />

        <main className="mx-auto w-full max-w-[1400px] px-4 pt-5 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
