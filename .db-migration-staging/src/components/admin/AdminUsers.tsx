import { trpc } from "@/providers/trpc";
import { UserCircle2, Mail, Phone, Calendar, Shield, MapPin, Search } from "lucide-react";
import { useState } from "react";

export default function AdminUsers() {
  const { data: users, isLoading } = trpc.admin.userList.useQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "oauth" | "local">("all");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-3 border-[var(--rc-blue)] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Combine and sort users
  const allUsers = [...(users?.oauth || []), ...(users?.local || [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm);
      
    const matchesType = filterType === "all" || user.authType === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--rc-blue)] focus:ring-1 focus:ring-[var(--rc-blue)] text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 font-medium">Filter by:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--rc-blue)]"
          >
            <option value="all">All Users</option>
            <option value="oauth">Google Sign-in</option>
            <option value="local">Email & Password</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-[var(--rc-border)] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-[var(--rc-border)] text-gray-900 font-medium">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Account Type</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rc-border)]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={`${user.authType}-${user.id}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--rc-blue)]/10 text-[var(--rc-blue)] flex items-center justify-center font-bold">
                          {user.name ? user.name[0].toUpperCase() : "U"}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{user.name || "Unknown User"}</div>
                          {user.role === "admin" && (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[var(--rc-orange)] bg-[var(--rc-orange)]/10 px-2 py-0.5 rounded mt-1">
                              <Shield className="w-3 h-3" /> Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span className={user.email ? "" : "text-gray-400 italic"}>
                            {user.email || "No email"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span className={user.phone ? "" : "text-gray-400 italic"}>
                            {user.phone || "No phone"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        user.authType === "oauth" 
                          ? "bg-blue-50 text-blue-700" 
                          : "bg-purple-50 text-purple-700"
                      }`}>
                        {user.authType === "oauth" ? "Google" : "Local"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(user.lastSignInAt).toLocaleDateString()}
                      <div className="text-xs text-gray-400 mt-0.5">
                        {new Date(user.lastSignInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
