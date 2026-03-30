import { api } from "./axios";

export interface Scheme {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  year: number;
  status: "active" | "inactive";
  benefits: string[];
  eligibility: string;
  applicationProcess: string[];
  thumbnailPath: string;
  learnMoreUrl: string;
  launchDate: string;
  agency: string;
  isPublished: boolean;
  displayOrder: number;
}

export interface SchemeListResponse {
  schemes: Scheme[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const getSchemes = async (params?: Record<string, string | number | boolean>) => {
  const response = await api.get("/schemes", { params });
  return response.data.data as SchemeListResponse;
};

export const getAdminSchemes = async () => {
  const response = await api.get("/schemes/admin/all");
  return response.data.data.schemes as Scheme[];
};

export const getSchemeByIdOrSlug = async (idOrSlug: string) => {
  const response = await api.get(`/schemes/${idOrSlug}`);
  return response.data.data as Scheme;
};

export const createScheme = async (payload: Partial<Scheme>) => {
  const response = await api.post("/schemes", payload);
  return response.data.data as Scheme;
};

export const updateScheme = async (id: string, payload: Partial<Scheme>) => {
  const response = await api.put(`/schemes/${id}`, payload);
  return response.data.data as Scheme;
};

export const deleteScheme = async (id: string) => {
  await api.delete(`/schemes/${id}`);
};

export const publishScheme = async (id: string, isPublished: boolean) => {
  const response = await api.patch(`/schemes/${id}/publish`, { isPublished });
  return response.data.data as Scheme;
};

export const uploadSchemeThumbnail = async (file: File) => {
  const formData = new FormData();
  formData.append("thumbnail", file);
  const response = await api.post("/schemes/upload-thumbnail", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data.thumbnailPath as string;
};

export const resolveSchemeAssetUrl = (assetPath?: string) => {
  if (!assetPath) return "https://via.placeholder.com/300x200?text=Scheme";
  if (assetPath.startsWith("http")) return assetPath;
  const baseURL = String(api.defaults.baseURL || "");
  const apiOrigin = baseURL.replace(/\/api\/?$/, "");
  return `${apiOrigin}${assetPath}`;
};
