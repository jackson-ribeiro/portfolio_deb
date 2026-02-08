import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Novo Projeto</h1>
        <p className="text-zinc-600">Adicione um novo projeto ao seu portfólio</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <ProjectForm />
      </div>
    </div>
  );
}
