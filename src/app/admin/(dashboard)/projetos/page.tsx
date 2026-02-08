import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: {
      category: true,
      media: { take: 1, orderBy: { order: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Projetos</h1>
          <p className="text-zinc-600">Gerencie seus projetos</p>
        </div>
        <Link href="/admin/projetos/novo">
          <Button>+ Novo Projeto</Button>
        </Link>
      </div>

      {projects.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-zinc-600">
                  Projeto
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-zinc-600">
                  Categoria
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-zinc-600">
                  Status
                </th>
                <th className="text-right px-6 py-3 text-sm font-medium text-zinc-600">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-zinc-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {project.media[0] ? (
                        <img
                          src={project.media[0].url}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-zinc-200 flex items-center justify-center">
                          <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-zinc-900">{project.title}</p>
                        {project.client && (
                          <p className="text-sm text-zinc-500">{project.client}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600">{project.category.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex text-xs px-2 py-1 rounded-full ${
                        project.published
                          ? "bg-green-100 text-green-800"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {project.published ? "Publicado" : "Rascunho"}
                    </span>
                    {project.featured && (
                      <span className="ml-2 inline-flex text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                        Destacado
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/projetos/${project.id}`}
                      className="text-zinc-600 hover:text-zinc-900"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-zinc-900">Nenhum projeto</h3>
          <p className="mt-2 text-zinc-500">Comece criando seu primeiro projeto.</p>
          <Link href="/admin/projetos/novo" className="mt-4 inline-block">
            <Button>Criar Projeto</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
