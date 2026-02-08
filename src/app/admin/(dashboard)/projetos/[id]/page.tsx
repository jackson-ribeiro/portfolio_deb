import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { DeleteProjectButton } from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      category: true,
      media: { orderBy: { order: "asc" } },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Editar Projeto</h1>
          <p className="text-zinc-600">{project.title}</p>
        </div>
        <DeleteProjectButton projectId={project.id} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <ProjectForm project={project as never} />
      </div>
    </div>
  );
}
