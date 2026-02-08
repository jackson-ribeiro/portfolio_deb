export interface Media {
  id: string;
  url: string;
  publicId: string;
  type: "image" | "video";
  order: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  client: string | null;
  year: number | null;
  featured: boolean;
  published: boolean;
  category: Category;
  categoryId: string;
  media: Media[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectFormData {
  title: string;
  description: string;
  client?: string;
  year?: number;
  categoryId: string;
  featured: boolean;
  published: boolean;
}
