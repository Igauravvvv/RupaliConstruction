import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ExternalLink, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  brandDomains,
  type Category,
  type SubCategory,
  type Brand,
  type Product,
} from "@/data/brandStandardsData";

export default function CategoryModal({
  isOpen,
  onClose,
  category,
  initialSubcategory,
}: {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  initialSubcategory?: SubCategory;
}) {
  const [material, setMaterial] = useState<SubCategory | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const scroll = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setMaterial(initialSubcategory ?? null);
    setBrand(null);
    setProduct(null);
  }, [initialSubcategory, category, isOpen]);
  useEffect(() => {
    if (scroll.current) scroll.current.scrollTop = 0;
  }, [material, brand, product]);
  const title =
    product?.name ??
    brand?.name ??
    material?.name ??
    category?.name ??
    "Material guide";
  const website =
    brand?.website ||
    (brand && brandDomains[brand.name]
      ? `https://www.${brandDomains[brand.name]}`
      : undefined);
  const back = () => {
    if (product) setProduct(null);
    else if (brand) setBrand(null);
    else setMaterial(null);
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="max-w-[calc(100%-1rem)] sm:max-w-5xl p-0 gap-0 overflow-hidden rounded-2xl bg-[#f5f7fb] text-[#0B2E59] max-h-[92dvh] flex flex-col"
        onWheel={e => e.stopPropagation()}
      >
        <div className="bg-white border-b border-slate-200 px-5 sm:px-8 py-5 pr-12 shrink-0">
          <div className="flex items-center gap-3">
            {(brand || (material && !initialSubcategory)) && (
              <button
                onClick={back}
                aria-label="Back to previous level"
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#bd530f] mb-1">
                {category?.name} /{" "}
                {product
                  ? "Product guide"
                  : brand
                    ? material?.name
                    : "Material guide"}
              </p>
              <DialogTitle className="text-xl sm:text-2xl font-serif">
                {title}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="sr-only">
            Explore material applications, listed brands and project quality
            checks.
          </DialogDescription>
        </div>
        <div
          ref={scroll}
          className="overflow-y-auto overscroll-contain p-3 sm:p-8 min-h-0"
          data-lenis-prevent
        >
          {!material && (
            <div className="grid sm:grid-cols-2 gap-4">
              {category?.subcategories.map(sub => (
                <button
                  key={sub.name}
                  onClick={() => setMaterial(sub)}
                  className="bg-white border rounded-xl overflow-hidden text-left"
                >
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="h-40 w-full object-cover"
                  />
                  <span className="p-5 flex items-center justify-between font-semibold">
                    {sub.name}
                    <ArrowRight size={18} />
                  </span>
                </button>
              ))}
            </div>
          )}
          {material && !brand && (
            <div className="space-y-8">
              <div className="grid grid-cols-[.7fr_1fr] sm:grid-cols-2 bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <img
                  src={material.image}
                  alt={material.name}
                  className={`w-full h-full min-h-40 sm:h-64 ${["Cement", "Plumbing", "Sealants", "Mechanical", "Hardware"].includes(material.name) ? "object-contain p-5" : "object-cover"}`}
                />
                <div className="p-4 sm:p-8">
                  <h2 className="font-serif text-2xl sm:text-3xl mb-3">
                    {material.name}
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                    {material.description}
                  </p>
                  <div className="hidden sm:flex flex-wrap gap-2 mt-5">
                    {material.whereUsed?.slice(0, 5).map(use => (
                      <span
                        key={use}
                        className="text-xs bg-blue-50 text-[#365575] rounded-full px-3 py-1.5"
                      >
                        {use}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <section>
                <h3 className="font-serif text-2xl mb-1">Explore the brands</h3>
                <p className="text-sm text-slate-500 mb-5">
                  Choose a brand for its overview, products and manufacturer
                  information.
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {material.brands.map(item => (
                    <button
                      key={item.name}
                      onClick={() => setBrand(item)}
                      className="group min-w-0 flex flex-col text-left bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div
                        className={`h-24 sm:h-36 w-full shrink-0 ${["Legrand", "Astral Pipes", "Jindal Steel", "Schneider Electric"].includes(item.name) ? "bg-[#0B2E59]" : "bg-white"} p-3 sm:p-6 flex items-center justify-center border-b border-slate-100`}
                      >
                        <img
                          src={item.image}
                          alt={`${item.name} brand image`}
                          loading="lazy"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="p-3 sm:p-5 flex flex-col flex-1 w-full">
                        <h4 className="font-semibold text-sm sm:text-base leading-snug mb-2">
                          {item.name}
                        </h4>
                        <p className="hidden sm:line-clamp-2 text-xs leading-relaxed text-slate-500">
                          {item.description}
                        </p>
                        <span className="mt-auto pt-2 sm:pt-4 inline-flex gap-1.5 sm:gap-2 items-center text-[11px] sm:text-xs font-semibold text-[#bd530f]">
                          View brand <ArrowRight size={14} />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
              <div className="grid md:grid-cols-2 gap-5">
                <section className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="font-semibold mb-3">What to know</h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {material.whatIsIt}
                  </p>
                </section>
                <section className="bg-[#e7eef8] rounded-2xl p-6">
                  <h3 className="font-semibold mb-4">What we check</h3>
                  <ul className="space-y-3">
                    {material.qualityChecks?.map(check => (
                      <li
                        key={check}
                        className="flex items-start gap-2 text-sm text-[#405b7b]"
                      >
                        <Check
                          size={16}
                          className="text-[#bd530f] shrink-0 mt-0.5"
                        />
                        {check}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
              {material.constructionTip && (
                <aside className="rounded-xl bg-[#fff2e6] p-5 flex items-start gap-3">
                  <Info size={20} className="shrink-0 text-[#bd530f]" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1">
                      A practical tip
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {material.constructionTip}
                    </p>
                  </div>
                </aside>
              )}
            </div>
          )}
          {brand && !product && (
            <div className="space-y-7">
              <div className="grid sm:grid-cols-[.7fr_1fr] bg-white border rounded-2xl overflow-hidden">
                <div
                  className={`p-8 h-52 sm:h-auto flex items-center justify-center ${["Legrand", "Astral Pipes", "Jindal Steel", "Schneider Electric"].includes(brand.name) ? "bg-[#0B2E59]" : ""}`}
                >
                  <img
                    src={brand.image}
                    alt={`${brand.name} brand image`}
                    className="max-h-48 max-w-full object-contain"
                  />
                </div>
                <div className="p-6 sm:p-8 sm:border-l border-slate-100">
                  <h2 className="font-serif text-3xl mb-4">{brand.name}</h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {brand.description}
                  </p>
                  {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm bg-[#0B2E59] text-white mt-5"
                    >
                      Manufacturer website <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
              {brand.keyBenefits && (
                <div className="flex flex-wrap gap-2">
                  {brand.keyBenefits.map(benefit => (
                    <span
                      key={benefit}
                      className="px-3 py-2 bg-white border rounded-full text-xs"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              )}
              {!!brand.products?.length && (
                <section>
                  <h3 className="font-serif text-2xl mb-5">Product guide</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {brand.products.map(item => (
                      <button
                        key={item.name}
                        onClick={() => setProduct(item)}
                        className="min-w-0 flex flex-col bg-white border rounded-2xl p-3 sm:p-5 text-left hover:border-blue-300"
                      >
                        <img
                          src={item.image}
                          alt={
                            item.image === brand.image
                              ? `${brand.name} brand reference`
                              : item.name
                          }
                          className="w-full h-24 sm:h-40 object-contain mb-3 sm:mb-5"
                        />
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="hidden sm:line-clamp-2 text-xs text-slate-500 mt-2 leading-relaxed">
                          {item.description}
                        </p>
                        <span className="inline-flex gap-1.5 sm:gap-2 items-center text-[11px] sm:text-xs font-semibold mt-auto pt-3 sm:pt-4 text-[#bd530f]">
                          Explore details <ArrowRight size={14} />
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              )}
              <p className="text-xs text-slate-500 leading-relaxed">
                Product selection and grade are subject to the agreed project
                specification. Confirm current technical data and availability
                with the manufacturer.
              </p>
            </div>
          )}
          {product && (
            <div className="space-y-6">
              <div className="bg-white border rounded-2xl p-6 grid sm:grid-cols-2 gap-8 items-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-60 object-contain"
                />
                <div>
                  <h2 className="font-serif text-3xl mb-4">{product.name}</h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {product.description}
                  </p>
                  <div className="hidden sm:flex flex-wrap gap-2 mt-5">
                    {[product.grade, product.type]
                      .filter(Boolean)
                      .map((value, i) => (
                        <span
                          key={i}
                          className="bg-blue-50 text-xs rounded-full px-3 py-2"
                        >
                          {value}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
              <section className="bg-white border rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Features & applications</h3>
                <ul className="space-y-3">
                  {product.features.map(feature => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <Check size={16} className="shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {product.installationNotes && (
                  <p className="mt-5 text-sm text-slate-500 leading-relaxed">
                    {product.installationNotes}
                  </p>
                )}
              </section>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
