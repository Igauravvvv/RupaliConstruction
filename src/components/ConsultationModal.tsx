import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { 
  X, CheckCircle2, Phone, Calendar, Clock, 
  MapPin, ShieldCheck, ArrowRight, Loader2, Sparkles
} from "lucide-react";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName?: string;
  defaultMessage?: string;
}

export default function ConsultationModal({
  isOpen,
  onClose,
  serviceName = "Residential Construction",
  defaultMessage = "",
}: ConsultationModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Gurugram");
  const [service, setService] = useState(serviceName);
  const [preferredTime, setPreferredTime] = useState("Morning (10 AM - 1 PM)");
  const [consultationMode, setConsultationMode] = useState<"site" | "studio" | "call">("site");
  const [notes, setNotes] = useState(defaultMessage);
  const [submitted, setSubmitted] = useState(false);

  // Sync service if prop changes
  if (serviceName && service !== serviceName && !submitted && !name) {
    setService(serviceName);
  }

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const fullMessage = `[Consultation Request - ${service}]
Preferred Mode: ${consultationMode === 'site' ? 'On-Site Plot / Property Visit' : consultationMode === 'studio' ? 'M3M Broadway Studio Meeting' : 'Phone / Video Call'}
Preferred Slot: ${preferredTime}
Location / Sector: ${city}
Client Notes: ${notes || 'No specific notes provided.'}`;

    submitMutation.mutate({
      name,
      email: email.trim() || `${phone.replace(/[^0-9]/g, "") || "client"}@rupaliconsult.com`,
      phone,
      city,
      service,
      message: fullMessage,
    });
  };

  const whatsappUrl = `https://wa.me/919311830088?text=${encodeURIComponent(
    `Hello Rupali Construction, I would like to book a consultation for ${service} in Gurgaon.`
  )}`;

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 md:p-6"
      data-lenis-prevent="true"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-gray-100 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[var(--rc-dark)] to-[#1E293B] text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-36 h-36 bg-[var(--rc-orange)]/20 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[var(--rc-orange)] animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rc-orange)]">
                Direct Engineering Consultation
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              Book a Call / Consultancy
            </h2>
            <p className="text-xs text-gray-300 mt-0.5">
              Dedicated expert guidance for <span className="text-white font-semibold">{service}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1 bg-white">
          {submitted ? (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[var(--rc-dark)] mb-2">
                Consultation Request Confirmed!
              </h3>
              <p className="text-sm text-gray-600 max-w-sm mb-6">
                Thank you, <span className="font-semibold text-gray-900">{name}</span>. Our Senior Project Engineer will review your requirements for <span className="font-semibold text-[var(--rc-blue)]">{service}</span> and connect with you within 2 business hours.
              </p>

              <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left mb-6 text-xs text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Guaranteed fixed pricing & 100% genuine Grade-A materials.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--rc-orange)] shrink-0" />
                  <span>Selected Slot: <strong className="text-gray-800">{preferredTime}</strong></span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  Chat Immediately
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Mode Selection */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                  Select Consultation Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setConsultationMode("site")}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                      consultationMode === "site"
                        ? "border-[var(--rc-orange)] bg-orange-50 text-[var(--rc-orange)] font-semibold shadow-xs"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    🏡 On-Site Visit
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultationMode("studio")}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                      consultationMode === "studio"
                        ? "border-[var(--rc-orange)] bg-orange-50 text-[var(--rc-orange)] font-semibold shadow-xs"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    🏢 Studio Meet
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultationMode("call")}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                      consultationMode === "call"
                        ? "border-[var(--rc-orange)] bg-orange-50 text-[var(--rc-orange)] font-semibold shadow-xs"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    📞 Phone / Video
                  </button>
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Gaurav Sharma"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--rc-orange)]/30 focus:border-[var(--rc-orange)] transition-all bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--rc-orange)]/30 focus:border-[var(--rc-orange)] transition-all bg-gray-50/50"
                  />
                </div>
              </div>

              {/* Service & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Service Required
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--rc-orange)]/30 focus:border-[var(--rc-orange)] transition-all bg-white text-gray-800"
                  >
                    <option value="Residential Construction">Residential Construction</option>
                    <option value="Renovation">Renovation & Remodeling</option>
                    <option value="Commercial Construction">Commercial Construction</option>
                    <option value="Interior Design">Interior Design</option>
                    <option value="Architectural Design">Architectural Design</option>
                    <option value="Structural Engineering">Structural Engineering</option>
                    <option value="Turnkey Villa Package">Turnkey Villa Package</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Plot / Property Location (Gurgaon)
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. DLF Phase 1, Sector 43"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--rc-orange)]/30 focus:border-[var(--rc-orange)] transition-all bg-gray-50/50"
                  />
                </div>
              </div>

              {/* Preferred Slot */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">
                  Preferred Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    "Morning (10 AM - 1 PM)",
                    "Afternoon (1 PM - 5 PM)",
                    "Evening (5 PM - 8 PM)",
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setPreferredTime(slot)}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        preferredTime === slot
                          ? "border-[var(--rc-blue)] bg-blue-50 text-[var(--rc-blue)] font-semibold"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {slot.split(" ")[0]}
                      <span className="block text-[10px] text-gray-500 font-normal">
                        {slot.split("(")[1]?.replace(")", "")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Requirements Note */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">
                  Project Details / Specific Questions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 350 sq yd plot in Sushant Lok 1, looking to construct basement + stilt + 4 floors..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--rc-orange)]/30 focus:border-[var(--rc-orange)] transition-all bg-gray-50/50 resize-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full py-3.5 px-6 rounded-2xl bg-[var(--rc-orange)] hover:bg-orange-600 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Confirming Consultation...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Confirm Free Consultation Call
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Alternative Quick Contact */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Prefer instant connection?</span>
                <div className="flex items-center gap-3">
                  <a
                    href="tel:+919311830088"
                    className="text-[var(--rc-blue)] font-semibold hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    +91 93118 30088
                  </a>
                  <span>•</span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    WhatsApp Chat
                  </a>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
