import { RoleBasedRoute } from "@/features";
import React from "react";

const ReaderDashboard = () => {
  return (
    <RoleBasedRoute allowedRoles={["READER"]}>
      <div>Reader Dashboard</div>
    </RoleBasedRoute>
  );
};

export default ReaderDashboard;
