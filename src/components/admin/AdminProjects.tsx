import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Plus, Pencil, Trash2, X, Image as ImageIcon } from "lucide-react";
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
  featured: z.boolean().default(false),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function AdminProjects() {
  const { data: projectsData, isLoading } = trpc.project.list.useQuery();
  const utils = trpc.useUtils();
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectFormData | null>(null);

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
  );
}

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

  const nameValue = watch("name");

  // Auto-generate slug from name if it's a new project
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images (Comma separated URLs)
              </label>
              <textarea
                {...register("images")}
                rows={3}
                placeholder="https://image1.jpg, https://image2.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--rc-blue)] outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Currently supporting URL inputs. Separate multiple images with commas.
              </p>
            </div>
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
