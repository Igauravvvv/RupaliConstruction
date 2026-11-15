import { useMemo, useState } from "react";
import { ArrowRight, Check, Search, Layers3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import SEO from "@/components/SEO";
import {
  categories,
  type Category,
  type SubCategory,
} from "@/data/brandStandardsData";
import CategoryModal from "@/components/brand-standards/CategoryModal";
import ContactModal from "@/components/brand-standards/ContactModal";

export default function BrandStandards() {
  const [selected, setSelected] = useState(categories[0].name);
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<{
    category: Category;
    material: SubCategory;
  } | null>(null);
  const materials = categories.flatMap(category =>
    category.subcategories.map(material => ({ category, material }))
  );
  const brands = new Set(
    materials.flatMap(({ material }) =>
      material.brands.map(brand => brand.name)
    )
  );
  const results = useMemo(
    () =>
      materials.filter(({ category, material }) => {
        if (!query.trim()) return category.name === selected;
        return [
          material.name,
          material.description,
          category.name,
          ...material.brands.map(b => b.name),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase());
      }),
    [selected, query]
  );
  const active = categories.find(category => category.name === selected)!;

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#0B2E59]">
      <SEO
        title="Materials & Brand Standards | Rupali Construction"
        description="Explore our structural, MEP, interior and finishing material guide. Compare brands, understand applications and review quality checks for your project."
        url="/brand-standards"
      />
      <Navbar />
      <div className="h-20 lg:h-24 bg-white" aria-hidden="true" />
      <main>
        <section className="relative overflow-hidden bg-[#0B2E59] pt-12 pb-14 sm:pt-20 sm:pb-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(77,122,182,0.35),transparent_65%)]" />
          <div className="container mx-auto px-5 sm:px-8 relative grid lg:grid-cols-[1.15fr_1fr] items-center gap-10 lg:gap-20">
            <div>
              <p className="text-xs uppercase tracking-[.24em] text-orange-300 font-semibold mb-5">
                The Rupali material library
              </p>
              <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl leading-[1.07] text-white">
                A better build.
                <br />
                <span className="text-[#c5d8f3]">Down to the details.</span>
              </h1>
              <p className="mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-blue-100/80">
                Behind every finish is a choice. Get to know the materials,
                brands and checks that go into your space.
              </p>
              <a
                href="#material-library"
                className="inline-flex items-center gap-3 rounded-full bg-[#ff6b14] text-white px-6 py-3.5 mt-7 font-semibold text-sm"
              >
                Explore the materials <ArrowRight size={17} />
              </a>
              <div className="mt-9 flex gap-7 sm:gap-10 border-t border-white/15 pt-6 text-blue-100/70 text-xs sm:text-sm">
                <span>
                  <strong className="block text-2xl text-white font-medium mb-1">
                    04
                  </strong>
                  Build stages
                </span>
                <span>
                  <strong className="block text-2xl text-white font-medium mb-1">
                    {materials.length}
                  </strong>
                  Material guides
                </span>
                <span>
                  <strong className="block text-2xl text-white font-medium mb-1">
                    {brands.size}
                  </strong>
                  Listed brands & sources
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {categories.map((category, i) => (
                <a
                  key={category.name}
                  href="#material-library"
                  onClick={() => {
                    setSelected(category.name);
                    setQuery("");
                  }}
                  className={`group relative overflow-hidden rounded-2xl aspect-[1.18] border border-white/15 ${i % 2 ? "translate-y-4" : ""}`}
                >
                  <img
                    src={category.image}
                    alt={`${category.name} materials`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06182d]/95 via-[#06182d]/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex justify-between items-center text-white">
                    <span className="text-sm sm:text-lg font-medium">
                      {category.name === "Interior"
                        ? "Interiors"
                        : category.name}
                    </span>
                    <ArrowRight size={17} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section
          id="material-library"
          className="container mx-auto px-5 sm:px-8 py-14 sm:py-20 scroll-mt-24"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#bd530f] mb-3">
                Know what goes into your home
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl">
                Good choices start here.
              </h2>
            </div>
            <label className="relative block w-full lg:w-80">
              <Search
                className="absolute left-4 top-3.5 text-slate-400"
                size={19}
              />
              <span className="sr-only">Search materials or brands</span>
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Try cement, UltraTech, lighting…"
                className="w-full bg-white border border-[#d6dfed] rounded-full py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#0B2E59]/30"
              />
            </label>
          </div>
          <div
            className="flex gap-2 overflow-x-auto pb-3 mb-7"
            aria-label="Material categories"
          >
            {categories.map(category => (
              <button
                key={category.name}
                aria-pressed={selected === category.name && !query}
                onClick={() => {
                  setSelected(category.name);
                  setQuery("");
                }}
                className={`shrink-0 inline-flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full text-sm border transition-colors ${selected === category.name && !query ? "bg-[#0B2E59] border-[#0B2E59] text-white" : "bg-white border-[#d6dfed] hover:bg-blue-50"}`}
              >
                <category.icon size={16} />
                {category.name === "Interior" ? "Interiors" : category.name}
                <span className="opacity-60 text-xs">
                  {category.subcategories.length}
                </span>
              </button>
            ))}
          </div>
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">
                {query
                  ? "Search results"
                  : `${selected === "Interior" ? "Interior" : selected} materials`}
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                {query
                  ? `${results.length} matching material guides`
                  : active.tagline}
              </p>
            </div>
            <span className="hidden sm:inline-flex text-xs text-slate-500 items-center gap-2 pt-1">
              <Layers3 size={15} /> Material → Brand → Details
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {results.map(({ category, material }) => (
              <button
                key={`${category.name}-${material.name}`}
                onClick={() => setDetail({ category, material })}
                className="group flex flex-col text-left bg-white rounded-2xl border border-[#dce4ef] overflow-hidden hover:shadow-lg hover:border-[#b3c5df] transition-all focus-visible:ring-2 focus-visible:ring-[#0B2E59]"
              >
                <div className="h-28 min-[380px]:h-32 sm:h-48 w-full shrink-0 overflow-hidden bg-[#e8edf4]">
                  <img
                    src={material.image}
                    alt={material.name}
                    loading="lazy"
                    className={`h-full w-full ${["Cement", "Plumbing", "Sealants", "Mechanical", "Hardware"].includes(material.name) ? "object-contain p-2 sm:p-4 bg-white" : "object-cover"} group-hover:scale-105 transition-transform duration-500`}
                  />
                </div>
                <div className="p-3 sm:p-5 w-full flex flex-col flex-1">
                  <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-3 mb-2">
                    <h4 className="font-serif text-base min-[380px]:text-lg sm:text-2xl leading-tight min-h-10 sm:min-h-0">
                      <span className="sm:hidden">
                        {material.name === "Ready-Mix Concrete (RMC)"
                          ? "Ready-mix concrete"
                          : material.name}
                      </span>
                      <span className="hidden sm:inline">{material.name}</span>
                    </h4>
                    <ArrowRight
                      size={18}
                      className="hidden sm:block text-[#e96516] shrink-0"
                    />
                  </div>
                  <p className="hidden sm:line-clamp-2 text-sm text-slate-500 leading-relaxed min-h-10">
                    {material.description}
                  </p>
                  <div className="mt-auto sm:mt-4 border-t border-slate-100 pt-2 sm:pt-3">
                    <p className="hidden sm:line-clamp-2 text-xs leading-relaxed text-[#526681]">
                      {material.brands.map(b => b.name).join(" · ")}
                    </p>
                    <p className="sm:hidden text-[11px] text-[#526681]">
                      {material.brands.length}{" "}
                      {material.brands.length === 1 ? "brand" : "brands"}
                    </p>
                    <p className="text-[10px] sm:uppercase sm:tracking-[.14em] font-semibold mt-2 sm:mt-3 text-[#bd530f] flex items-center gap-1.5">
                      <span className="sm:hidden">
                        Explore{" "}
                        <span className="sr-only">
                          {material.name} materials and brands
                        </span>
                      </span>
                      <span className="hidden sm:inline">
                        Explore material & brands
                      </span>
                      <ArrowRight size={13} className="sm:hidden" />
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {!results.length && (
            <div className="rounded-2xl bg-white p-10 text-center">
              <p>
                No materials found. Try a brand name or a different material.
              </p>
              <button
                onClick={() => setQuery("")}
                className="mt-4 text-sm underline"
              >
                Clear search
              </button>
            </div>
          )}
        </section>

        <section className="bg-[#e9eff8] border-y border-[#d9e2f0] py-12 sm:py-16">
          <div className="container mx-auto px-5 sm:px-8 grid lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-16">
            <div>
              <p className="uppercase text-xs tracking-[.2em] text-[#bd530f] font-semibold mb-3">
                From selection to site
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl">
                The brand is only
                <br />
                part of the standard.
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                [
                  "01",
                  "Specify clearly",
                  "Agree on the product, grade, finish and scope before procurement.",
                ],
                [
                  "02",
                  "Check on arrival",
                  "Match delivery labels, batches and condition to the agreed specification.",
                ],
                [
                  "03",
                  "Install with care",
                  "Follow the approved drawings and manufacturer’s installation guidance.",
                ],
              ].map(([number, title, copy]) => (
                <div key={number}>
                  <span className="text-[#ad5b28] text-xs tracking-widest">
                    {number} /
                  </span>
                  <h3 className="font-semibold mt-3 mb-2">{title}</h3>
                  <p className="text-sm leading-relaxed text-[#526681]">
                    {copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="container mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <div className="bg-white border border-[#dce4ef] rounded-3xl p-7 sm:p-12 flex flex-col lg:flex-row justify-between gap-7 items-start lg:items-center">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl">
                Let’s choose what fits your project.
              </h2>
              <p className="text-slate-500 mt-3 max-w-xl leading-relaxed">
                Bring your plans, budget and preferences. We’ll help you put
                together a clear material specification.
              </p>
            </div>
            <ContactModal defaultService="Brand Standards Consultation">
              <button className="inline-flex items-center gap-3 bg-[#0B2E59] rounded-full text-white px-6 py-3.5 text-sm font-semibold whitespace-nowrap">
                Discuss your materials <ArrowRight size={17} />
              </button>
            </ContactModal>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mt-6 max-w-4xl flex items-start gap-2">
            <Check size={14} className="shrink-0 mt-0.5" />
            Brands shown are material options, not a claim of a formal
            partnership. Final products, grades and availability are confirmed
            in your project specification. Manufacturer images and trademarks
            belong to their respective owners.
          </p>
        </section>
      </main>
      <Footer />
      <CategoryModal
        isOpen={!!detail}
        onClose={() => setDetail(null)}
        category={detail?.category ?? null}
        initialSubcategory={detail?.material}
      />
    </div>
  );
}
