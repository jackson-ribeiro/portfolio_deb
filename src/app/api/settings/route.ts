import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { defaultSettings } from "@/lib/settings";

// GET - Buscar configurações
export async function GET() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "site-settings" },
  });

  if (!settings) {
    return NextResponse.json(defaultSettings);
  }

  return NextResponse.json(settings);
}

// PUT - Atualizar configurações
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();

  const settings = await prisma.siteSettings.upsert({
    where: { id: "site-settings" },
    update: {
      name: body.name,
      title: body.title,
      bio: body.bio,
      profilePhotoUrl: body.profilePhotoUrl,
      profilePhotoId: body.profilePhotoId,
      resumeUrl: body.resumeUrl,
      resumeId: body.resumeId,
      email: body.email,
      linkedinUrl: body.linkedinUrl,
      instagramUrl: body.instagramUrl,
      skills: body.skills ?? [],
      experiences: body.experiences ?? [],
      education: body.education ?? [],
    },
    create: {
      id: "site-settings",
      name: body.name ?? "",
      title: body.title ?? "",
      bio: body.bio ?? "",
      profilePhotoUrl: body.profilePhotoUrl,
      profilePhotoId: body.profilePhotoId,
      resumeUrl: body.resumeUrl,
      resumeId: body.resumeId,
      email: body.email ?? "",
      linkedinUrl: body.linkedinUrl,
      instagramUrl: body.instagramUrl,
      skills: body.skills ?? [],
      experiences: body.experiences ?? [],
      education: body.education ?? [],
    },
  });

  return NextResponse.json(settings);
}
