import { trpc } from "@/providers/trpc";
import {
  Users,
  MessageSquare,
  FileText,
  Briefcase,
  Star,
  Trash2,
  Mail,
  Download,
} from "lucide-react";

export default function AdminOverview() {
  return (
    <div className="space-y-8">
      <StatsCards />
      <ContactSubmissions />
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

  const botCards = [
    {
      label: "Today's Leads",
      value: stats?.todayLeads || 0,
      icon: Users,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Total Bot Leads",
      value: stats?.chatbotLeads || 0,
      icon: MessageSquare,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Cost Requests",
      value: stats?.costRequests || 0,
      icon: FileText,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Pending Follow-ups",
      value: stats?.pendingLeads || 0,
      icon: Star,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[var(--rc-dark)] mb-4">Chatbot Leads</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {botCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl p-5 border border-[var(--rc-border)]"
            >
              <div
                className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}
              >
                <card.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-[var(--rc-dark)]">{card.value}</p>
              <p className="text-xs text-[var(--rc-muted)] mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-[var(--rc-dark)] mb-4">Site Overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl p-5 border border-[var(--rc-border)]"
            >
              <div
                className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}
              >
                <card.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-[var(--rc-dark)]">{card.value}</p>
              <p className="text-xs text-[var(--rc-muted)] mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      </div>
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

  const exportToCsv = () => {
    if (!contacts || contacts.length === 0) return;
    const headers = ["Name", "Email", "Phone", "Service", "Budget", "Message", "Status", "Date"];
    const rows = contacts.map(c => [
      c.name,
      c.email,
      c.phone || "",
      c.service || "",
      c.budget || "",
      `"${(c.message || "").replace(/"/g, '""')}"`, // escape quotes for CSV
      c.status,
      new Date(c.createdAt).toLocaleDateString()
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inquiries_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--rc-border)] overflow-hidden flex flex-col h-[500px]">
      <div className="px-6 py-4 border-b border-[var(--rc-border)] flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--rc-dark)]">
            Contact Submissions
          </h2>
          <span className="text-sm text-[var(--rc-muted)]">
            {contacts?.length || 0} total
          </span>
        </div>
        <button
          onClick={exportToCsv}
          disabled={!contacts || contacts.length === 0}
          className="flex items-center gap-2 bg-[var(--rc-blue)] text-white px-4 py-2 rounded-lg text-sm hover:bg-[var(--rc-orange)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export to CSV
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-[var(--rc-muted)] flex-1">Loading...</div>
      ) : !contacts || contacts.length === 0 ? (
        <div className="p-8 text-center text-[var(--rc-muted)] flex-1">
          No contact submissions yet.
        </div>
      ) : (
        <div className="overflow-x-auto flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[var(--rc-gray)] z-10">
              <tr className="border-b border-[var(--rc-border)]">
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
                  className="border-b border-[var(--rc-border)] hover:bg-[var(--rc-gray)]/50 transition-colors"
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
                          status: e.target.value as
                            | "new"
                            | "read"
                            | "replied"
                            | "archived",
                        })
                      }
                      className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${
                        statusColors[contact.status]
                      }`}
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
                      year: "numeric",
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
