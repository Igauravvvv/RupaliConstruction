import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Search, Filter, Download, FileSpreadsheet, FileText, ChevronDown, Trash2, Edit2, Check, X as XIcon } from "lucide-react";
import ExcelJS from "exceljs";

export default function AdminLeads() {
  const { data: leads, refetch, isLoading } = trpc.admin.leads.useQuery();
  const updateLead = trpc.admin.updateLead.useMutation({ onSuccess: () => refetch() });
  const deleteLead = trpc.admin.deleteLead.useMutation({ onSuccess: () => refetch() });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<any>("");
  const [editRemarks, setEditRemarks] = useState("");

  const filteredLeads = leads?.filter(lead => {
    const matchesSearch = 
      lead.name?.toLowerCase().includes(search.toLowerCase()) || 
      lead.phone?.includes(search) || 
      lead.referenceId?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    if (!filteredLeads) return;
    const headers = ["Reference ID", "Date", "Name", "Phone", "Email", "City", "Enquiry Type", "Status", "Remarks"];
    const rows = filteredLeads.map(l => [
      l.referenceId,
      new Date(l.createdAt).toLocaleDateString(),
      l.name || "",
      l.phone || "",
      l.email || "",
      l.city || "",
      l.enquiryType,
      l.status,
      l.remarks || ""
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rupali_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const exportExcel = async () => {
    if (!filteredLeads) return;
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Leads");
    
    sheet.columns = [
      { header: "Reference ID", key: "ref", width: 15 },
      { header: "Date", key: "date", width: 15 },
      { header: "Name", key: "name", width: 20 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Email", key: "email", width: 25 },
      { header: "City", key: "city", width: 15 },
      { header: "Enquiry Type", key: "type", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Budget", key: "budget", width: 15 },
      { header: "Project Type", key: "ptype", width: 15 },
      { header: "Remarks", key: "remarks", width: 30 }
    ];

    filteredLeads.forEach(l => {
      sheet.addRow({
        ref: l.referenceId,
        date: new Date(l.createdAt).toLocaleDateString(),
        name: l.name,
        phone: l.phone,
        email: l.email,
        city: l.city,
        type: l.enquiryType,
        status: l.status,
        budget: l.budget,
        ptype: l.projectType,
        remarks: l.remarks
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Rupali_Leads_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleEdit = (lead: any) => {
    setEditingId(lead.id);
    setEditStatus(lead.status);
    setEditRemarks(lead.remarks || "");
  };

  const handleSave = (id: number) => {
    updateLead.mutate({ id, status: editStatus, remarks: editRemarks });
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      deleteLead.mutate({ id });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white p-6 rounded-2xl border border-[var(--rc-border)] shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-4 flex-1 w-full">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, phone or ID..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl focus:border-[var(--rc-blue)] outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 border rounded-xl outline-none appearance-none bg-white min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="follow-up">Follow Up</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors text-sm">
            <FileText className="w-4 h-4" /> CSV
          </button>
          <button onClick={exportExcel} className="flex items-center gap-2 px-4 py-2 bg-[var(--rc-blue)] hover:bg-[#081e3a] text-white rounded-xl font-medium transition-colors text-sm">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[var(--rc-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[var(--rc-border)]">
                <th className="p-4 text-sm font-semibold text-gray-600">Ref ID</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Name & Contact</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Enquiry</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Remarks</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rc-border)]">
              {isLoading ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Loading leads...</td></tr>
              ) : filteredLeads?.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">No leads found.</td></tr>
              ) : (
                filteredLeads?.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-xs text-gray-500">{lead.referenceId}</td>
                    <td className="p-4 text-sm text-gray-600">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <p className="text-sm font-bold text-[var(--rc-dark)]">{lead.name}</p>
                      <p className="text-xs text-gray-500">{lead.phone}</p>
                      <p className="text-xs text-gray-500">{lead.email}</p>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-1 bg-blue-50 text-[var(--rc-blue)] rounded text-xs font-semibold capitalize mb-1">
                        {lead.enquiryType}
                      </span>
                      {lead.budget && <p className="text-xs text-gray-500">Budget: {lead.budget}</p>}
                      {lead.city && <p className="text-xs text-gray-500">City: {lead.city}</p>}
                    </td>
                    <td className="p-4">
                      {editingId === lead.id ? (
                        <select 
                          value={editStatus} 
                          onChange={e => setEditStatus(e.target.value)}
                          className="border p-1 text-sm rounded w-full"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="follow-up">Follow Up</option>
                          <option value="converted">Converted</option>
                          <option value="closed">Closed</option>
                        </select>
                      ) : (
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold capitalize ${
                          lead.status === 'new' ? 'bg-orange-100 text-orange-700' :
                          lead.status === 'converted' ? 'bg-green-100 text-green-700' :
                          lead.status === 'closed' ? 'bg-gray-100 text-gray-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {lead.status}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {editingId === lead.id ? (
                        <input 
                          type="text" 
                          value={editRemarks} 
                          onChange={e => setEditRemarks(e.target.value)}
                          placeholder="Add notes..."
                          className="border p-1 text-sm rounded w-full"
                        />
                      ) : (
                        <p className="text-sm text-gray-600 max-w-[200px] truncate">{lead.remarks || "-"}</p>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {editingId === lead.id ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleSave(lead.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Check className="w-4 h-4"/></button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded"><XIcon className="w-4 h-4"/></button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(lead)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4"/></button>
                          <button onClick={() => handleDelete(lead.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      )}
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
