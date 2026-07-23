import { useState } from "react";
import { trpc } from "@/providers/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Loader2 } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    service: "",
    budget: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", city: "", service: "", budget: "", message: "" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    submitMutation.mutate(form);
  };

  const inputClasses = "w-full px-4 py-3.5 border border-white/60 rounded-xl bg-white/50 backdrop-blur-md focus:border-[var(--rc-orange)] focus:ring-1 focus:ring-[var(--rc-orange)] focus:outline-none transition-all placeholder:text-[var(--rc-muted)]/70";


  return (
    <div className="min-h-screen relative">
      <Navbar />

      {/* Background Image with Premium Gradient Fade */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80" 
          alt="Welcoming Modern Home Entrance"
          className="w-full h-full object-cover object-[center_20%] opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-[var(--rc-white)]/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--rc-white)]/60 to-[var(--rc-white)]" />
      </div>

      <section className="pt-32 pb-16 relative z-10">
        <div className="container-rc">
          <div className="max-w-2xl bg-white/50 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-white/60 shadow-xl">
            <p className="text-label text-[var(--rc-orange)] mb-4">Get in Touch</p>
            <h1 className="text-display-2 text-[var(--rc-dark)] mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-[var(--rc-dark)]/80 font-medium">
              Ready to start your construction project? Fill out the form below
              and our team will get back to you within 24 hours.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 relative z-10">
        <div className="container-rc">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-[var(--rc-dark)] mb-2">
                    Thank You!
                  </h2>
                  <p className="text-[var(--rc-muted)] max-w-md">
                    Your message has been received. Our team will contact you
                    within 24 hours to discuss your project.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-6 py-3 bg-[var(--rc-blue)] text-white rounded-full text-sm font-medium hover:bg-[var(--rc-orange)] transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-label text-[var(--rc-dark)] font-semibold mb-2 block">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputClasses}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-label text-[var(--rc-dark)] font-semibold mb-2 block">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputClasses}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-label text-[var(--rc-dark)] font-semibold mb-2 block">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className={inputClasses}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="text-label text-[var(--rc-dark)] font-semibold mb-2 block">
                        City (Optional)
                      </label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className={inputClasses}
                        placeholder="Gurgaon / Delhi NCR"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-label text-[var(--rc-dark)] font-semibold mb-2 block">
                        Service Required (Optional)
                      </label>
                      <select
                        value={form.service}
                        onChange={(e) => setForm({ ...form, service: e.target.value })}
                        className={inputClasses}
                      >
                        <option value="">Select a service</option>
                        <option value="residential">Residential Construction</option>
                        <option value="commercial">Commercial Construction</option>
                        <option value="renovation">Renovation</option>
                        <option value="interior">Interior Design</option>
                        <option value="architecture">Architecture</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-label text-[var(--rc-dark)] font-semibold mb-2 block">
                        Budget Range (Optional)
                      </label>
                      <select
                        value={form.budget}
                        onChange={(e) => setForm({ ...form, budget: e.target.value })}
                        className={inputClasses}
                      >
                        <option value="">Select budget</option>
                        <option value="below-50l">Below 50 Lakhs</option>
                        <option value="50l-1cr">50 Lakhs - 1 Crore</option>
                        <option value="1cr-3cr">1 Crore - 3 Crores</option>
                        <option value="3cr-5cr">3 Crores - 5 Crores</option>
                        <option value="above-5cr">Above 5 Crores</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-label text-[var(--rc-dark)] font-semibold mb-2 block">
                      Message (Optional)
                    </label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`${inputClasses} resize-none`}
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="w-full py-4 bg-[var(--rc-orange)] text-white font-medium rounded-xl hover:bg-[var(--rc-dark)] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Request
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {submitMutation.isError && (
                    <p className="text-red-500 text-sm text-center">
                      Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              )}
            </div>

            <div className="space-y-8">
              <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-md border border-white/60 shadow-xl">
                <h3 className="text-lg font-semibold text-[var(--rc-dark)] mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[var(--rc-orange)] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-[var(--rc-dark)]">Office Address</p>
                      <p className="text-sm text-[var(--rc-muted)]">
                        5th floor, M3M broadway,
                        <br />
                        Sector 71
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[var(--rc-orange)] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-[var(--rc-dark)]">Phone</p>
                      <a
                        href="tel:+919311830088"
                        className="text-sm text-[var(--rc-muted)] hover:text-[var(--rc-blue)]"
                      >
                        +91 9311830088
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[var(--rc-orange)] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-[var(--rc-dark)]">Email</p>
                      <a
                        href="mailto:ujjwalt.rg@rupalihomes.com"
                        className="text-sm text-[var(--rc-muted)] hover:text-[var(--rc-blue)]"
                      >
                        ujjwalt.rg@rupalihomes.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[var(--rc-orange)] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-[var(--rc-dark)]">Working Hours</p>
                      <p className="text-sm text-[var(--rc-muted)]">
                        Mon - Sat: 9:00 AM - 7:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-[var(--rc-border)] aspect-square">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.857315731681!2d77.0913!3d28.4595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI3JzM0LjIiTiA3N8KwMDUnMjguNyJF!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Rupali Construction Office Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
