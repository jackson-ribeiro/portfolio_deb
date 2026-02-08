import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [projectCount, publishedCount, categoryCount] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.category.count(),
  ]);

  const recentProjects = await prisma.project.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-zinc-600">Visão geral do seu portfólio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
          <p className="text-sm text-zinc-600">Total de Projetos</p>
          <p className="text-3xl font-bold text-zinc-900 mt-1">{projectCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
          <p className="text-sm text-zinc-600">Publicados</p>
          <p className="text-3xl font-bold text-zinc-900 mt-1">{publishedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
          <p className="text-sm text-zinc-600">Categorias</p>
          <p className="text-3xl font-bold text-zinc-900 mt-1">{categoryCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200">
        <div className="p-6 border-b border-zinc-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-zinc-900">Projetos Recentes</h2>
          <Link
            href="/admin/projetos/novo"
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            + Novo Projeto
          </Link>
        </div>

        {recentProjects.length > 0 ? (
          <ul className="divide-y divide-zinc-200">
            {recentProjects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/admin/projetos/${project.id}`}
                  className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-zinc-900">{project.title}</p>
                    <p className="text-sm text-zinc-500">{project.category.name}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      project.published
                        ? "bg-green-100 text-green-800"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {project.published ? "Publicado" : "Rascunho"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-6 text-center text-zinc-500">
            Nenhum projeto criado ainda.{" "}
            <Link href="/admin/projetos/novo" className="text-zinc-900 underline">
              Criar primeiro projeto
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
