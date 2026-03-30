import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Scheme, createScheme, resolveSchemeAssetUrl, updateScheme, uploadSchemeThumbnail } from "../api/schemes";

interface AdminSchemeFormProps {
  scheme?: Scheme | null;
  onSuccess: () => void;
  onCancel: () => void;
}

type FormState = {
  title: string;
  slug: string;
  description: string;
  category: string;
  year: number;
  status: "active" | "inactive";
  eligibility: string;
  launchDate: string;
  agency: string;
  learnMoreUrl: string;
  displayOrder: number;
  isPublished: boolean;
  benefits: string;
  applicationProcess: string;
  thumbnailPath: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const CATEGORY_OPTIONS = [
  { value: "general", en: "General", mr: "सर्वसाधारण" },
  { value: "agriculture", en: "Agriculture", mr: "कृषी" },
  { value: "education", en: "Education", mr: "शिक्षण" },
  { value: "health", en: "Health", mr: "आरोग्य" },
  { value: "women-child", en: "Women & Child", mr: "महिला व बालक" },
  { value: "employment", en: "Employment", mr: "रोजगार" },
  { value: "housing", en: "Housing", mr: "गृह" },
  { value: "social-welfare", en: "Social Welfare", mr: "सामाजिक कल्याण" },
  { value: "senior-citizen", en: "Senior Citizen", mr: "ज्येष्ठ नागरिक" },
  { value: "entrepreneurship", en: "Entrepreneurship", mr: "उद्योजकता" },
  { value: "digital", en: "Digital Services", mr: "डिजिटल सेवा" },
  { value: "infrastructure", en: "Infrastructure", mr: "पायाभूत सुविधा" },
];

export default function AdminSchemeForm({ scheme, onSuccess, onCancel }: AdminSchemeFormProps) {
  const { i18n } = useTranslation();
  const isMarathi = i18n.language?.startsWith("mr");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: "",
    slug: "",
    description: "",
    category: "general",
    year: new Date().getFullYear(),
    status: "active",
    eligibility: "",
    launchDate: "",
    agency: "",
    learnMoreUrl: "",
    displayOrder: 0,
    isPublished: false,
    benefits: "",
    applicationProcess: "",
    thumbnailPath: "",
  });

  useEffect(() => {
    if (!scheme) return;
    setForm({
      title: scheme.title,
      slug: scheme.slug,
      description: scheme.description,
      category: scheme.category,
      year: scheme.year,
      status: scheme.status,
      eligibility: scheme.eligibility || "",
      launchDate: scheme.launchDate || "",
      agency: scheme.agency || "",
      learnMoreUrl: scheme.learnMoreUrl || "",
      displayOrder: scheme.displayOrder || 0,
      isPublished: scheme.isPublished,
      benefits: (scheme.benefits || []).join("\n"),
      applicationProcess: (scheme.applicationProcess || []).join("\n"),
      thumbnailPath: scheme.thumbnailPath || "",
    });
  }, [scheme]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.title),
        benefits: form.benefits
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        applicationProcess: form.applicationProcess
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (scheme?._id) {
        await updateScheme(scheme._id, payload);
      } else {
        await createScheme(payload);
      }
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploadedPath = await uploadSchemeThumbnail(file);
      setForm((prev) => ({ ...prev, thumbnailPath: uploadedPath }));
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 border rounded-lg p-4">
        <h3 className="font-semibold text-slate-800 mb-3">
          {isMarathi ? "मूलभूत माहिती" : "Basic Information"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm text-slate-700">
            {isMarathi ? "योजनेचे नाव *" : "Scheme Title *"}
            <input className="border rounded p-2 w-full mt-1" placeholder={isMarathi ? "उदा. नवजीवन योजना" : "e.g. Navjeevan Yojana"} value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value, slug: slugify(e.target.value) }))} required />
          </label>
          <label className="text-sm text-slate-700">
            {isMarathi ? "स्लग (URL नाव) *" : "Slug (URL Name) *"}
            <input className="border rounded p-2 w-full mt-1" placeholder="navjeevan-yojana" value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))} required />
          </label>
          <label className="text-sm text-slate-700">
            {isMarathi ? "योजना श्रेणी *" : "Scheme Category *"}
            <select className="border rounded p-2 w-full mt-1" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {isMarathi ? option.mr : option.en}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-slate-700">
            {isMarathi ? "वर्ष *" : "Year *"}
            <input className="border rounded p-2 w-full mt-1" type="number" placeholder="2026" value={form.year} onChange={(e) => setForm((prev) => ({ ...prev, year: Number(e.target.value) }))} required />
          </label>
          <label className="text-sm text-slate-700">
            {isMarathi ? "लॉन्च तारीख" : "Launch Date"}
            <input className="border rounded p-2 w-full mt-1" placeholder={isMarathi ? "उदा. जानेवारी 2026" : "e.g. January 2026"} value={form.launchDate} onChange={(e) => setForm((prev) => ({ ...prev, launchDate: e.target.value }))} />
          </label>
          <label className="text-sm text-slate-700">
            {isMarathi ? "अंमलबजावणी संस्था" : "Implementing Agency"}
            <input className="border rounded p-2 w-full mt-1" placeholder={isMarathi ? "उदा. ग्रामीण विकास मंत्रालय" : "e.g. Ministry of Rural Development"} value={form.agency} onChange={(e) => setForm((prev) => ({ ...prev, agency: e.target.value }))} />
          </label>
          <label className="text-sm text-slate-700 md:col-span-2">
            {isMarathi ? "अधिक माहितीसाठी लिंक" : "Learn More URL"}
            <input className="border rounded p-2 w-full mt-1" placeholder="https://example.gov.in/scheme" value={form.learnMoreUrl} onChange={(e) => setForm((prev) => ({ ...prev, learnMoreUrl: e.target.value }))} />
          </label>
        </div>
      </div>

      <div className="bg-slate-50 border rounded-lg p-4">
        <h3 className="font-semibold text-slate-800 mb-3">
          {isMarathi ? "तपशील" : "Scheme Details"}
        </h3>
        <div className="space-y-4">
          <label className="text-sm text-slate-700 block">
            {isMarathi ? "वर्णन *" : "Description *"}
            <textarea className="border rounded p-2 w-full mt-1" rows={4} placeholder={isMarathi ? "योजनेचे संपूर्ण वर्णन लिहा" : "Write complete scheme description"} value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} required />
          </label>
          <label className="text-sm text-slate-700 block">
            {isMarathi ? "पात्रता" : "Eligibility"}
            <textarea className="border rounded p-2 w-full mt-1" rows={3} placeholder={isMarathi ? "कोण अर्ज करू शकतो?" : "Who can apply?"} value={form.eligibility} onChange={(e) => setForm((prev) => ({ ...prev, eligibility: e.target.value }))} />
          </label>
          <label className="text-sm text-slate-700 block">
            {isMarathi ? "फायदे (प्रत्येक ओळीत एक)" : "Benefits (one per line)"}
            <textarea className="border rounded p-2 w-full mt-1" rows={4} placeholder={isMarathi ? "उदा. आर्थिक मदत" : "e.g. Financial support"} value={form.benefits} onChange={(e) => setForm((prev) => ({ ...prev, benefits: e.target.value }))} />
          </label>
          <label className="text-sm text-slate-700 block">
            {isMarathi ? "अर्ज प्रक्रिया (प्रत्येक ओळीत एक टप्पा)" : "Application Process (one step per line)"}
            <textarea className="border rounded p-2 w-full mt-1" rows={4} placeholder={isMarathi ? "उदा. 1) फॉर्म भरा" : "e.g. 1) Fill form"} value={form.applicationProcess} onChange={(e) => setForm((prev) => ({ ...prev, applicationProcess: e.target.value }))} />
          </label>
        </div>
      </div>

      <div className="bg-slate-50 border rounded-lg p-4">
        <h3 className="font-semibold text-slate-800 mb-3">
          {isMarathi ? "प्रकाशन व मीडिया" : "Publishing & Media"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm text-slate-700">
            {isMarathi ? "स्थिती" : "Status"}
            <select className="border rounded p-2 w-full mt-1" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as "active" | "inactive" }))}>
              <option value="active">{isMarathi ? "सक्रिय" : "Active"}</option>
              <option value="inactive">{isMarathi ? "निष्क्रिय" : "Inactive"}</option>
            </select>
          </label>
          <label className="text-sm text-slate-700">
            {isMarathi ? "प्रदर्शन क्रम (कमी क्रमांक आधी)" : "Display Order (lower shows first)"}
            <input className="border rounded p-2 w-full mt-1" type="number" value={form.displayOrder} onChange={(e) => setForm((prev) => ({ ...prev, displayOrder: Number(e.target.value) }))} />
          </label>
        </div>

        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.checked }))} />
          {isMarathi ? "सार्वजनिकरित्या प्रकाशित करा" : "Publish to public"}
        </label>
        <div className="mt-3">
          <label className="text-sm text-slate-700 block mb-1">
            {isMarathi ? "थंबनेल प्रतिमा (JPG/PNG)" : "Thumbnail Image (JPG/PNG)"}
          </label>
          <input type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleThumbnailUpload} />
          {uploading && <span className="text-sm text-gray-500 ml-2">{isMarathi ? "थंबनेल अपलोड होत आहे..." : "Uploading thumbnail..."}</span>}
        </div>
      </div>

      {form.thumbnailPath && (
        <img src={resolveSchemeAssetUrl(form.thumbnailPath)} alt="Thumbnail preview" className="h-24 w-40 object-cover rounded border" />
      )}

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {loading
            ? (isMarathi ? "जतन होत आहे..." : "Saving...")
            : scheme
              ? (isMarathi ? "योजना अपडेट करा" : "Update Scheme")
              : (isMarathi ? "योजना तयार करा" : "Create Scheme")}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          {isMarathi ? "रद्द करा" : "Cancel"}
        </button>
      </div>
    </form>
  );
}
