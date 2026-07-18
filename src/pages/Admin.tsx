import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminProjects from "@/components/admin/AdminProjects";
import AdminAccount from "@/components/admin/AdminAccount";
import AdminLeads from "@/components/admin/AdminLeads";
import {
  LayoutDashboard,
  Briefcase,
  UserCircle,
  Menu,
  X,
  Users,
} from "lucide-react";

export default function Admin() {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "leads" | "account">("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
    if (!isLoading && isAuthenticated && !isAdmin) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--rc-blue)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />;
      case "projects":
        return <AdminProjects />;
      case "leads":
        return <AdminLeads />;
      case "account":
        return <AdminAccount />;
      default:
        return <AdminOverview />;
    }
  };

  const navItems = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "leads", label: "Lead Management", icon: Users },
    { id: "projects", label: "Projects Portfolio", icon: Briefcase },
    { id: "account", label: "Account Settings", icon: UserCircle },
  ] as const;

  return (
    <div className="min-h-screen bg-[var(--rc-gray)] flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex pt-[72px]">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static top-[72px] left-0 h-[calc(100vh-72px)] w-64 bg-white border-r border-[var(--rc-border)] z-50 transform transition-transform duration-300 ease-in-out lg:transform-none ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[var(--rc-dark)] flex items-center gap-2">
                <span className="w-2 h-6 bg-[var(--rc-orange)] rounded-full"></span>
                Admin Panel
              </h2>
              <p className="text-sm text-[var(--rc-muted)] mt-1 ml-4">
                Welcome, {user?.name?.split(" ")[0] || "Admin"}
              </p>
            </div>

            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[var(--rc-blue)] text-white shadow-md shadow-[var(--rc-blue)]/20"
                        : "text-[var(--rc-dark)] hover:bg-[var(--rc-gray)]"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[var(--rc-muted)]"}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden min-h-[calc(100vh-72px)] bg-[var(--rc-gray)]">
          <div className="p-6 lg:p-10">
            {/* Mobile Header */}
            <div className="flex items-center justify-between lg:hidden mb-8 bg-white p-4 rounded-xl border border-[var(--rc-border)]">
              <h1 className="text-lg font-bold text-[var(--rc-dark)] capitalize">
                {activeTab.replace("-", " ")}
              </h1>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-[var(--rc-dark)] hover:bg-[var(--rc-gray)] rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <h1 className="text-2xl font-bold text-[var(--rc-dark)] capitalize">
                {activeTab.replace("-", " ")}
              </h1>
              <p className="text-[var(--rc-muted)] text-sm mt-1">
                Manage your {activeTab.replace("-", " ")} data and settings
              </p>
            </div>

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
