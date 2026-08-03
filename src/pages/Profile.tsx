import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import { 
  User, Shield, Mail, Phone, Calendar, Building2, Calculator, 
  FileText, CheckCircle2, Edit3, LogOut, ArrowRight, Sparkles, 
  Clock, MapPin, Layers, Award, AlertCircle, RefreshCw
} from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "estimates" | "inquiries">("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: recordsData, isLoading: recordsLoading, refetch } = trpc.auth.getMyRecords.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const updateProfile = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      setSaveSuccess(true);
      setIsEditing(false);
      setErrorMessage("");
      setTimeout(() => setSaveSuccess(false), 4000);
      window.location.reload();
    },
    onError: (err) => {
      setErrorMessage(err.message || "Failed to update profile details.");
    }
  });

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[var(--rc-gray)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[var(--rc-orange)] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[var(--rc-muted)] font-medium tracking-wide">Loading your profile...</span>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSaveSuccess(false);
    updateProfile.mutate({
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      phoneNumber: phoneNumber.trim() || undefined,
    });
  };

  const formatDate = (dateStr: string | Date | undefined) => {
    if (!dateStr) return "N/A";
    try {
      const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
      return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return String(dateStr);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--rc-gray)] flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 lg:pt-32 pb-20 container-rc">
        {/* Hero Section */}
        <div className="relative bg-[var(--rc-dark)] rounded-3xl p-8 lg:p-12 text-white shadow-2xl overflow-hidden mb-8 border border-white/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--rc-orange)]/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--rc-blue)]/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-tr from-[var(--rc-orange)] to-amber-500 flex items-center justify-center text-white shadow-xl text-3xl font-bold uppercase ring-4 ring-white/10">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl lg:text-4xl font-bold tracking-tight text-white">{user.name}</h1>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--rc-orange)]/20 text-[var(--rc-orange)] border border-[var(--rc-orange)]/30 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    {user.role}
                  </span>
                </div>
                <p className="text-white/70 text-sm flex items-center gap-4 flex-wrap">
                  {user.email && <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-[var(--rc-orange)]" /> {user.email}</span>}
                  {user.phoneNumber && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-[var(--rc-orange)]" /> {user.phoneNumber}</span>}
                  {user.uniqueId && <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-[var(--rc-orange)]" /> ID: {user.uniqueId}</span>}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="px-6 py-3 bg-[var(--rc-blue)] text-white font-bold rounded-xl hover:bg-[var(--rc-orange)] transition-colors shadow-lg flex items-center gap-2 text-sm"
                >
                  <Shield className="w-4 h-4" /> Admin Portal
                </Link>
              )}
              <button
                onClick={logout}
                className="px-6 py-3 bg-white/10 hover:bg-red-500/20 text-white font-bold rounded-xl transition-colors border border-white/20 hover:border-red-500/40 flex items-center gap-2 text-sm"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Success/Error Notifications */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-700 rounded-2xl flex items-center gap-3 font-medium"
            >
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              Your profile records and contact information have been updated successfully!
            </motion.div>
          )}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-600 rounded-2xl flex items-center gap-3 font-medium"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[var(--rc-border)] mb-8 gap-4 flex-wrap">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-4 px-3 sm:px-6 text-sm font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "overview"
                  ? "border-[var(--rc-orange)] text-[var(--rc-dark)] font-bold"
                  : "border-transparent text-[var(--rc-muted)] hover:text-[var(--rc-dark)]"
              }`}
            >
              <User className="w-4 h-4" /> My Account
            </button>
            <button
              onClick={() => setActiveTab("estimates")}
              className={`pb-4 px-3 sm:px-6 text-sm font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "estimates"
                  ? "border-[var(--rc-orange)] text-[var(--rc-dark)] font-bold"
                  : "border-transparent text-[var(--rc-muted)] hover:text-[var(--rc-dark)]"
              }`}
            >
              <Calculator className="w-4 h-4" /> Saved Estimates
              {recordsData?.estimates && recordsData.estimates.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-[var(--rc-orange)] text-white rounded-full font-extrabold">
                  {recordsData.estimates.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("inquiries")}
              className={`pb-4 px-3 sm:px-6 text-sm font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "inquiries"
                  ? "border-[var(--rc-orange)] text-[var(--rc-dark)] font-bold"
                  : "border-transparent text-[var(--rc-muted)] hover:text-[var(--rc-dark)]"
              }`}
            >
              <FileText className="w-4 h-4" /> Inquiries & Leads
              {recordsData && (recordsData.leads.length + recordsData.inquiries.length) > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-[var(--rc-blue)] text-white rounded-full font-extrabold">
                  {recordsData.leads.length + recordsData.inquiries.length}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => refetch()}
            title="Refresh Records"
            className="p-2 text-[var(--rc-muted)] hover:text-[var(--rc-orange)] rounded-full hover:bg-white transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${recordsLoading ? "animate-spin text-[var(--rc-orange)]" : ""}`} />
          </button>
        </div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Account Card */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-[var(--rc-border)] shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-[var(--rc-border)]">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--rc-dark)]">Account Information</h2>
                    <p className="text-xs text-[var(--rc-muted)] mt-1">Manage your official credentials and contact details</p>
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-[var(--rc-gray)] hover:bg-[var(--rc-orange)] hover:text-white text-[var(--rc-dark)] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Details
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-xs text-[var(--rc-muted)] hover:underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <span className="text-xs text-[var(--rc-muted)] block mb-1 uppercase tracking-wider font-semibold">Full Name</span>
                        <div className="text-base font-medium text-[var(--rc-dark)] flex items-center gap-2">
                          <User className="w-4 h-4 text-[var(--rc-orange)]" />
                          {user.name}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-[var(--rc-muted)] block mb-1 uppercase tracking-wider font-semibold">Email Address</span>
                        <div className="text-base font-medium text-[var(--rc-dark)] flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[var(--rc-orange)]" />
                          {user.email || "Not set"}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-[var(--rc-muted)] block mb-1 uppercase tracking-wider font-semibold">Phone Number</span>
                        <div className="text-base font-medium text-[var(--rc-dark)] flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[var(--rc-orange)]" />
                          {user.phoneNumber || "Not provided yet"}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-[var(--rc-muted)] block mb-1 uppercase tracking-wider font-semibold">Account Type</span>
                        <div className="text-base font-medium text-[var(--rc-dark)] flex items-center gap-2 capitalize">
                          <Shield className="w-4 h-4 text-[var(--rc-blue)]" />
                          {user.authType} account ({user.role})
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div>
                      <label className="text-xs font-semibold uppercase text-[var(--rc-dark)] block mb-2">Display Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-[var(--rc-border)] rounded-xl focus:bg-white focus:ring-2 focus:ring-[var(--rc-orange)] outline-none text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase text-[var(--rc-dark)] block mb-2">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-[var(--rc-border)] rounded-xl focus:bg-white focus:ring-2 focus:ring-[var(--rc-orange)] outline-none text-sm font-medium"
                        placeholder="yourname@domain.com"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase text-[var(--rc-dark)] block mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-[var(--rc-border)] rounded-xl focus:bg-white focus:ring-2 focus:ring-[var(--rc-orange)] outline-none text-sm font-medium"
                        placeholder="+91 9999999999"
                      />
                    </div>
                    <div className="pt-2 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 text-sm font-bold text-[var(--rc-muted)] hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updateProfile.isPending}
                        className="px-8 py-3 bg-[var(--rc-orange)] text-white text-sm font-bold rounded-xl hover:bg-[var(--rc-dark)] transition-all shadow-lg disabled:opacity-50"
                      >
                        {updateProfile.isPending ? "Saving changes..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Quick Record Stats Panel */}
              <div className="bg-[var(--rc-blue)] text-white rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                    <Sparkles className="w-6 h-6 text-[var(--rc-orange)]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">My Record System</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">
                    All your cost estimates, project inquiries, and brand consultations are automatically organized here under your verified account credentials.
                  </p>

                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/80 flex items-center gap-2"><Calculator className="w-4 h-4 text-[var(--rc-orange)]" /> Saved Estimates</span>
                      <span className="font-bold text-lg">{recordsData?.estimates?.length ?? 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/80 flex items-center gap-2"><FileText className="w-4 h-4 text-emerald-400" /> Active Inquiries</span>
                      <span className="font-bold text-lg">{((recordsData?.leads?.length ?? 0) + (recordsData?.inquiries?.length ?? 0))}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/services"
                  className="mt-8 w-full py-4 bg-white text-[var(--rc-blue)] hover:bg-[var(--rc-orange)] hover:text-white text-center font-bold text-sm uppercase tracking-wider rounded-xl transition-colors shadow-lg block"
                >
                  Explore Build Services
                </Link>
              </div>
            </motion.div>
          )}

          {activeTab === "estimates" && (
            <motion.div
              key="estimates"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {recordsLoading ? (
                <div className="py-20 text-center text-[var(--rc-muted)]">Loading your saved estimates...</div>
              ) : recordsData && recordsData.estimates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recordsData.estimates.map((item) => (
                    <div key={item.id} className="bg-white rounded-3xl p-6 border border-[var(--rc-border)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 bg-orange-50 text-[var(--rc-orange)] text-xs font-bold rounded-full border border-orange-200">
                            {item.referenceId}
                          </span>
                          <span className="text-xs text-[var(--rc-muted)] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {formatDate(item.createdAt)}
                          </span>
                        </div>
                        <h4 className="font-bold text-lg text-[var(--rc-dark)] capitalize mb-1 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[var(--rc-orange)]" /> {item.city || "General Location"}
                        </h4>
                        <p className="text-xs text-[var(--rc-muted)] mb-4">{item.propertyType || "Residential Construction"}</p>
                        
                        <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded-2xl p-3 mb-6 border border-[var(--rc-border)]">
                          <div className="text-center">
                            <span className="text-[10px] text-[var(--rc-muted)] uppercase block font-bold">Plot Size</span>
                            <span className="text-xs font-semibold text-[var(--rc-dark)]">{item.plotSize || "N/A"} sq.ft</span>
                          </div>
                          <div className="text-center border-x border-gray-200">
                            <span className="text-[10px] text-[var(--rc-muted)] uppercase block font-bold">Floors</span>
                            <span className="text-xs font-semibold text-[var(--rc-dark)]">{item.floors || 1}</span>
                          </div>
                          <div className="text-center">
                            <span className="text-[10px] text-[var(--rc-muted)] uppercase block font-bold">Quality</span>
                            <span className="text-xs font-semibold text-[var(--rc-orange)] capitalize">{item.quality || "Standard"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[var(--rc-border)] flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-[var(--rc-muted)] block font-semibold uppercase">Estimated Range</span>
                          <span className="text-lg font-bold text-[var(--rc-blue)]">{item.estimatedCost || "Calculated Quote"}</span>
                        </div>
                        <Link
                          to="/contact"
                          className="px-4 py-2.5 bg-[var(--rc-dark)] text-white text-xs font-bold rounded-xl hover:bg-[var(--rc-orange)] transition-colors"
                        >
                          Proceed
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-[var(--rc-border)] max-w-xl mx-auto">
                  <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--rc-orange)]">
                    <Calculator className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--rc-dark)] mb-2">No Saved Estimates Yet</h3>
                  <p className="text-sm text-[var(--rc-muted)] mb-8 leading-relaxed">
                    Use our instant interactive cost calculator to simulate construction pricing, materials, and floor layouts. You can save estimates directly to your account record here!
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--rc-orange)] text-white font-bold rounded-xl hover:bg-[var(--rc-dark)] transition-all shadow-lg"
                  >
                    Calculate Your First Estimate
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "inquiries" && (
            <motion.div
              key="inquiries"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {recordsLoading ? (
                <div className="py-20 text-center text-[var(--rc-muted)]">Loading your inquiries...</div>
              ) : recordsData && (recordsData.leads.length + recordsData.inquiries.length) > 0 ? (
                <div className="space-y-4 max-w-4xl mx-auto">
                  {recordsData.leads.map((lead) => (
                    <div key={`lead-${lead.id}`} className="bg-white rounded-2xl p-6 border border-[var(--rc-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[var(--rc-blue)] shrink-0 mt-1 sm:mt-0">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-base text-[var(--rc-dark)]">{lead.projectType || "Turnkey Construction Inquiry"}</h4>
                            <span className="px-2.5 py-0.5 bg-blue-100 text-[var(--rc-blue)] text-xs font-bold rounded-full capitalize">
                              {lead.status || "New"}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--rc-muted)] mb-1">
                            Location: {lead.city || "NCR"} | Budget: {lead.budget || "TBD"} | Timeline: {lead.timeline || "Immediate"}
                          </p>
                          <span className="text-[11px] font-semibold text-[var(--rc-orange)]">Ref: {lead.referenceId}</span>
                        </div>
                      </div>
                      <div className="text-right text-xs text-[var(--rc-muted)] shrink-0 self-end sm:self-center">
                        <div>Submitted on</div>
                        <div className="font-bold text-[var(--rc-dark)]">{formatDate(lead.createdAt)}</div>
                      </div>
                    </div>
                  ))}

                  {recordsData.inquiries.map((contact) => (
                    <div key={`contact-${contact.id}`} className="bg-white rounded-2xl p-6 border border-[var(--rc-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[var(--rc-orange)] shrink-0 mt-1 sm:mt-0">
                          <Mail className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-base text-[var(--rc-dark)]">{contact.service || "Consultation Request"}</h4>
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full capitalize">
                              {contact.status || "New"}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--rc-muted)] line-clamp-1 mb-1">
                            Message: {contact.message || "Requested consultation from engineering desk."}
                          </p>
                          {contact.city && <span className="text-[11px] font-semibold text-[var(--rc-muted)]">City: {contact.city}</span>}
                        </div>
                      </div>
                      <div className="text-right text-xs text-[var(--rc-muted)] shrink-0 self-end sm:self-center">
                        <div>Submitted on</div>
                        <div className="font-bold text-[var(--rc-dark)]">{formatDate(contact.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-[var(--rc-border)] max-w-xl mx-auto">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--rc-blue)]">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--rc-dark)] mb-2">No Inquiries Found</h3>
                  <p className="text-sm text-[var(--rc-muted)] mb-8 leading-relaxed">
                    When you request architectural consultations, submit building inquiries, or interact with our guided engineering flow, your conversation logs and lead status will appear here.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--rc-blue)] text-white font-bold rounded-xl hover:bg-[var(--rc-orange)] transition-all shadow-lg"
                  >
                    Start a Consultation
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
