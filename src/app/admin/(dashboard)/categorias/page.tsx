"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { projects: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    category: Category | null;
  }>({ isOpen: false, category: null });
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });

      if (res.ok) {
        setNewCategory("");
        fetchCategories();
      }
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (category: Category) => {
    setDeleteModal({ isOpen: true, category });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, category: null });
  };

  const handleDelete = async () => {
    if (!deleteModal.category) return;

    setDeleting(true);

    try {
      const res = await fetch(`/api/categories/${deleteModal.category.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCategories();
        closeDeleteModal();
      } else {
        console.error("Erro ao excluir categoria");
      }
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Categorias</h1>
        <p className="text-zinc-600">Organize seus projetos por categorias</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Input
            placeholder="Nome da categoria"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" loading={loading}>
            Adicionar
          </Button>
        </form>
      </div>

      {categories.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
          <ul className="divide-y divide-zinc-200">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <p className="font-medium text-zinc-900">{category.name}</p>
                  <p className="text-sm text-zinc-500">/{category.slug}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-zinc-600">
                    {category._count.projects} projeto(s)
                  </span>
                  <button
                    onClick={() => openDeleteModal(category)}
                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir categoria"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-12 text-center">
          <p className="text-zinc-500">Nenhuma categoria criada ainda.</p>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        title="Excluir categoria"
      >
        <div className="space-y-4">
          {deleteModal.category && deleteModal.category._count.projects > 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-medium text-amber-800">Atenção!</p>
                  <p className="text-amber-700 text-sm mt-1">
                    Esta categoria contém <strong>{deleteModal.category._count.projects} projeto(s)</strong> que também serão excluídos permanentemente.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-zinc-600">
              Tem certeza que deseja excluir a categoria <strong>&quot;{deleteModal.category?.name}&quot;</strong>?
            </p>
          )}

          <p className="text-sm text-zinc-500">
            Esta ação não pode ser desfeita.
          </p>

          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="secondary"
              onClick={closeDeleteModal}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deleting}
            >
              {deleteModal.category && deleteModal.category._count.projects > 0
                ? "Excluir tudo"
                : "Excluir"
              }
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
