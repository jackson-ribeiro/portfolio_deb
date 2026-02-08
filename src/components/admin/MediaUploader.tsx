"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import type { Media } from "@/types";

interface MediaUploaderProps {
  projectId: string;
  media: Media[];
  onMediaChange: (media: Media[]) => void;
}

export function MediaUploader({ projectId, media, onMediaChange }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = useCallback(
    async (files: FileList) => {
      setUploading(true);

      const newMedia: Media[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("projectId", projectId);

        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (res.ok) {
            const mediaItem = await res.json();
            newMedia.push(mediaItem);
          }
        } catch (error) {
          console.error("Erro no upload:", error);
        }
      }

      onMediaChange([...media, ...newMedia]);
      setUploading(false);
    },
    [projectId, media, onMediaChange]
  );

  const handleDelete = async (mediaId: string) => {
    try {
      const res = await fetch(`/api/upload?id=${mediaId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        onMediaChange(media.filter((m) => m.id !== mediaId));
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);

      if (e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [handleUpload]
  );

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver ? "border-zinc-500 bg-zinc-50" : "border-zinc-300"
        }`}
      >
        <input
          type="file"
          id="media-upload"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />
        <label htmlFor="media-upload" className="cursor-pointer">
          <div className="space-y-2">
            <svg className="mx-auto h-12 w-12 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-zinc-600">
              {uploading ? "Enviando..." : "Arraste arquivos ou clique para selecionar"}
            </p>
            <p className="text-sm text-zinc-400">Imagens e vídeos</p>
          </div>
        </label>
      </div>

      {media.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {media.map((item) => (
            <div key={item.id} className="relative group">
              {item.type === "video" ? (
                <video
                  src={item.url}
                  className="w-full h-32 object-cover rounded-lg"
                  muted
                />
              ) : (
                <img
                  src={item.url}
                  alt=""
                  className="w-full h-32 object-cover rounded-lg"
                />
              )}
              <Button
                variant="danger"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(item.id)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
              {item.type === "video" && (
                <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Vídeo
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
