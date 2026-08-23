import { trpc } from "@/providers/trpc";
import { useCallback, useMemo } from "react";

export type AuthUser = {
  id: number;
  name: string;
  email?: string | null;
  avatar?: string | null;
  role: string;
  authType: "oauth" | "local";
  uniqueId?: string;
  phoneNumber?: string | null;
  profileCompleted?: boolean;
};

export function useAuth() {
  const utils = trpc.useUtils();

  // Try OAuth session first (Kimi auth via cookie)
  const {
    data: sessionUser,
    isLoading: oauthLoading,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // Try local auth (JWT token via localStorage) — always attempt
  const {
    data: localUser,
    isLoading: localLoading,
  } = trpc.localAuth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  // Prefer OAuth user, fall back to local user
  const resolvedSource = sessionUser || localUser;

  const user: AuthUser | null = useMemo(() => {
    if (resolvedSource) {
      return {
        id: resolvedSource.id,
        name: resolvedSource.name || "User",
        email: resolvedSource.email,
        avatar: resolvedSource.avatar,
        role: resolvedSource.role,
        authType: resolvedSource.authType ?? ("local" as const),
        uniqueId: resolvedSource.uniqueId,
        phoneNumber: resolvedSource.phoneNumber,
        profileCompleted: (resolvedSource as any).profileCompleted,
      };
    }
    return null;
  }, [resolvedSource]);

  const isAdmin = user?.role === "admin";
  const isLoading = oauthLoading || localLoading;

  const logout = useCallback(() => {
    if (logoutMutation.isPending) return;

    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        void utils.invalidate();
        window.location.assign("/login");
      },
    });
  }, [logoutMutation, utils]);

  return {
    user,
    isAuthenticated: !!user,
    isAdmin,
    isLoading,
    isLoggingOut: logoutMutation.isPending,
    logout,
  };
}
