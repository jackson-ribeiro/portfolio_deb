"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/admin/projetos");
        router.refresh();
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="danger" onClick={handleDelete} loading={loading}>
      Excluir
    </Button>
  );
}
