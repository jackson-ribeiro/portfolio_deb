import { prisma } from "./prisma";
import { cache } from "react";
import type { SiteSettings, Skill, Experience, Education } from "@/types";

export const defaultSettings: SiteSettings = {
  id: "site-settings",
  name: "",
  title: "",
  bio: "",
  profilePhotoUrl: null,
  profilePhotoId: null,
  resumeUrl: null,
  resumeId: null,
  email: "",
  linkedinUrl: null,
  instagramUrl: null,
  skills: [],
  experiences: [],
  education: [],
};

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "site-settings" },
  });

  if (!settings) {
    return defaultSettings;
  }

  return {
    ...settings,
    skills: settings.skills as Skill[],
    experiences: settings.experiences as Experience[],
    education: settings.education as Education[],
  };
});
