import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  // If loading or not fully authenticated, simply don't render the protected component.
  // We do not force a redirect so public pages remain accessible.
  if (isLoading || !isAuthenticated || !user?.phoneNumber) {
    return null;
  }

  return <>{children}</>;
}
