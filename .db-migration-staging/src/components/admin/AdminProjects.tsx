import { useState, useRef, useCallback } from "react";
import { uploadImageFile } from "@/lib/upload";
import { trpc } from "@/providers/trpc";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Image as ImageIcon,
  Upload,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const projectSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  area: z.string().optional(),
  type: z.enum(["residential", "commercial", "renovation", "interior"]),
  status: z.enum(["ongoing", "completed"]),
  images: z.string().optional(),
  featured: z.boolean().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function AdminProjects() {
  const { data: projectsData, isLoading } = trpc.project.list.useQuery();
  const utils = trpc.useUtils();
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectFormData | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const createMutation = trpc.project.create.useMutation({
    onSuccess: () => {
      utils.project.list.invalidate();
      utils.admin.dashboardStats.invalidate();
      setIsEditing(false);
    },
  });

  const updateMutation = trpc.project.update.useMutation({
    onSuccess: () => {
      utils.project.list.invalidate();
      setIsEditing(false);
    },
  });

  const deleteMutation = trpc.project.delete.useMutation({
    onSuccess: () => {
      utils.project.list.invalidate();
      utils.admin.dashboardStats.invalidate();
    },
  });

  const handleEdit = (project: any) => {
    setCurrentProject({
      ...project,
      featured: project.featured || false,
    });
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteMutation.mutate({ id });
    }
  };

  if (isEditing) {
    return (
      <ProjectForm
        project={currentProject}
        onCancel={() => setIsEditing(false)}
        onSubmit={(data) => {
          if (data.id) {
            updateMutation.mutate(data as any);
          } else {
            createMutation.mutate(data as any);
          }
        }}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-[var(--rc-border)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--rc-border)] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--rc-dark)]">
              Projects Portfolio
            </h2>
            <span className="text-sm text-[var(--rc-muted)]">
              {projectsData?.total || 0} projects
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Import Excel
            </button>
            <button
              onClick={() => {
                setCurrentProject(null);
                setIsEditing(true);
              }}
              className="flex items-center gap-2 bg-[var(--rc-blue)] text-white px-4 py-2 rounded-lg text-sm hover:bg-[var(--rc-orange)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-[var(--rc-muted)]">Loading...</div>
        ) : !projectsData?.items || projectsData.items.length === 0 ? (
          <div className="p-8 text-center text-[var(--rc-muted)]">
            No projects found. Create one to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--rc-gray)]">
                <tr className="border-b border-[var(--rc-border)]">
                  <th className="text-left px-6 py-3 font-medium text-[var(--rc-muted)]">
                    Project
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--rc-muted)]">
                    Type / Status
                  </th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--rc-muted)]">
                    Featured
                  </th>
                  <th className="text-right px-6 py-3 font-medium text-[var(--rc-muted)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projectsData.items.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-[var(--rc-border)] hover:bg-[var(--rc-gray)]/50 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {project.images ? (
                          <img
                            src={project.images.split(",")[0]}
                            alt={project.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--rc-dark)]">
                          {project.name}
                        </p>
                        <p className="text-xs text-[var(--rc-muted)] truncate max-w-[200px]">
                          {project.location || "No location set"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize">{project.type}</span>
                      <br />
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                          project.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {project.featured ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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

      {showImportModal && (
        <ExcelImportModal
          onClose={() => setShowImportModal(false)}
          onImportComplete={() => {
            utils.project.list.invalidate();
            utils.admin.dashboardStats.invalidate();
          }}
        />
      )}
    </>
  );
}

/* ─────────────────────── Image Upload Component ─────────────────────── */

function ImageUploadZone({
  imageUrls,
  onChange,
}: {
  imageUrls: string[];
  onChange: (urls: string[]) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const imageFiles = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (imageFiles.length === 0) {
        setUploadError("Please select image files only (jpg, png, webp, etc.)");
        return;
      }

      setIsUploading(true);
      setUploadError(null);

      try {
        // Upload independently so one bad file cannot keep the remaining
        // selected images from being added to the project.
        const results = await Promise.allSettled(
          imageFiles.map((file) => uploadImageFile(file))
        );
        const newUrls = results
          .filter((result): result is PromiseFulfilledResult<string> => result.status === "fulfilled")
          .map((result) => result.value);
        const failures = results.filter(
          (result): result is PromiseRejectedResult => result.status === "rejected"
        );

        if (newUrls.length > 0) {
          onChange([...imageUrls, ...newUrls]);
        }

        if (failures.length > 0) {
          console.error("Image upload failed:", failures.map((failure) => failure.reason));
          const firstError = failures[0]?.reason;
          const message = firstError instanceof Error ? firstError.message : "Unknown error";
          setUploadError(
            newUrls.length > 0
              ? `${failures.length} image(s) failed to upload: ${message}`
              : `Image upload failed: ${message}`
          );
        }
      } catch (error) {
        // Promise.allSettled should make this path exceptional, but retain a
        // visible error for unexpected client-side failures.
        console.error("Unable to start image upload:", error);
        setUploadError("Image upload failed. Please try again.");
      } finally {
        // Never leave the editor in an uploading state after a failed request,
        // aborted request, or rendering error.
        setIsUploading(false);
      }
    },
    [imageUrls, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = (index: number) => {
    onChange(imageUrls.filter((_, i) => i !== index));
  };

  const addManualUrl = () => {
    const trimmed = manualUrl.trim();
    if (trimmed && !imageUrls.includes(trimmed)) {
      onChange([...imageUrls, trimmed]);
      setManualUrl("");
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Project Images
      </label>

      {/* Thumbnail Grid */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {imageUrls.map((url, i) => (
            <div
              key={i}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
            >
              <img
                src={url}
                alt={`Image ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "";
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).parentElement!.classList.add("flex", "items-center", "justify-center");
                  const placeholder = document.createElement("div");
                  placeholder.className = "text-xs text-gray-400 text-center p-1";
                  placeholder.textContent = "Invalid URL";
                  (e.target as HTMLImageElement).parentElement!.appendChild(placeholder);
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {i === 0 && (
                <span className="absolute top-1 left-1 text-[10px] font-bold bg-[var(--rc-blue)] text-white px-1.5 py-0.5 rounded">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all ${
          isDragging
            ? "border-[var(--rc-blue)] bg-blue-50/50 scale-[1.01]"
            : "border-gray-300 hover:border-[var(--rc-blue)]/50 hover:bg-gray-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="w-8 h-8 text-[var(--rc-blue)] animate-spin" />
            <p className="text-sm text-[var(--rc-blue)] font-medium">
              Uploading images...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Upload className="w-6 h-6 text-[var(--rc-blue)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                <span className="text-[var(--rc-blue)]">Click to upload</span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                PNG, JPG, WEBP up to 10MB each
              </p>
            </div>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {uploadError}
        </div>
      )}

      {/* Manual URL Input */}
      <div>
        {!showUrlInput ? (
          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="text-xs text-[var(--rc-blue)] hover:text-[var(--rc-orange)] transition-colors font-medium"
          >
            + Add image by URL
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addManualUrl())}
              placeholder="https://example.com/image.webp"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--rc-blue)] focus:border-transparent outline-none"
            />
            <button
              type="button"
              onClick={addManualUrl}
              className="px-3 py-2 text-sm bg-[var(--rc-blue)] text-white rounded-lg hover:bg-[var(--rc-orange)] transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => { setShowUrlInput(false); setManualUrl(""); }}
              className="px-2 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────── Project Form ─────────────────────── */

function ProjectForm({
  project,
  onCancel,
  onSubmit,
  isPending,
}: {
  project: ProjectFormData | null;
  onCancel: () => void;
  onSubmit: (data: ProjectFormData) => void;
  isPending: boolean;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: project || {
      type: "residential",
      status: "completed",
      featured: false,
    },
  });

  // Parse existing images from comma-separated string
  const currentImages = watch("images");
  const imageUrls = currentImages
    ? currentImages
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const handleImagesChange = (urls: string[]) => {
    setValue("images", urls.join(", "), { shouldValidate: true });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("name", e.target.value);
    if (!project) {
      setValue(
        "slug",
        e.target.value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--rc-border)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--rc-border)] flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--rc-dark)]">
          {project ? "Edit Project" : "New Project"}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-[var(--rc-muted)] hover:bg-[var(--rc-gray)] rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                {...register("name")}
                onChange={handleNameChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--rc-blue)] focus:border-transparent outline-none transition-all"
                placeholder="e.g. Modern Villa"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                {...register("slug")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--rc-blue)] outline-none"
                placeholder="e.g. modern-villa"
              />
              {errors.slug && (
                <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                {...register("location")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--rc-blue)] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area (e.g. 2500 sq ft)
              </label>
              <input
                {...register("area")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--rc-blue)] outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Type
              </label>
              <select
                {...register("type")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--rc-blue)] outline-none"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="renovation">Renovation</option>
                <option value="interior">Interior</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--rc-blue)] outline-none"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Image Upload Zone replaces the old URL textarea */}
            <ImageUploadZone
              imageUrls={imageUrls}
              onChange={handleImagesChange}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--rc-blue)] outline-none"
          />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            {...register("featured")}
            className="w-4 h-4 text-[var(--rc-blue)] rounded border-gray-300 focus:ring-[var(--rc-blue)]"
          />
          <label htmlFor="featured" className="text-sm text-gray-700">
            Feature this project on the homepage
          </label>
        </div>

        <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-[var(--rc-border)]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--rc-blue)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-[var(--rc-blue)] rounded-lg hover:bg-[var(--rc-orange)] focus:outline-none focus:ring-2 focus:ring-[var(--rc-orange)] disabled:opacity-50 transition-colors"
          >
            {isPending ? "Saving..." : "Save Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─────────────────────── Excel Import Modal ─────────────────────── */

type ImportResult = {
  total: number;
  success: number;
  failed: number;
  errors: string[];
};

function ExcelImportModal({
  onClose,
  onImportComplete,
}: {
  onClose: () => void;
  onImportComplete: () => void;
}) {
  const [stage, setStage] = useState<"upload" | "preview" | "importing" | "done">("upload");
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createMutation = trpc.project.create.useMutation();

  const handleFile = async (file: File) => {
    setParseError(null);
    try {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      const buffer = await file.arrayBuffer();
      await workbook.xlsx.load(buffer);

      const sheet = workbook.worksheets[0];
      if (!sheet) {
        setParseError("No worksheet found in the Excel file.");
        return;
      }

      // Read header row to map columns
      const headerRow = sheet.getRow(1);
      const headerMap: Record<string, number> = {};
      headerRow.eachCell((cell, colNumber) => {
        const val = String(cell.value || "").trim().toLowerCase();
        headerMap[val] = colNumber;
      });

      // Validate required columns
      if (!headerMap["name"]) {
        setParseError(
          'Missing required column "Name". Expected columns: Name, Slug, Description, Location, Area, Type, Status, Images, Featured'
        );
        return;
      }

      const rows: any[] = [];
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // skip header

        const getCellValue = (key: string) => {
          const col = headerMap[key];
          if (!col) return "";
          const val = row.getCell(col).value;
          return val != null ? String(val).trim() : "";
        };

        const name = getCellValue("name");
        if (!name) return; // skip empty rows

        const slug =
          getCellValue("slug") ||
          name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        const rawType = getCellValue("type").toLowerCase();
        const type = ["residential", "commercial", "renovation", "interior"].includes(rawType)
          ? rawType
          : "residential";

        const rawStatus = getCellValue("status").toLowerCase();
        const status = ["ongoing", "completed"].includes(rawStatus)
          ? rawStatus
          : "completed";

        const featuredStr = getCellValue("featured").toLowerCase();
        const featured = ["yes", "true", "1", "y"].includes(featuredStr);

        rows.push({
          name,
          slug,
          description: getCellValue("description"),
          location: getCellValue("location"),
          area: getCellValue("area"),
          type,
          status,
          images: getCellValue("images"),
          featured,
        });
      });

      if (rows.length === 0) {
        setParseError("No project rows found in the Excel file. Make sure data starts from row 2.");
        return;
      }

      setParsedRows(rows);
      setStage("preview");
    } catch (err: any) {
      setParseError(`Failed to parse Excel file: ${err.message || "Unknown error"}`);
    }
  };

  const handleImport = async () => {
    setStage("importing");
    setProgress(0);

    const result: ImportResult = { total: parsedRows.length, success: 0, failed: 0, errors: [] };

    for (let i = 0; i < parsedRows.length; i++) {
      try {
        await createMutation.mutateAsync(parsedRows[i]);
        result.success++;
      } catch (err: any) {
        result.failed++;
        result.errors.push(
          `Row ${i + 2}: ${parsedRows[i].name} — ${err.message || "Unknown error"}`
        );
      }
      setProgress(Math.round(((i + 1) / parsedRows.length) * 100));
    }

    setImportResult(result);
    setStage("done");
    onImportComplete();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--rc-border)] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--rc-dark)]">
                Import Projects from Excel
              </h2>
              <p className="text-xs text-[var(--rc-muted)]">
                Bulk import projects from an .xlsx file
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Upload Stage */}
          {stage === "upload" && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                    e.target.value = "";
                  }}
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      <span className="text-emerald-600">Click to browse</span>{" "}
                      or drag your Excel file here
                    </p>
                    <p className="text-xs text-gray-500 mt-1">.xlsx files only</p>
                  </div>
                </div>
              </div>

              {parseError && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{parseError}</span>
                </div>
              )}

              {/* Expected Format Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Expected Excel Format
                </p>
                <p className="text-xs text-gray-500">
                  The first row should be headers. Supported columns:
                </p>
                <div className="overflow-x-auto">
                  <table className="text-xs w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-1.5 pr-3 font-semibold text-gray-600">Column</th>
                        <th className="text-left py-1.5 pr-3 font-semibold text-gray-600">Required</th>
                        <th className="text-left py-1.5 font-semibold text-gray-600">Values</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-500">
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 pr-3 font-medium text-gray-700">Name</td>
                        <td className="py-1.5 pr-3">✅ Yes</td>
                        <td className="py-1.5">Project name</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 pr-3 font-medium text-gray-700">Slug</td>
                        <td className="py-1.5 pr-3">Auto-generated</td>
                        <td className="py-1.5">URL-friendly name</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 pr-3 font-medium text-gray-700">Description</td>
                        <td className="py-1.5 pr-3">Optional</td>
                        <td className="py-1.5">Project description</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 pr-3 font-medium text-gray-700">Location</td>
                        <td className="py-1.5 pr-3">Optional</td>
                        <td className="py-1.5">City / Area</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 pr-3 font-medium text-gray-700">Area</td>
                        <td className="py-1.5 pr-3">Optional</td>
                        <td className="py-1.5">e.g. 2500 sq ft</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 pr-3 font-medium text-gray-700">Type</td>
                        <td className="py-1.5 pr-3">Optional</td>
                        <td className="py-1.5">residential, commercial, renovation, interior</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 pr-3 font-medium text-gray-700">Status</td>
                        <td className="py-1.5 pr-3">Optional</td>
                        <td className="py-1.5">ongoing, completed</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 pr-3 font-medium text-gray-700">Images</td>
                        <td className="py-1.5 pr-3">Optional</td>
                        <td className="py-1.5">Comma-separated image URLs</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-3 font-medium text-gray-700">Featured</td>
                        <td className="py-1.5 pr-3">Optional</td>
                        <td className="py-1.5">yes / no</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Preview Stage */}
          {stage === "preview" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-4 py-3 rounded-lg">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>
                  Found <strong>{parsedRows.length}</strong> project{parsedRows.length !== 1 ? "s" : ""} ready
                  to import.
                </span>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">#</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">Name</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">Type</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">Status</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">Location</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-600">Featured</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.map((row, i) => (
                      <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                        <td className="px-3 py-2 font-medium text-gray-800 max-w-[180px] truncate">
                          {row.name}
                        </td>
                        <td className="px-3 py-2 capitalize text-gray-600">{row.type}</td>
                        <td className="px-3 py-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              row.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-600 max-w-[120px] truncate">
                          {row.location || "—"}
                        </td>
                        <td className="px-3 py-2 text-gray-600">
                          {row.featured ? "Yes" : "No"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Importing Stage */}
          {stage === "importing" && (
            <div className="py-8 flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-[var(--rc-blue)] animate-spin" />
              <div className="text-center">
                <p className="text-lg font-semibold text-[var(--rc-dark)]">
                  Importing Projects...
                </p>
                <p className="text-sm text-[var(--rc-muted)] mt-1">
                  Please don't close this window
                </p>
              </div>
              <div className="w-full max-w-xs">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--rc-blue)] to-[var(--rc-orange)] rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-center text-[var(--rc-muted)] mt-2">
                  {progress}% complete
                </p>
              </div>
            </div>
          )}

          {/* Done Stage */}
          {stage === "done" && importResult && (
            <div className="space-y-4 py-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-[var(--rc-dark)]">Import Complete</h3>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-[var(--rc-dark)]">{importResult.total}</p>
                  <p className="text-xs text-[var(--rc-muted)]">Total</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{importResult.success}</p>
                  <p className="text-xs text-emerald-600">Imported</p>
                </div>
                <div className={`rounded-lg p-3 text-center ${importResult.failed > 0 ? "bg-red-50" : "bg-gray-50"}`}>
                  <p className={`text-2xl font-bold ${importResult.failed > 0 ? "text-red-600" : "text-gray-400"}`}>
                    {importResult.failed}
                  </p>
                  <p className={`text-xs ${importResult.failed > 0 ? "text-red-600" : "text-gray-400"}`}>Failed</p>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="bg-red-50 rounded-lg p-4 space-y-1">
                  <p className="text-sm font-medium text-red-700">Errors:</p>
                  {importResult.errors.map((err, i) => (
                    <p key={i} className="text-xs text-red-600">
                      • {err}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--rc-border)] flex justify-end gap-3 flex-shrink-0 bg-gray-50/50">
          {stage === "upload" && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          {stage === "preview" && (
            <>
              <button
                onClick={() => {
                  setStage("upload");
                  setParsedRows([]);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleImport}
                className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Import {parsedRows.length} Project{parsedRows.length !== 1 ? "s" : ""}
              </button>
            </>
          )}
          {stage === "done" && (
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold text-white bg-[var(--rc-blue)] rounded-lg hover:bg-[var(--rc-orange)] transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
