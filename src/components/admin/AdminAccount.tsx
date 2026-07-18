import { useAuth } from "@/hooks/useAuth";
import { User, LogOut, Shield } from "lucide-react";

export default function AdminAccount() {
  const { user } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("local_auth_token");
    window.location.href = "/login";
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--rc-border)] overflow-hidden max-w-2xl">
      <div className="px-6 py-4 border-b border-[var(--rc-border)]">
        <h2 className="text-lg font-semibold text-[var(--rc-dark)]">
          Account Settings
        </h2>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-[var(--rc-gray)] border-4 border-white shadow-lg flex items-center justify-center text-[var(--rc-blue)]">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[var(--rc-dark)]">
              {user?.name || "Admin User"}
            </h3>
            <p className="text-[var(--rc-muted)] flex items-center gap-1 mt-1">
              <Shield className="w-4 h-4 text-[var(--rc-orange)]" />
              Administrator
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 py-3 border-b border-[var(--rc-border)]">
            <div className="text-sm font-medium text-[var(--rc-muted)]">Username</div>
            <div className="col-span-2 text-sm text-[var(--rc-dark)]">
              {user?.username || "N/A"}
            </div>
          </div>
          <div className="grid grid-cols-3 py-3 border-b border-[var(--rc-border)]">
            <div className="text-sm font-medium text-[var(--rc-muted)]">Email</div>
            <div className="col-span-2 text-sm text-[var(--rc-dark)]">
              {user?.email || "N/A"}
            </div>
          </div>
          <div className="grid grid-cols-3 py-3 border-b border-[var(--rc-border)]">
            <div className="text-sm font-medium text-[var(--rc-muted)]">Role</div>
            <div className="col-span-2 text-sm text-[var(--rc-dark)] capitalize">
              {user?.role || "Admin"}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--rc-border)]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
