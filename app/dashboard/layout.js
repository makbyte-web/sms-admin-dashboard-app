import React from "react";
import DashboardUi from "../components/dashboardUi/index";
import UserLayout from "../user/layout";
import ProtectedRoute from "../components/protectedRoute";

const DashboardLayout = ({ children }) => {
  return (
    <ProtectedRoute>
      <UserLayout>
        <DashboardUi>{children}</DashboardUi>
      </UserLayout>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
