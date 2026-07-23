import { useState } from "react";
import { Calculator, ArrowRight, Home, ArrowLeft } from "lucide-react";

export default function CostCalculator() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    city: "",
    spot: "",
    plotArea: "",
    floors: "",
    quality: "",
  });

  const citySpots: Record<string, string[]> = {
    Gurgaon: ["DLF Phases", "Sector 57", "Golf Course Road", "Other / All"],
    Delhi: ["South Delhi", "West Delhi", "Dwarka", "Other / All"],
    Noida: ["Sector 15", "Sector 62", "Expressway", "Other / All"],
    Faridabad: ["Sector 14", "Green Fields", "NIT", "Other / All"]
  };

  const baseRates = {
    standard: 1500,
    premium: 2200,
    luxury: 3500,
  };

  const calculateEstimate = () => {
    const area = parseInt(formData.plotArea) || 0;
    const floors = parseInt(formData.floors) || 0;
    const rate = baseRates[formData.quality as keyof typeof baseRates] || 1500;
    
    const minCost = area * floors * rate * 0.9;
    const maxCost = area * floors * rate * 1.2;

    const formatINR = (amount: number) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(amount);
    };

    return {
      min: formatINR(minCost),
      max: formatINR(maxCost)
    };
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.city !== "";
      case 2: return formData.spot !== "";
      case 3: return parseInt(formData.plotArea) > 0 && parseInt(formData.floors) > 0;
      case 4: return formData.quality !== "";
      default: return true;
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[var(--rc-border)]">
      <div className="bg-[var(--rc-dark)] p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[var(--rc-orange)]/20 flex items-center justify-center text-[var(--rc-orange)]">
            <Calculator className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-semibold">Cost Estimator</h3>
        </div>
        <p className="text-white/60 text-sm">
          Get an instant rough estimate for your construction project.
        </p>
        
        <div className="flex gap-2 mt-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-[var(--rc-orange)]" : "bg-white/10"
              }`} 
            />
          ))}
        </div>
      </div>

      <div className="p-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h4 className="text-lg font-medium text-[var(--rc-dark)]">Where is your project located?</h4>
            <div className="grid grid-cols-2 gap-4">
              {["Gurgaon", "Delhi", "Noida", "Faridabad"].map((city) => (
                <button
                  key={city}
                  onClick={() => setFormData({ ...formData, city, spot: "" })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.city === city
                      ? "border-[var(--rc-orange)] bg-[var(--rc-orange)]/5 text-[var(--rc-dark)] font-medium"
                      : "border-[var(--rc-border)] text-[var(--rc-muted)] hover:border-[var(--rc-blue)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--rc-orange)]"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h4 className="text-lg font-medium text-[var(--rc-dark)]">Which area in {formData.city}?</h4>
            <div className="grid grid-cols-2 gap-4">
              {(citySpots[formData.city] || ["Other / All"]).map((spot) => (
                <button
                  key={spot}
                  onClick={() => setFormData({ ...formData, spot })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.spot === spot
                      ? "border-[var(--rc-orange)] bg-[var(--rc-orange)]/5 text-[var(--rc-dark)] font-medium"
                      : "border-[var(--rc-border)] text-[var(--rc-muted)] hover:border-[var(--rc-blue)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--rc-orange)]"
                  }`}
                >
                  {spot}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h4 className="text-lg font-medium text-[var(--rc-dark)]">Project Dimensions</h4>
            
            <div className="space-y-4">
              <div>
                <label className="text-label text-[var(--rc-muted)] block mb-2">Plot Area (Sq Ft)</label>
                <input 
                  type="number"
                  value={formData.plotArea}
                  onChange={(e) => setFormData({ ...formData, plotArea: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--rc-border)] focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)] focus:outline-none transition-all"
                  placeholder="e.g. 2000"
                />
              </div>
              
              <div>
                <label className="text-label text-[var(--rc-muted)] block mb-3">Number of Floors</label>
                <div className="flex gap-2 mb-3">
                  {['1', '2', '3', '4'].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, floors: num })}
                      className={`flex-1 py-2.5 rounded-lg font-bold transition-all border ${
                        formData.floors === num
                          ? "bg-[var(--rc-orange)] border-[var(--rc-orange)] text-white shadow-md"
                          : "bg-white border-[var(--rc-border)] text-[var(--rc-muted)] hover:border-[var(--rc-orange)] hover:text-[var(--rc-orange)]"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, floors: parseInt(formData.floors) > 4 ? formData.floors : '5' })}
                    className={`flex-1 py-2.5 rounded-lg font-bold transition-all border ${
                      parseInt(formData.floors || '1') > 4
                        ? "bg-[var(--rc-orange)] border-[var(--rc-orange)] text-white shadow-md"
                        : "bg-white border-[var(--rc-border)] text-[var(--rc-muted)] hover:border-[var(--rc-orange)] hover:text-[var(--rc-orange)]"
                    }`}
                  >
                    More
                  </button>
                </div>
                {parseInt(formData.floors || '1') > 4 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                    <input 
                      type="number"
                      min="5" max="100"
                      value={formData.floors}
                      onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--rc-border)] focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)] focus:outline-none transition-all"
                      placeholder="Enter number of floors (e.g. 5)"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h4 className="text-lg font-medium text-[var(--rc-dark)]">Quality & Finishes</h4>
            <div className="space-y-3">
              {[
                { id: "standard", label: "Standard", desc: "Basic finishes, reliable materials" },
                { id: "premium", label: "Premium", desc: "High-quality fittings, better flooring" },
                { id: "luxury", label: "Luxury", desc: "Imported materials, smart home features" }
              ].map((q) => (
                <button
                  key={q.id}
                  onClick={() => setFormData({ ...formData, quality: q.id })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-4 focus:outline-none focus:ring-2 focus:ring-[var(--rc-orange)] ${
                    formData.quality === q.id
                      ? "border-[var(--rc-orange)] bg-[var(--rc-orange)]/5"
                      : "border-[var(--rc-border)] hover:border-[var(--rc-blue)]/30"
                  }`}
                >
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    formData.quality === q.id ? "border-[var(--rc-orange)]" : "border-[var(--rc-muted)]"
                  }`}>
                    {formData.quality === q.id && <div className="w-2.5 h-2.5 rounded-full bg-[var(--rc-orange)]" />}
                  </div>
                  <div>
                    <div className={`font-medium ${formData.quality === q.id ? "text-[var(--rc-dark)]" : "text-[var(--rc-muted)]"}`}>
                      {q.label}
                    </div>
                    <div className="text-sm text-[var(--rc-muted)] mt-1">{q.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-xl font-medium text-[var(--rc-dark)] mb-2">Estimated Construction Cost</h4>
            <p className="text-sm text-[var(--rc-muted)] mb-6">Based on your inputs for a {formData.floors}-floor building in {formData.spot}, {formData.city}</p>
            
            <div className="p-6 bg-[var(--rc-gray)] rounded-2xl border border-[var(--rc-border)] mb-8">
              <div className="text-3xl lg:text-4xl font-semibold text-[var(--rc-blue)] mb-2 tracking-tight">
                {calculateEstimate().min} <span className="text-[var(--rc-muted)] text-xl font-normal mx-2">to</span> {calculateEstimate().max}
              </div>
              <p className="text-xs text-[var(--rc-muted)] mt-4">
                *This is a rough estimate. Actual costs may vary based on specific site conditions, architectural design, and final material selection.
              </p>
            </div>

            <button
              onClick={() => {
                setStep(1);
                setFormData({ city: "", spot: "", plotArea: "", floors: "", quality: "" });
              }}
              className="text-[var(--rc-orange)] font-medium hover:underline text-sm focus:outline-none focus:ring-2 focus:ring-[var(--rc-orange)] rounded-md px-2 py-1"
            >
              Calculate Again
            </button>
          </div>
        )}

        {step < 5 && (
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--rc-border)]">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="text-[var(--rc-muted)] hover:text-[var(--rc-dark)] font-medium disabled:opacity-0 transition-opacity flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--rc-orange)] rounded-md px-2 py-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={() => setStep(step + 1)}
              disabled={!isStepValid()}
              className="px-6 py-3 bg-[var(--rc-orange)] text-white rounded-full font-medium hover:bg-[var(--rc-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--rc-orange)]"
            >
              {step === 4 ? "Calculate" : "Next"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
