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

export interface Skill {
  id: string;
  name: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  course: string;
  institution: string;
  period: string;
}

export interface SiteSettings {
  id: string;
  name: string;
  title: string;
  bio: string;
  profilePhotoUrl: string | null;
  profilePhotoId: string | null;
  resumeUrl: string | null;
  resumeId: string | null;
  email: string;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
}
