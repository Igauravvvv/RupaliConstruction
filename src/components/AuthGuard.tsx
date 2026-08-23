import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`, { replace: true });
    }
  }, [isLoading, isAuthenticated, location, navigate]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--rc-gray)] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-[var(--rc-orange)] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[var(--rc-muted)] font-medium tracking-wide">Checking account security...</span>
      </div>
    );
  }

  return <>{children}</>;
}
