import React from "react";
import SignUpForm from "../components/ui/signUpForm";
import ProtectedRoute from "../components/protectedRoute";

const SignUpPage = () => {
  return (
    <ProtectedRoute>
      <SignUpForm />
    </ProtectedRoute>
  );
};

export default SignUpPage;
