import type { Media } from "@/types";

// Limite do plano free do Cloudinary para upload de vídeo.
const MAX_BYTES = 100 * 1024 * 1024; // 100MB

/**
 * Faz upload de um arquivo direto do browser para o Cloudinary e salva os
 * metadados no banco.
 *
 * O arquivo vai direto para o Cloudinary (não passa pela função serverless da
 * Vercel, que limita o body a 4.5MB), então vídeos grandes funcionam em
 * produção. Só os metadados (JSON pequeno) passam pela API route.
 */
export async function uploadMedia(file: File, projectId: string): Promise<Media> {
  if (file.size > MAX_BYTES) {
    const mb = (file.size / 1048576).toFixed(0);
    throw new Error(`"${file.name}" tem ${mb}MB. O máximo permitido é 100MB.`);
  }

  // 1. Assinatura (servidor, autenticado)
  const signRes = await fetch("/api/upload/sign", { method: "POST" });
  if (!signRes.ok) {
    throw new Error("Falha ao autorizar o upload.");
  }
  const { signature, timestamp, folder, apiKey, cloudName } = await signRes.json();

  // 2. Upload direto para o Cloudinary
  const resourceType = file.type.startsWith("video/") ? "video" : "image";
  const cloudForm = new FormData();
  cloudForm.append("file", file);
  cloudForm.append("api_key", apiKey);
  cloudForm.append("timestamp", String(timestamp));
  cloudForm.append("signature", signature);
  cloudForm.append("folder", folder);

  const cloudRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: "POST", body: cloudForm }
  );
  if (!cloudRes.ok) {
    const err = await cloudRes.json().catch(() => null);
    throw new Error(err?.error?.message || "Falha no envio para o Cloudinary.");
  }
  const uploaded = await cloudRes.json();

  // 3. Salvar metadados no banco (body pequeno, passa na Vercel)
  const saveRes = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      type: resourceType,
      projectId,
    }),
  });
  if (!saveRes.ok) {
    throw new Error("Upload concluído, mas falhou ao salvar no projeto.");
  }

  return saveRes.json();
}
