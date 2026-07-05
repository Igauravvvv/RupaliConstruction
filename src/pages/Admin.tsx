import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import Navbar from "@/components/Navbar";
import {
  Users,
  MessageSquare,
  FileText,
  Briefcase,
  Star,
  Shield,
  Trash2,
  Mail,
} from "lucide-react";

export default function Admin() {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-[var(--rc-gray)]">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container-rc">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-6 h-6 text-[var(--rc-orange)]" />
            <div>
              <h1 className="text-2xl font-bold text-[var(--rc-dark)]">
                Admin Dashboard
              </h1>
              <p className="text-sm text-[var(--rc-muted)]">
                Welcome back, {user?.name}
              </p>
            </div>
          </div>

          <StatsCards />
          <ContactSubmissions />
        </div>
      </div>
    </div>
  );
}

function StatsCards() {
  const { data: stats } = trpc.admin.dashboardStats.useQuery();

  const cards = [
    {
      label: "Total Users",
      value: stats?.users.total || 0,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Contact Submissions",
      value: stats?.contacts || 0,
      icon: MessageSquare,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Blog Posts",
      value: stats?.blogPosts || 0,
      icon: FileText,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Projects",
      value: stats?.projects || 0,
      icon: Briefcase,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Testimonials",
      value: stats?.testimonials || 0,
      icon: Star,
      color: "bg-yellow-50 text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl p-5 border border-[var(--rc-border)]"
        >
          <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
            <card.icon className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-[var(--rc-dark)]">{card.value}</p>
          <p className="text-xs text-[var(--rc-muted)] mt-1">{card.label}</p>
        </div>
      ))}
    </div>
  );
}

function ContactSubmissions() {
  const { data: contacts, isLoading } = trpc.contact.list.useQuery();
  const utils = trpc.useUtils();

  const updateStatus = trpc.contact.updateStatus.useMutation({
    onSuccess: () => {
      utils.contact.list.invalidate();
      utils.contact.stats.invalidate();
    },
  });

  const deleteContact = trpc.contact.delete.useMutation({
    onSuccess: () => {
      utils.contact.list.invalidate();
      utils.contact.stats.invalidate();
    },
  });

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    read: "bg-yellow-100 text-yellow-700",
    replied: "bg-green-100 text-green-700",
    archived: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--rc-border)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--rc-border)] flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--rc-dark)]">
          Contact Submissions
        </h2>
        <span className="text-sm text-[var(--rc-muted)]">
          {contacts?.length || 0} total
        </span>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-[var(--rc-muted)]">Loading...</div>
      ) : !contacts || contacts.length === 0 ? (
        <div className="p-8 text-center text-[var(--rc-muted)]">
          No contact submissions yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--rc-border)] bg-[var(--rc-gray)]">
                <th className="text-left px-6 py-3 font-medium text-[var(--rc-muted)]">
                  Name
                </th>
                <th className="text-left px-6 py-3 font-medium text-[var(--rc-muted)]">
                  Email
                </th>
                <th className="text-left px-6 py-3 font-medium text-[var(--rc-muted)]">
                  Service
                </th>
                <th className="text-left px-6 py-3 font-medium text-[var(--rc-muted)]">
                  Status
                </th>
                <th className="text-left px-6 py-3 font-medium text-[var(--rc-muted)]">
                  Date
                </th>
                <th className="text-right px-6 py-3 font-medium text-[var(--rc-muted)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-b border-[var(--rc-border)] hover:bg-[var(--rc-gray)]/50"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-[var(--rc-dark)]">
                      {contact.name}
                    </p>
                    {contact.phone && (
                      <p className="text-xs text-[var(--rc-muted)]">
                        {contact.phone}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-[var(--rc-blue)] hover:underline flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      {contact.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 capitalize text-[var(--rc-muted)]">
                    {contact.service || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={contact.status}
                      onChange={(e) =>
                        updateStatus.mutate({
                          id: contact.id,
                          status: e.target.value as "new" | "read" | "replied" | "archived",
                        })
                      }
                      className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${statusColors[contact.status]}`}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-[var(--rc-muted)]">
                    {new Date(contact.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        if (confirm("Delete this submission?")) {
                          deleteContact.mutate({ id: contact.id });
                        }
                      }}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
