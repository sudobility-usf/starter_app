import type { ReactNode } from "react";
import { SharedProtectedRoute } from "@sudobility/components";
import { useAuthStatus } from "@sudobility/auth-components";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthStatus();

  return (
    <SharedProtectedRoute
      isAuthenticated={!!user}
      isLoading={loading}
      redirectPath=""
    >
      {children}
    </SharedProtectedRoute>
  );
}
