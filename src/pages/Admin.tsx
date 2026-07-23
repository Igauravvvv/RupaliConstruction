import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
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
  LogOut,
  Home,
  Shield,
  Bell,
  ChevronRight,
} from "lucide-react";

export default function Admin() {
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth();
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
      <div className="min-h-screen flex items-center justify-center bg-[var(--rc-gray)]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-3 border-[var(--rc-blue)] border-t-transparent rounded-full" />
          <p className="text-sm text-[var(--rc-muted)] font-medium">Loading dashboard...</p>
        </div>
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

  const adminName = user?.name || "Administrator";
  const adminInitials = adminName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-[var(--rc-gray)] flex flex-col font-sans">
      {/* ─── Admin Top Bar ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[var(--rc-blue)] shadow-lg shadow-[var(--rc-blue)]/20 flex items-center justify-between px-4 lg:px-8">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src="/logo-main.png?v=2"
              alt="Rupali Construction"
              className="h-10 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <div className="hidden sm:flex items-center gap-2 ml-2 pl-4 border-l border-white/20">
            <Shield className="w-4 h-4 text-[var(--rc-orange)]" />
            <span className="text-white/90 text-sm font-semibold tracking-wide uppercase">Admin Panel</span>
          </div>
        </div>

        {/* Right: Profile & Actions */}
        <div className="flex items-center gap-3">
          {/* Visit Site Button */}
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-all hover:bg-white/10"
          >
            <Home className="w-3.5 h-3.5" />
            Visit Site
          </Link>

          {/* Notification Bell */}
          <button className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all">
            <Bell className="w-5 h-5" />
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-white/20 hidden sm:block" />

          {/* Admin Profile */}
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-white/30" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--rc-orange)] to-orange-600 flex items-center justify-center ring-2 ring-white/30">
                <span className="text-white text-xs font-bold">{adminInitials}</span>
              </div>
            )}
            <div className="hidden md:block">
              <p className="text-white text-sm font-semibold leading-tight">{adminName}</p>
              <p className="text-white/60 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                Admin
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 text-white/60 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex pt-16">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static top-16 left-0 h-[calc(100vh-64px)] w-64 bg-white border-r border-[var(--rc-border)] z-50 transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-6 flex-1 flex flex-col">
            {/* Admin Identity Card */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-[var(--rc-blue)]/5 to-[var(--rc-orange)]/5 border border-[var(--rc-border)]">
              <div className="flex items-center gap-3">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-11 h-11 rounded-xl object-cover shadow-sm" />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--rc-blue)] to-[var(--rc-blue)]/80 flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">{adminInitials}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--rc-dark)] truncate">{adminName}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                    <span className="text-xs text-[var(--rc-muted)]">Online</span>
                    <span className="text-xs bg-[var(--rc-orange)]/10 text-[var(--rc-orange)] px-1.5 py-0.5 rounded font-semibold ml-1">ADMIN</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Label */}
            <p className="text-[10px] font-bold text-[var(--rc-muted)] uppercase tracking-[0.2em] mb-3 px-1">Navigation</p>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? "bg-[var(--rc-blue)] text-white shadow-md shadow-[var(--rc-blue)]/20"
                        : "text-[var(--rc-dark)] hover:bg-[var(--rc-gray)]"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[var(--rc-muted)]"}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 text-white/60" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-[var(--rc-border)]">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--rc-muted)] hover:text-[var(--rc-blue)] hover:bg-[var(--rc-gray)] rounded-xl transition-all"
            >
              <Home className="w-4 h-4" />
              Back to Website
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden min-h-[calc(100vh-64px)] bg-[var(--rc-gray)]">
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
            <div className="hidden lg:flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-[var(--rc-dark)] capitalize">
                  {activeTab === "overview" ? "Dashboard Overview" : activeTab.replace("-", " ")}
                </h1>
                <p className="text-[var(--rc-muted)] text-sm mt-1">
                  Manage your {activeTab.replace("-", " ")} data and settings
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--rc-muted)]">
                  {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
