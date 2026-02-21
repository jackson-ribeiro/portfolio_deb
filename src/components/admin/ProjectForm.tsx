"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { MediaUploader } from "./MediaUploader";
import type { Project, Category, Media } from "@/types";

interface ProjectFormProps {
  project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [media, setMedia] = useState<Media[]>(project?.media || []);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    client: project?.client || "",
    year: project?.year?.toString() || "",
    categoryId: project?.categoryId || "",
    featured: project?.featured || false,
    published: project?.published || false,
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const handleAddPendingFiles = useCallback((files: FileList) => {
    setPendingFiles((prev) => [...prev, ...Array.from(files)]);
  }, []);

  const handleRemovePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = project ? `/api/projects/${project.id}` : "/api/projects";
    const method = project ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) return;

      if (!project && pendingFiles.length > 0) {
        const newProject = await res.json();
        for (const file of pendingFiles) {
          const data = new FormData();
          data.append("file", file);
          data.append("projectId", newProject.id);
          await fetch("/api/upload", { method: "POST", body: data });
        }
      }

      router.push("/admin/projetos");
      router.refresh();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Título"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <Select
          label="Categoria"
          id="category"
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          required
        />

        <Input
          label="Cliente"
          id="client"
          value={formData.client}
          onChange={(e) => setFormData({ ...formData, client: e.target.value })}
        />

        <Input
          label="Ano"
          id="year"
          type="number"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
        />
      </div>

      <Textarea
        label="Descrição"
        id="description"
        rows={5}
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Mídia
        </label>

        {project ? (
          <MediaUploader
            projectId={project.id}
            media={media}
            onMediaChange={setMedia}
          />
        ) : (
          <div className="space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files.length > 0) handleAddPendingFiles(e.dataTransfer.files);
              }}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver
                  ? "border-zinc-500 bg-zinc-50 dark:bg-zinc-800"
                  : "border-zinc-300 dark:border-zinc-600"
              }`}
            >
              <input
                type="file"
                id="pending-media"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => e.target.files && handleAddPendingFiles(e.target.files)}
              />
              <label htmlFor="pending-media" className="cursor-pointer">
                <div className="space-y-2">
                  <svg className="mx-auto h-12 w-12 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Arraste arquivos ou clique para selecionar
                  </p>
                  <p className="text-sm text-zinc-400">Imagens e vídeos (enviados ao salvar)</p>
                </div>
              </label>
            </div>

            {pendingFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pendingFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    {file.type.startsWith("video/") ? (
                      <div className="w-full h-32 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.677V15.32a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                        </svg>
                        <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          Vídeo
                        </span>
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemovePendingFile(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <p className="mt-1 text-xs text-zinc-500 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
          />
          <span className="text-sm text-zinc-700 dark:text-zinc-300">Destacado</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
          />
          <span className="text-sm text-zinc-700 dark:text-zinc-300">Publicado</span>
        </label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" loading={loading}>
          {project ? "Salvar Alterações" : "Criar Projeto"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
