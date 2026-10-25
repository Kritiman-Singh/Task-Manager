import { useAuthStore } from "@/utils/auth";
import Navbar from "@/components/navbar";
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

function AppLayout() {
  const bootStrap = useAuthStore((state) => state.bootstrap);
  const location = useLocation();

  useEffect(() => {
    bootStrap();
  }, [bootStrap]);

  // Don't show global Navbar on dashboard routes — TaskLayout has its own sidebar
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div>
      {!isDashboard && <Navbar />}
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
