import React from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useDealer } from "./DealerContext";

const ProtectedRoute = ({ children }) => {
  const { dealer, loading } = useDealer();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress color="error" />
      </Box>
    );
  }

  if (!dealer) {
    return <Navigate to="/giris" replace />;
  }

  return children;
};

export default ProtectedRoute;
