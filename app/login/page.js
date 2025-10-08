import React from "react";
import LoginForm from "../components/ui/loginForm";
import ProtectedRoute from "../components/protectedRoute";

const LoginPage = () => {
  return (
    <ProtectedRoute>
      <LoginForm />
    </ProtectedRoute>
  );
};

export default LoginPage;
