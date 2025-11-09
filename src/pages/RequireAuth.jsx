import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { validateToken } from "../api/auth";

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const [status, setStatus] = useState("checking"); // checking | authorized | unauthorized

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setStatus("unauthorized");
        return;
      }
      const ok = await validateToken();
      setStatus(ok ? "authorized" : "unauthorized");
    };
    check();
  }, []);

  if (status === "checking") {
    // Avoid rendering protected content until auth is confirmed
    return null;
  }

  if (status === "unauthorized") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;

