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
};

export function useAuth() {
  const utils = trpc.useUtils();

  const {
    data: sessionUser,
    isLoading,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  const user: AuthUser | null = useMemo(() => {
    if (sessionUser) {
      return {
        id: sessionUser.id,
        name: sessionUser.name || "User",
        email: sessionUser.email,
        avatar: sessionUser.avatar,
        role: sessionUser.role,
        authType: sessionUser.authType,
        uniqueId: sessionUser.uniqueId,
        phoneNumber: sessionUser.phoneNumber,
      };
    }
    return null;
  }, [sessionUser]);

  const isAdmin = user?.role === "admin";

  const logout = useCallback(() => {
    localStorage.removeItem("local_auth_token");
    logoutMutation.mutate();
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, [logoutMutation]);

  return {
    user,
    isAuthenticated: !!user,
    isAdmin,
    isLoading,
    logout,
  };
}
